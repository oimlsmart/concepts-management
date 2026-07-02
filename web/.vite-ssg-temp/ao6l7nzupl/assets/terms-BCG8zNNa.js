import { o as terms_default$1 } from "../main.mjs";
import { computed, defineComponent, ref, unref, useSSRContext } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
//#region src/pages/terms/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const terms = terms_default$1;
		const search = ref("");
		const onlyEdition = ref("");
		function kindLabel(k) {
			if (k === "defined_in_vim") return "VIM";
			if (k === "defined_in_viml") return "VIML";
			return "—";
		}
		const filtered = computed(() => {
			let t = terms;
			if (onlyEdition.value) t = t.filter((term) => (term.editions_present || []).includes(onlyEdition.value));
			if (search.value) {
				const q = search.value.toLowerCase();
				t = t.filter((term) => (term.name || "").toLowerCase().includes(q));
			}
			return t.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><section class="page-head"><div class="breadcrumb"><a href="/">Registry</a> / <span>Terms</span></div><h1>All terms</h1><p class="lede">${ssrInterpolate(unref(terms).length)} unique terms, grouped from ${ssrInterpolate(unref(terms).reduce((s, t) => s + t.publications.length, 0))} publication instances across editions.</p></section><section class="card"><form class="filter-form"><input type="search"${ssrRenderAttr("value", search.value)} placeholder="Search term name…"><label>Show only: <select><option value=""${ssrIncludeBooleanAttr(Array.isArray(onlyEdition.value) ? ssrLooseContain(onlyEdition.value, "") : ssrLooseEqual(onlyEdition.value, "")) ? " selected" : ""}>All editions</option><option value="2010"${ssrIncludeBooleanAttr(Array.isArray(onlyEdition.value) ? ssrLooseContain(onlyEdition.value, "2010") : ssrLooseEqual(onlyEdition.value, "2010")) ? " selected" : ""}>2010 only</option><option value="202X"${ssrIncludeBooleanAttr(Array.isArray(onlyEdition.value) ? ssrLooseContain(onlyEdition.value, "202X") : ssrLooseEqual(onlyEdition.value, "202X")) ? " selected" : ""}>202X only</option></select></label><span class="count-line">Showing ${ssrInterpolate(filtered.value.length)} of ${ssrInterpolate(unref(terms).length)}</span></form><table><thead><tr><th>Term</th><th>VIM/VIML</th><th>Ed.</th><th>Instances</th><th>Distinct defs</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(filtered.value, (t) => {
				_push(`<tr><td><a${ssrRenderAttr("href", `/terms/${t.slug}/`)}>${ssrInterpolate(t.name)}</a></td><td><span class="${ssrRenderClass(["kind", `kind-${t.kind}`])}">${ssrInterpolate(kindLabel(t.kind))}</span></td><td><!--[-->`);
				ssrRenderList(t.editions_present || [], (e) => {
					_push(`<span class="${ssrRenderClass(["edition-pill", `edition-${e.toLowerCase()}`])}">${ssrInterpolate(e)}</span>`);
				});
				_push(`<!--]--></td><td class="num">${ssrInterpolate(t.publications.length)}</td><td class="num">${ssrInterpolate(new Set(t.publications.map((p) => (p.definition || "").trim()).filter(Boolean)).size)}</td></tr>`);
			});
			_push(`<!--]--></tbody></table></section><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/terms/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/terms/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var terms_default = index_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { terms_default as default };
