# frozen_string_literal: true

module G18
  module Migration
    Result = Struct.new(
      :files_written,
      :instance_count,
      :unique_term_count,
      :related_edge_count,
      :per_instance_edge_count,
      :multi_edge_terms,
      :slug_collisions,
      :annotations_stripped,
      :alias_merges,
      :id_conflicts,
      :editions,
      keyword_init: true,
    )
  end
end
