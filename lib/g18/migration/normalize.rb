# frozen_string_literal: true

# Designation normalization — defensive only.
#
# The vocab source YAML files at
#   vocab/datasets/g18-{2010,202X}/concepts/*.yaml
# are expected to already be in canonical form (math in `stem:[<asciimath>]`
# with bare Greek names like `Delta` instead of `\Delta`). The vocab repo's
# `scripts/normalize_designations.rb` enforces this.
#
# This module catches the few editorial artifacts that may slip through:
#   - Editorial annotations:  "[VIM:1993, 5.7 [1]]", "(OIML V 1 [1], 5.16)"
#   - Smart quotes / dashes / NBSPs from older tooling
#   - Trailing empty parens "mean area error ()"

module G18
  module Migration
    module Normalize
      module_function

      # Editorial paren citations: "(OIML V 1 [1], 5.16)", "(VIM:2007, 4.11)".
      # Runs BEFORE the bracket regex so the inner "[1]" doesn't get stripped
      # on its own, leaving an orphan "(OIML V 1".
      EDITORIAL_PAREN_RE = /
        \s*
        \(
          [^()]*
          (?: OIML\s+V | VIM | VIML )
          [^()]*
        \)
        .*
        \z
      /ix.freeze

      EDITORIAL_BRACKET_RE = /
        \s*
        \[
          (?:
            VIM | VIML
            | Adapted\s+from
            | (?:not\s+)?applicable
            | OIML
            | \d+
          )
          [^\]]*
        \]
        .*
        \z
      /ix.freeze

      SMART_DOUBLE_QUOTES = "“”„‟".freeze
      SMART_SINGLE_QUOTES = "‘’‚‛´ʻʼ".freeze
      DASH_VARIANTS       = "‐‑‒–—―".freeze
      NBSP                = " ".freeze

      def normalize_designation(raw)
        s = raw.to_s
        s = s.sub(EDITORIAL_PAREN_RE, "")
             .sub(EDITORIAL_BRACKET_RE, "")
             .gsub(/[#{SMART_DOUBLE_QUOTES}]/, '"')
             .gsub(/[#{SMART_SINGLE_QUOTES}]/, "'")
             .gsub(NBSP, " ")
             .gsub(/[#{DASH_VARIANTS}]/, "-")
             .gsub(/\s+\(\s*\)\s*\z/, "")
             .gsub(/\s+/, " ")
             .strip
        s
      end

      # Load editorial aliases from the YAML file. Each entry maps a canonical
      # designation to one or more variants. Comparison is case-insensitive.
      def load_term_aliases(path)
        return {} unless path && File.exist?(path)
        yaml = YAML.safe_load(File.read(path), aliases: true) || {}
        yaml.each_with_object({}) do |(canonical, variants), h|
          next unless canonical.is_a?(String) && !canonical.empty?
          h[canonical.downcase] = canonical
          Array(variants).each do |v|
            next unless v.is_a?(String) && !v.empty?
            h[v.downcase] = canonical
          end
        end
      end
    end
  end
end
