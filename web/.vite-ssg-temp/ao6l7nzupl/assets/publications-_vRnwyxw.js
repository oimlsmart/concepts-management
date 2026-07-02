import { a as publications_default$1 } from "../main.mjs";
import { defineComponent, unref, useSSRContext } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
//#region src/pages/publications/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const publications = publications_default$1;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><section class="page-head"><div class="breadcrumb"><a href="/">Registry</a> / <span>Publications</span></div><h1>OIML publications referenced</h1><p class="lede">${ssrInterpolate(unref(publications).length)} publications. `);
			if (_ctx.onlyEdition) _push(`<span>Showing only terms cited in <strong>${ssrInterpolate(_ctx.onlyEdition)}</strong>.</span>`);
			else _push(`<!---->`);
			_push(`</p></section><section class="card"><form class="filter-form"><label>Show terms from edition: <select><option value=""${ssrIncludeBooleanAttr(Array.isArray(_ctx.onlyEdition) ? ssrLooseContain(_ctx.onlyEdition, "") : ssrLooseEqual(_ctx.onlyEdition, "")) ? " selected" : ""}>All editions</option><option value="2010"${ssrIncludeBooleanAttr(Array.isArray(_ctx.onlyEdition) ? ssrLooseContain(_ctx.onlyEdition, "2010") : ssrLooseEqual(_ctx.onlyEdition, "2010")) ? " selected" : ""}>2010 only</option><option value="202X"${ssrIncludeBooleanAttr(Array.isArray(_ctx.onlyEdition) ? ssrLooseContain(_ctx.onlyEdition, "202X") : ssrLooseEqual(_ctx.onlyEdition, "202X")) ? " selected" : ""}>202X only</option></select></label><span class="count-line">Showing ${ssrInterpolate(_ctx.filtered.length)} publication${ssrInterpolate(_ctx.filtered.length === 1 ? "" : "s")}${ssrInterpolate(_ctx.onlyEdition ? ` cited in ${_ctx.onlyEdition}` : "")}.</span></form><table><thead><tr><th>ID</th><th>Reference</th><th>Year</th><th>TC/SC</th><th>Terms (this edition)</th><th>PDF</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(_ctx.filtered, (p) => {
				_push(`<tr><td><code>${ssrInterpolate(p.id)}</code></td><td><a${ssrRenderAttr("href", `/publications/${p.id}/`)}>${ssrInterpolate(p.reference || p.id)}</a></td><td class="num">${ssrInterpolate((p.id || "").match(/(\d{4})/)?.[1] || "—")}</td><td>${ssrInterpolate(p.tc_sc || "—")}</td><td class="num">${ssrInterpolate(_ctx.termCount(p.id, _ctx.onlyEdition))}</td><td>`);
				if (p.link) _push(`<a class="external"${ssrRenderAttr("href", p.link)}>PDF ↗</a>`);
				else _push(`<!---->`);
				_push(`</td></tr>`);
			});
			_push(`<!--]--></tbody></table></section><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/publications/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/publications/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var publications_default = index_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { publications_default as default };
