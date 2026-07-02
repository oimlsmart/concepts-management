import { i as edition_stats_default } from "../main.mjs";
import { defineComponent, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
//#region src/pages/editions.vue?vue&type=script&setup=true&lang.ts
var editions_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "editions",
	__ssrInlineRender: true,
	setup(__props) {
		const editions = edition_stats_default;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><section class="page-head"><div class="breadcrumb"><a href="/">Registry</a> / <span>Edition comparison</span></div><h1>G 18 edition comparison</h1><p class="lede"> Side-by-side view of <strong>OIML G 18:2010</strong> (the published edition) and <strong>OIML G 18:202X</strong> (the draft edition currently being validated by TC 1 / Vocabularies). </p></section><section class="card"><h2>Headline numbers</h2><table class="editions-table"><thead><tr><th>Metric</th><!--[-->`);
			ssrRenderList(unref(editions).editions, (ed) => {
				_push(`<th>${ssrInterpolate(ed)}</th>`);
			});
			_push(`<!--]--></tr></thead><tbody><tr><td>Source concept entries</td><!--[-->`);
			ssrRenderList(unref(editions).stats, (s) => {
				_push(`<td class="num">${ssrInterpolate(s.instances)}</td>`);
			});
			_push(`<!--]--></tr><tr><td>Unique terms (after merging by designation)</td><!--[-->`);
			ssrRenderList(unref(editions).stats, (s) => {
				_push(`<td class="num">${ssrInterpolate(s.terms)}</td>`);
			});
			_push(`<!--]--></tr><tr><td>Terms only in this edition</td><!--[-->`);
			ssrRenderList(unref(editions).stats, (s) => {
				_push(`<td class="num">${ssrInterpolate(s.only_in_edition)}</td>`);
			});
			_push(`<!--]--></tr><tr><td>Harmonisation candidates (≥ 2 distinct source publications)</td><!--[-->`);
			ssrRenderList(unref(editions).stats, (s) => {
				_push(`<td class="num">${ssrInterpolate(s.harmonization_candidates)}</td>`);
			});
			_push(`<!--]--></tr></tbody></table><p class="muted" style="${ssrRenderStyle({
				"margin-top": "0.7em",
				"font-size": "0.88em"
			})}"> Shared across both editions: <strong>${ssrInterpolate(unref(editions).terms_in_both)}</strong> terms. </p></section><section class="card"><h2>What changed between editions</h2><ul><li><a href="/harmonization/">Harmonisation worklist for TC 1 →</a></li><li><a${ssrRenderAttr("href", `/terms/?only=2010`)}>Terms present in 2010 but missing from 202X →</a></li><li><a${ssrRenderAttr("href", `/terms/?only=202X`)}>Terms added in 202X (not in 2010) →</a></li><li><a href="/conflicts/">Conflicting G 18 IDs →</a></li></ul></section><section class="card note"><h2>How to read this</h2><p> The 202X edition is currently a <strong>draft</strong>. TC 1&#39;s task is to confirm that each term in 202X either (a) carries a single harmonised definition backed by VIM/VIML where applicable, or (b) documents the intentional divergence across OIML Recommendations. </p></section><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/editions.vue
var _sfc_setup = editions_vue_vue_type_script_setup_true_lang_default.setup;
editions_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/editions.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var editions_default = editions_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { editions_default as default };
