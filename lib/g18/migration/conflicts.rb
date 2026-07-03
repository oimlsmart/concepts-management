# frozen_string_literal: true

# Cross-term ID conflict detection.
#
# Two types:
#   1. Raw ID conflict — one source identifier assigned to two semantically
#      different concepts (numbering error in the source publication).
#   2. Designation collision — same concept cited under multiple distinct IDs
#      (handled separately, on the harmonisation worklist).

module G18
  module Migration
    module Conflicts
      module_function

      # Returns `{ edition_name => { id => [{ designation:, source: }, ...] } }`
      # for every ID that has more than one distinct designation in that edition.
      def detect_id_conflicts(entries_by_edition)
        conflicts = {}
        entries_by_edition.each do |edition, entries|
          by_id = Hash.new { |h, k| h[k] = [] }
          entries.each do |e|
            id = e[:meta]&.dig("data", "identifier")
            next unless id
            designation = Loaders.preferred_designation(e[:loc])
            next unless designation
            source = Loaders.source_ref(e[:meta])
            tuple = { designation: designation, source: source }
            by_id[id] << tuple unless by_id[id].any? { |x| x[:designation] == designation && x[:source] == source }
          end
          ed_conflicts = by_id.select { |_, arr| arr.size > 1 }
          next if ed_conflicts.empty?
          conflicts[edition] = ed_conflicts.sort.transform_values { |v| v.sort_by { |x| x[:designation].downcase } }
        end
        conflicts
      end
    end
  end
end
