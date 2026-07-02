import { n as harmonization_default$1 } from "../main.mjs";
import { defineComponent, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
//#region src/pages/harmonization.vue?vue&type=script&setup=true&lang.ts
var harmonization_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "harmonization",
	__ssrInlineRender: true,
	setup(__props) {
		const candidates = harmonization_default$1;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><section class="page-head"><div class="breadcrumb"><a href="/">Registry</a> / <span>Harmonisation worklist</span></div><h1>Harmonisation worklist</h1><p class="lede"> Every term cited by <strong>two or more distinct OIML publications</strong>, where the publications may use divergent definitions. This is the core worklist for TC 1 validating the 202X edition. </p><p class="lede"><strong>${ssrInterpolate(unref(candidates).length)}</strong> candidates shown (top 200 by publication count). </p></section><section class="card"><table class="harmonization-table"><thead><tr><th>#</th><th>Term</th><th>VIM/VIML</th><th>Ed.</th><th>Inst.</th><th>Distinct defs</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(unref(candidates), (t, i) => {
				_push(`<tr><td class="num">${ssrInterpolate(i + 1)}</td><td><a${ssrRenderAttr("href", `/terms/${t.slug}/`)}>${ssrInterpolate(t.name)}</a></td><td><span class="${ssrRenderClass(["kind", `kind-${t.kind}`])}">${ssrInterpolate(t.kind === "defined_in_vim" ? "VIM" : t.kind === "defined_in_viml" ? "VIML" : "—")}</span></td><td><!--[-->`);
				ssrRenderList(t.editions_present, (e) => {
					_push(`<span class="${ssrRenderClass(["edition-pill", `edition-${e.toLowerCase()}`])}">${ssrInterpolate(e)}</span>`);
				});
				_push(`<!--]--></td><td class="num">${ssrInterpolate(t.publications.length)}</td><td class="num">${ssrInterpolate(new Set(t.publications.map((p) => (p.definition || "").trim()).filter(Boolean)).size)}</td></tr>`);
			});
			_push(`<!--]--></tbody></table></section><section class="card note"><h2>How to use this worklist</h2><ol><li><strong>Pick a term</strong> with a high &quot;Distinct defs&quot; count.</li><li><strong>Open the term page</strong> to read each publication&#39;s definition side-by-side.</li><li><strong>Decide:</strong> converge on a single definition? If yes, propose it in the 202X YAML.</li><li><strong>Submit changes</strong> to <code>oimlsmart/vocab datasets/g18-202X/</code>.</li></ol></section><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/harmonization.vue
var _sfc_setup = harmonization_vue_vue_type_script_setup_true_lang_default.setup;
harmonization_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/harmonization.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var harmonization_default = harmonization_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { harmonization_default as default };
