#!/usr/bin/env ruby
# frozen_string_literal: true

# Export per-term YAML data and bibliography into JSON for the Vite + Vue
# frontend. Reads from `data/` and `tc-sc/publications.yaml`, writes
# one JSON file per entity into `web/src/data/`.
#
# Usage:
#   scripts/export_for_vite.rb [--data-dir DIR] [--out-dir DIR]
#
# Defaults: data/ and web/src/data/ relative to repo root.

require "optparse"
require "yaml"
require "json"
require "fileutils"

repo_root = File.expand_path("..", __dir__)
options = {
  data_dir: File.join(repo_root, "data"),
  bib_path: File.join(repo_root, "tc-sc", "publications.yaml"),
  out_dir: File.join(repo_root, "web", "src", "data"),
}

OptionParser.new do |opts|
  opts.banner = "Usage: #{$PROGRAM_NAME} [options]"
  opts.on("--data-dir DIR", String) { |v| options[:data_dir] = v }
  opts.on("--bib-path PATH", String) { |v| options[:bib_path] = v }
  opts.on("--out-dir DIR", String) { |v| options[:out_dir] = v }
end.parse!

FileUtils.mkdir_p(options[:out_dir])

# ── Publications ──────────────────────────────────────────────────────────
publications = File.exist?(options[:bib_path]) ?
  YAML.safe_load(File.read(options[:bib_path]), aliases: true) : []
File.write(File.join(options[:out_dir], "publications.json"),
           JSON.generate(publications))

# ── Terms ─────────────────────────────────────────────────────────────────
terms = []
Dir.glob(File.join(options[:data_dir], "*.yaml")).sort.each do |path|
  docs = YAML.safe_load_stream(File.read(path), aliases: true)
  next unless docs.first.is_a?(Hash)
  hash = docs.find { |d| d.is_a?(Hash) && d["data"] && d["data"]["term"] } || docs.first
  data = hash["data"] || {}
  term = {
    "slug" => File.basename(path, ".yaml"),
    "identifier" => data["identifier"],
    "name" => data["term"],
    "kind" => data["kind"],
    "official_concept" => data["official_concept"],
    "editions_present" => data["editions_present"],
    "primary_edition" => data["primary_edition"],
    "publications" => (data["publications"] || []).map do |p|
      p.merge(
        "defined" => data["kind"] == "defined_in_vim" || data["kind"] == "defined_in_viml",
        "official_concept" => data["official_concept"],
        "primary_edition" => data["primary_edition"],
      )
    end,
    "related" => hash["related"] || [],
  }
  terms << term
end
File.write(File.join(options[:out_dir], "terms.json"),
           JSON.generate(terms))

# ── Per-term page data (slug → full hash) ─────────────────────────────────
by_slug = terms.each_with_object({}) { |t, h| h[t["slug"]] = t }
File.write(File.join(options[:out_dir], "term-by-slug.json"),
           JSON.generate(by_slug))

# ── TC/SC list ────────────────────────────────────────────────────────────
tc_set = Set.new
publications.each do |p|
  tc_set << p["tc_sc"] if p["tc_sc"] && !p["tc_sc"].to_s.strip.empty?
end
tc_set << "(Unattributed)"
File.write(File.join(options[:out_dir], "tc.json"),
           JSON.generate(tc_set.sort))

# ── Edition stats ─────────────────────────────────────────────────────────
edition_names = terms.flat_map { |t| t["editions_present"] || [] }.uniq.sort
edition_stats = edition_names.map do |ed|
  instances = terms.sum { |t| (t["publications"] || []).count { |p| p["edition"] == ed } }
  terms_in_ed = terms.count { |t| (t["editions_present"] || []).include?(ed) }
  only_in_ed = terms.count { |t| t["editions_present"] == [ed] }
  # Harmonisation candidates: terms with ≥ 2 distinct source publications
  # in this edition.
  har = terms.count do |t|
    pubs = (t["publications"] || []).select { |p| p["edition"] == ed }
    pubs.map { |p| p["publication_id"] }.compact.uniq.size > 1
  end
  {
    "edition" => ed,
    "primary" => ed == (terms.find { |t| t["primary_edition"] } || {})["primary_edition"],
    "instances" => instances,
    "terms" => terms_in_ed,
    "only_in_edition" => only_in_ed,
    "harmonization_candidates" => har,
  }
end
File.write(File.join(options[:out_dir], "edition-stats.json"),
           JSON.generate("editions" => edition_names,
                         "stats" => edition_stats,
                         "terms_in_both" => terms.count { |t| (t["editions_present"] || []).size > 1 }))

# ── Harmonization candidates ─────────────────────────────────────────────
candidates = terms.select do |t|
  (t["publications"] || []).map { |p| p["publication_id"] }.compact.uniq.size > 1
end.sort_by { |t| -(t["publications"] || []).size }
File.write(File.join(options[:out_dir], "harmonization.json"),
           JSON.generate(candidates))

# ── ID conflicts (raw + designation collisions) ──────────────────────────
raw_conflicts = {}
collisions = {}
terms.each do |t|
  by_ed_base = Hash.new { |h, k| h[k] = Hash.new { |hh, kk| hh[kk] = [] } }
  by_ed_name = Hash.new { |h, k| h[k] = Hash.new { |hh, kk| hh[kk] = [] } }
  (t["publications"] || []).each do |p|
    ed = p["edition"] || "—"
    id = p["g18_entry"]
    next unless id
    base = id.to_s.sub(/[a-z]\z/, "")
    if base != id
      by_ed_base[ed][base] << { designation: t["name"], source: p["publication_id"], raw_id: id }
    end
    by_ed_name[ed][t["name"]] << { id: id, source: p["publication_id"] } if t["name"]
  end
  by_ed_base.each do |ed, ids|
    ids.each do |base, arr|
      next if arr.size < 2
      (raw_conflicts[ed] ||= []) << { id: base, concepts: arr.uniq { |c| c[:designation] } }
    end
  end
  by_ed_name.each do |ed, names|
    names.each do |name, arr|
      unique = arr.map { |x| x[:id] }.uniq
      next if unique.size < 2
      (collisions[ed] ||= []) << { designation: name, ids: unique.sort, count: arr.size }
    end
  end
end
raw_conflicts.transform_values! { |arr| arr.sort_by { |x| x[:id] } }
collisions.transform_values! do |arr|
  arr.sort_by { |x| [-x[:ids].size, x[:designation].downcase] }
end
File.write(File.join(options[:out_dir], "conflicts.json"),
           JSON.generate("raw" => raw_conflicts,
                         "designation_collisions" => collisions))

puts "Exported for Vite:"
puts "  Publications:        #{publications.size}"
puts "  Terms:               #{terms.size}"
puts "  TCs:                 #{tc_set.size}"
puts "  Editions:            #{edition_names.join(', ')}"
puts "  Harmonisation cands: #{candidates.size}"
puts "  Raw conflicts:       #{raw_conflicts.values.sum(&:size)}"
puts "  Designation coll:    #{collisions.values.sum(&:size)}"
puts "  Output: #{options[:out_dir]}/"
