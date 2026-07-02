import { defineComponent, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
//#region src/pages/leaderboard.vue?vue&type=script&setup=true&lang.ts
var leaderboard_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "leaderboard",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><section class="page-head"><div class="breadcrumb"><a href="/">Registry</a> / <span>Divergence leaderboard</span></div><h1>Divergence leaderboard</h1><p class="lede"> The top 20 terms with the most distinct definitions across the publications that use them. </p></section><section class="card"><table class="leaderboard-table"><thead><tr><th>#</th><th>Term</th><th>Vocabulary</th><th>Instances</th><th>Distinct definitions</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(_ctx.top, (t, i) => {
				_push(`<tr><td class="num">${ssrInterpolate(i + 1)}</td><td><a${ssrRenderAttr("href", `/terms/${t.slug}/`)}>${ssrInterpolate(t.name)}</a></td><td><span class="${ssrRenderClass(["kind", `kind-${t.kind}`])}">${ssrInterpolate(t.kind === "defined_in_vim" ? "VIM" : t.kind === "defined_in_viml" ? "VIML" : "—")}</span></td><td class="num">${ssrInterpolate(t.publications.length)}</td><td class="num"><span class="divergence-count">${ssrInterpolate(t.distinct)}</span></td></tr>`);
			});
			_push(`<!--]--></tbody></table></section><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/leaderboard.vue
var _sfc_setup = leaderboard_vue_vue_type_script_setup_true_lang_default.setup;
leaderboard_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/leaderboard.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var leaderboard_default = leaderboard_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { leaderboard_default as default };
