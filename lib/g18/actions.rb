# frozen_string_literal: true

# G 18 suggested-action model.
#
# An Action is a recommended editorial step that some audience (TC 1,
# a TC/SC secretary, or a Recommendation project team) should take for
# a specific term. Actions are computed once at export time and stored
# in terms.json; every UI page filters the same data for its audience.
#
# Action types (mutually exclusive — each term instance gets at most
# one of these):
#
#   upgrade_vim    — cites superseded VIM; available in VIM 2012
#   upgrade_viml   — cites superseded VIML; available in VIML 2022
#   removed        — not found in latest edition (deleted or renamed)
#   adopt_vim      — defined in VIML but VIM has it too; consider adopting VIM
#   adopt_viml     — defined in VIM but VIML has it too; consider adopting VIML
#   harmonize      — ≥ 2 distinct definitions across publications
#   standardize    — cited by ≥ 2 pubs, all identical, ready to confirm canonical
#   unique         — OIML-original, no VIM/VIML reference
#
# Priorities: high / medium / low / info

module G18
  module Actions
    DIR = File.expand_path("actions", __dir__).freeze
    autoload :Action,   File.join(DIR, "action")
    autoload :Compiler, File.join(DIR, "compiler")
  end
end
