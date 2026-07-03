# frozen_string_literal: true

# YAML and bibliography loading helpers + source-field extraction.
# Pure functions: no mutation of the inputs.

module G18
  module Migration
    module Loaders
      module_function

      def load_bibliography(path)
        entries = YAML.safe_load(File.read(path), aliases: true) || []
        entries = entries.is_a?(Array) ? entries : [entries]
        entries.each_with_object({}) { |e, h| h[e["id"]] = e if e.is_a?(Hash) }
      end

      def load_concept_dir(dir, edition: nil)
        Dir.glob(File.join(dir, "*.yaml")).sort.map do |file|
          load_concept_file(file, edition: edition)
        end
      end

      def load_concept_file(file, edition: nil)
        docs = YAML.safe_load_stream(File.read(file), filename: file, aliases: true)
        meta = docs.find { |d| d && d.is_a?(Hash) && d["data"] && d["data"]["identifier"] }
        loc = docs.find { |d| d && d.is_a?(Hash) && d["data"] && d["data"]["definition"] }
        { file: file, meta: meta, loc: loc, edition: edition }
      end

      def preferred_designation(loc)
        return nil unless loc
        terms = loc.dig("data", "terms")
        return nil unless terms && !terms.empty?
        pref = terms.find { |t| t["normative_status"] == "preferred" && t["type"] == "expression" }
        pref ||= terms.find { |t| t["normative_status"] == "preferred" }
        pref ||= terms.first
        pref["designation"]
      end

      # All designations on a localized concept, normalised to a uniform shape.
      # Returns [] if the concept has no terms.
      def all_designations(loc)
        return [] unless loc
        terms = loc.dig("data", "terms")
        return [] unless terms.is_a?(Array)
        terms.map do |t|
          next nil unless t.is_a?(Hash) && t["designation"]
          {
            "type"   => t["type"] || "expression",
            "status" => t["normative_status"] || "preferred",
            "text"   => Normalize.normalize_designation(t["designation"]),
          }
        end.compact
      end

      def definition_text(loc)
        return "" unless loc
        defs = loc.dig("data", "definition")
        return "" unless defs
        defs.map { |d| d["content"] if d.is_a?(Hash) }.compact.join("\n")
      end

      def notes_text(loc)
        return [] unless loc
        notes = loc.dig("data", "notes")
        return [] unless notes
        notes.map { |n| n["content"] if n.is_a?(Hash) }.compact
      end

      def see_edges(meta)
        return [] unless meta
        related = meta["related"]
        return [] unless related.is_a?(Array)
        related.select { |r| r.is_a?(Hash) && r["type"] == "see" }
      end

      def source_ref(meta)
        meta.dig("data", "sources", 0, "origin", "ref", "source")
      end

      def clause_ref(meta)
        meta.dig("data", "sources", 0, "locality", "reference_from")
      end

      def parse_year(s)
        m = s.to_s.match(/:(\d{4})\z/)
        m && m[1].to_i
      end

      def slugify(term)
        G18::Model::Identifier.slugify(term)
      end

      def deterministic_uuid(name)
        G18::Model::Identifier.deterministic_uuid(name)
      end
    end
  end
end
