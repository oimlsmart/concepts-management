import { o as terms_default } from "../main.mjs";
import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
//#region src/pages/publications/[slug].vue?vue&type=script&setup=true&lang.ts
var _slug__vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "[slug]",
	__ssrInlineRender: true,
	setup(__props) {
		const terms = terms_default;
		return (_ctx, _push, _parent, _attrs) => {
			if (!_ctx.pub) _push(`<section${ssrRenderAttrs(mergeProps({ class: "card" }, _attrs))}><p>Publication not found.</p></section>`);
			else {
				_push(`<!--[--><section class="page-head"><div class="breadcrumb"><a href="/">Registry</a> / <a href="/publications/">Publications</a> / <span>${ssrInterpolate(_ctx.pub.reference || _ctx.pub.id)}</span></div><h1>${ssrInterpolate(_ctx.pub.reference || _ctx.pub.id)}</h1><p class="lede">${ssrInterpolate(_ctx.yearFromId(_ctx.pub.id))} · `);
				if (_ctx.pub.tc_sc) _push(`<a${ssrRenderAttr("href", `/tc/${_ctx.pub.tc_sc}/`)}>${ssrInterpolate(_ctx.pub.tc_sc)}</a>`);
				else _push(`<span class="muted">TC/SC unattributed</span>`);
				if (_ctx.pub.link) _push(`<a class="pdf-link"${ssrRenderAttr("href", _ctx.pub.link)}> · PDF ↗</a>`);
				else _push(`<!---->`);
				_push(`</p></section><section class="card"><h2>Terms defined in this publication (${ssrInterpolate(unref(terms).length)})</h2>`);
				if (unref(terms).length) {
					_push(`<table><thead><tr><th>Term</th><th>Vocabulary</th><th>Ed.</th><th>Definition (verbatim)</th></tr></thead><tbody><!--[-->`);
					ssrRenderList(unref(terms), (t) => {
						_push(`<tr><td><a${ssrRenderAttr("href", `/terms/${t.slug}/`)}>${ssrInterpolate(t.name)}</a></td><td><span class="${ssrRenderClass(["kind", `kind-${t.kind}`])}">${ssrInterpolate(t.kind === "defined_in_vim" ? "VIM" : t.kind === "defined_in_viml" ? "VIML" : "—")}</span></td><td><!--[-->`);
						ssrRenderList(t.editions_present, (e) => {
							_push(`<span class="${ssrRenderClass(["edition-pill", `edition-${e.toLowerCase()}`])}">${ssrInterpolate(e)}</span>`);
						});
						_push(`<!--]--></td><td class="definition"><div class="def-text">${ssrInterpolate(t.publications.find((p) => p.publication_id === _ctx.pubId.value)?.definition || "(no definition)")}</div></td></tr>`);
					});
					_push(`<!--]--></tbody></table>`);
				} else _push(`<p class="muted">No terms recorded for this publication.</p>`);
				_push(`</section><!--]-->`);
			}
		};
	}
});
//#endregion
//#region src/pages/publications/[slug].vue
var _sfc_setup = _slug__vue_vue_type_script_setup_true_lang_default.setup;
_slug__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/publications/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _slug__default = _slug__vue_vue_type_script_setup_true_lang_default;
//#endregion
export { _slug__default as default };
