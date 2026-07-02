import { o as terms_default } from "../main.mjs";
import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
//#region src/pages/tc/[slug].vue?vue&type=script&setup=true&lang.ts
var _slug__vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "[slug]",
	__ssrInlineRender: true,
	setup(__props) {
		const terms = terms_default;
		return (_ctx, _push, _parent, _attrs) => {
			if (!_ctx.tcName) _push(`<section${ssrRenderAttrs(mergeProps({ class: "card" }, _attrs))}><p>TC/SC not found.</p></section>`);
			else {
				_push(`<!--[--><section class="page-head"><div class="breadcrumb"><a href="/">Registry</a> / <a href="/tc/">TC / SC</a> / <span>${ssrInterpolate(_ctx.tcName)}</span></div><h1>${ssrInterpolate(_ctx.tcName)}</h1><p class="lede">${ssrInterpolate(unref(terms).length)} term${ssrInterpolate(unref(terms).length === 1 ? "" : "s")} cited by this TC/SC&#39;s publications.</p></section><section class="card"><table><thead><tr><th>Term</th><th>Vocabulary</th><th>Ed.</th><th>Instances</th></tr></thead><tbody><!--[-->`);
				ssrRenderList(unref(terms), (t) => {
					_push(`<tr><td><a${ssrRenderAttr("href", `/terms/${t.slug}/`)}>${ssrInterpolate(t.name)}</a></td><td><span class="${ssrRenderClass(["kind", `kind-${t.kind}`])}">${ssrInterpolate(t.kind === "defined_in_vim" ? "VIM" : t.kind === "defined_in_viml" ? "VIML" : "—")}</span></td><td><!--[-->`);
					ssrRenderList(t.editions_present, (e) => {
						_push(`<span class="${ssrRenderClass(["edition-pill", `edition-${e.toLowerCase()}`])}">${ssrInterpolate(e)}</span>`);
					});
					_push(`<!--]--></td><td class="num">${ssrInterpolate(t.publications.filter((p) => p.tc_sc === _ctx.tcName).length)}</td></tr>`);
				});
				_push(`<!--]--></tbody></table></section><!--]-->`);
			}
		};
	}
});
//#endregion
//#region src/pages/tc/[slug].vue
var _sfc_setup = _slug__vue_vue_type_script_setup_true_lang_default.setup;
_slug__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/tc/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _slug__default = _slug__vue_vue_type_script_setup_true_lang_default;
//#endregion
export { _slug__default as default };
