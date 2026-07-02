import { r as conflicts_default$1 } from "../main.mjs";
import { defineComponent, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
//#region src/pages/conflicts.vue?vue&type=script&setup=true&lang.ts
var conflicts_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "conflicts",
	__ssrInlineRender: true,
	setup(__props) {
		const conflicts = conflicts_default$1;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><section class="page-head"><div class="breadcrumb"><a href="/">Registry</a> / <span>ID conflicts</span></div><h1>Conflicting G 18 IDs</h1><p class="lede"> Two views of the G 18 ID space: <em>raw conflicts</em> (same ID assigned to two distinct concepts in the source) and <em>designation collisions</em> (same concept cited under multiple distinct IDs). </p></section><section class="card"><h2>Raw ID conflicts</h2><p class="lede"> A raw conflict means the source publication used the same G 18 ID number for two semantically different concepts. Resolved in the source YAML via the <code>&lt;id&gt;a</code> / <code>&lt;id&gt;b</code> split convention. </p>`);
			if (!Object.keys(unref(conflicts).raw || {}).length || !Object.values(unref(conflicts).raw || {}).flat().length) _push(`<p class="ok">No raw ID conflicts detected in either edition. ✓</p>`);
			else {
				_push(`<!--[-->`);
				ssrRenderList(unref(conflicts).raw, (list, edition) => {
					_push(`<div>`);
					if (list.length) _push(`<h3>${ssrInterpolate(edition)} (${ssrInterpolate(list.length)} conflicting IDs)</h3>`);
					else _push(`<!---->`);
					if (list.length) {
						_push(`<table class="conflicts-table"><thead><tr><th>Base ID</th><th>Distinct concepts</th></tr></thead><tbody><!--[-->`);
						ssrRenderList(list, (c) => {
							_push(`<tr><td class="num"><code>${ssrInterpolate(c.id)}</code></td><td><ul class="conflict-concepts"><!--[-->`);
							ssrRenderList(c.concepts, (con) => {
								_push(`<li><span class="${ssrRenderClass(["edition-pill", `edition-${edition.toLowerCase()}`])}">${ssrInterpolate(edition)}</span><strong>${ssrInterpolate(con.designation)}</strong><span class="conflict-source">from ${ssrInterpolate(con.source)}</span><span class="conflict-raw-id">(raw ID: <code>${ssrInterpolate(con.raw_id)}</code>)</span></li>`);
							});
							_push(`<!--]--></ul></td></tr>`);
						});
						_push(`<!--]--></tbody></table>`);
					} else _push(`<!---->`);
					_push(`</div>`);
				});
				_push(`<!--]-->`);
			}
			_push(`</section><section class="card"><h2>Designation collisions (top 30 per edition)</h2><p class="lede"> A designation collision means the same term appears under multiple distinct G 18 IDs in the source. TC 1 must decide which ID is canonical in 202X. </p><!--[-->`);
			ssrRenderList(unref(conflicts).designation_collisions, (list, edition) => {
				_push(`<div>`);
				if (list.length) _push(`<h3>${ssrInterpolate(edition)} — top ${ssrInterpolate(list.length)}</h3>`);
				else _push(`<!---->`);
				if (list.length) {
					_push(`<table class="collisions-table"><thead><tr><th>Designation</th><th>Distinct IDs</th><th>Publications</th></tr></thead><tbody><!--[-->`);
					ssrRenderList(list, (c) => {
						_push(`<tr><td><a${ssrRenderAttr("href", `/terms/${c.designation.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}/`)}>${ssrInterpolate(c.designation)}</a></td><td class="num">${ssrInterpolate(c.ids.length)}</td><td class="num">${ssrInterpolate(c.count)}</td></tr>`);
					});
					_push(`<!--]--></tbody></table>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			});
			_push(`<!--]--></section><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/conflicts.vue
var _sfc_setup = conflicts_vue_vue_type_script_setup_true_lang_default.setup;
conflicts_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/conflicts.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var conflicts_default = conflicts_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { conflicts_default as default };
