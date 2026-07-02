import { t as tc_default$1 } from "../main.mjs";
import { defineComponent, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
//#region src/pages/tc/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const tcs = tc_default$1;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><section class="page-head"><div class="breadcrumb"><a href="/">Registry</a> / <span>TC / SC</span></div><h1>Technical Committees &amp; Subcommittees</h1></section><section class="card"><table><thead><tr><th>TC / SC</th><th>Publications</th><th>Terms</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(unref(tcs), (t) => {
				_push(`<tr><td><a${ssrRenderAttr("href", `/tc/${_ctx.slug(t)}/`)}>${ssrInterpolate(t)}</a></td><td class="num">${ssrInterpolate(_ctx.pubCount(t))}</td><td class="num">${ssrInterpolate(_ctx.termCount(t))}</td></tr>`);
			});
			_push(`<!--]--></tbody></table></section><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/tc/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/tc/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var tc_default = index_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { tc_default as default };
