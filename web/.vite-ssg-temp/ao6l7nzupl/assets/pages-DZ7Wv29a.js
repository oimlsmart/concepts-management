import { i as edition_stats_default, n as harmonization_default, o as terms_default } from "../main.mjs";
import { defineComponent, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
//#region src/pages/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const terms = terms_default;
		const harmonization = harmonization_default;
		const editions = edition_stats_default;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><section class="hero"><h1>G 18 — OIML Term-Usage Registry</h1><p class="lede"> A <strong>usage registry</strong>, not a vocabulary: where OIML terms appear, in which publication, with which definition, and how each instance compares to the official VIM/VIML definition. Built for <strong>TC 1 / Vocabularies</strong> to validate <a href="https://github.com/oimlsmart/vocab/tree/main/datasets/g18-202X">OIML G 18:202X</a> (the draft edition that supersedes G 18:2010). </p></section><section class="stats grid grid-4"><a class="stat-card" href="/terms/"><div class="stat-value">${ssrInterpolate(unref(terms).length)}</div><div class="stat-label">unique terms</div></a><a class="stat-card" href="/harmonization/"><div class="stat-value">${ssrInterpolate(unref(harmonization).length)}</div><div class="stat-label">harmonisation candidates</div></a><a class="stat-card" href="/editions/"><div class="stat-value">${ssrInterpolate(unref(terms).reduce((s, t) => s + t.publications.length, 0))}</div><div class="stat-label">term instances across editions</div></a><a class="stat-card" href="/leaderboard/"><div class="stat-value">${ssrInterpolate(unref(terms).filter((t) => new Set(t.publications.map((p) => (p.definition || "").trim()).filter(Boolean)).size > 1).length)}</div><div class="stat-label">terms with divergent definitions</div></a></section><section class="card"><h2>Edition comparison</h2><p class="lede"> The registry consumes both the published 2010 edition and the draft 202X edition. Each term is tagged with the edition(s) it appears in. </p><table class="editions-table"><thead><tr><th>Edition</th><th>Source concepts</th><th>Terms</th><th>Only in this edition</th><th>Harmonisation candidates</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(unref(editions).stats, (s) => {
				_push(`<tr><td><strong>${ssrInterpolate(s.edition)}</strong>`);
				if (s.primary) _push(`<span class="badge match-status-full">primary</span>`);
				else _push(`<!---->`);
				_push(`</td><td class="num">${ssrInterpolate(s.instances)}</td><td class="num">${ssrInterpolate(s.terms)}</td><td class="num">${ssrInterpolate(s.only_in_edition)}</td><td class="num">${ssrInterpolate(s.harmonization_candidates)}</td></tr>`);
			});
			_push(`<!--]--></tbody></table><p style="${ssrRenderStyle({ "margin-top": "0.7em" })}"><a href="/editions/">Full edition comparison →</a></p></section><section class="card"><h2>What this registry is for</h2><ul><li><strong>TC 1 editor</strong> — open the <a href="/harmonization/">harmonisation worklist</a> and work through terms cited by multiple Recommendations.</li><li><strong>TC chair</strong> — see which TC/SC has the most drift from official VIM/VIML.</li><li><strong>Authoring a new Recommendation</strong> — search for a term; if it&#39;s in VIM/VIML, get the official definition; if it&#39;s already in G 18 from other Recs, see how others defined it.</li><li><strong>OIML secretariat</strong> — maintain a consistency dashboard across all Recommendations.</li></ul></section><section class="card"><h2>Start browsing</h2><ul><li><a href="/terms/">All terms (alphabetical)</a> — ${ssrInterpolate(unref(terms).length)} entries, one page per term with every publication instance.</li><li><a href="/harmonization/">Harmonisation worklist</a> — the core TC 1 worklist for validating 202X.</li><li><a href="/editions/">Edition comparison</a> — side-by-side stats for 2010 vs 202X.</li><li><a href="/tc/">By Technical Committee / Subcommittee</a> — see which TC owns which terms.</li><li><a href="/publications/">By publication</a> — start from a Recommendation and see all terms it defines.</li><li><a href="/leaderboard/">Divergence leaderboard</a> — the 20 terms with the most distinct definitions across publications.</li><li><a href="/conflicts/">Conflicting G 18 IDs</a> — raw ID conflicts and designation collisions across editions.</li></ul></section><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = index_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { pages_default as default };
