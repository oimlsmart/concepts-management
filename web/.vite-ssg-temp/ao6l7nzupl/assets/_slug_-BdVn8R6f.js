import { defineComponent, mergeProps, ref, useSSRContext } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
//#region src/pages/terms/[slug].vue?vue&type=script&setup=true&lang.ts
var onlyDivergent = ref(false);
var _slug__vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "[slug]",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			if (!_ctx.term) _push(`<section${ssrRenderAttrs(mergeProps({ class: "card" }, _attrs))}><p>Term not found.</p></section>`);
			else {
				_push(`<!--[--><section class="page-head"><div class="breadcrumb"><a href="/">Registry</a> / <a href="/terms/">Terms</a> / <span>${ssrInterpolate(_ctx.term.name)}</span></div><h1>${ssrInterpolate(_ctx.term.name)}</h1><p class="lede"><span class="${ssrRenderClass(["kind", `kind-${_ctx.term.kind}`])}">${ssrInterpolate(_ctx.kindLabel(_ctx.term.kind))}</span>`);
				if (_ctx.matchStatus) _push(`<span class="${ssrRenderClass(["match-status", `match-status-${_ctx.matchStatus.key}`])}">${ssrInterpolate(_ctx.matchStatus.label)}</span>`);
				else _push(`<!---->`);
				_push(` G 18 #${ssrInterpolate(_ctx.term.identifier)} · ${ssrInterpolate(_ctx.term.publications.length)} publication instance${ssrInterpolate(_ctx.term.publications.length === 1 ? "" : "s")}</p></section><aside class="legend"><h3>How to read this page</h3><div class="legend-row"><span class="legend-label">VIM:</span><span class="viml-ref vim-current">VIM 2012<span class="viml-latest-badge">Latest</span></span><span class="viml-ref vim-prior">VIM 2010, 2007</span><span class="viml-ref vim-legacy">VIM 1993</span></div><div class="legend-row"><span class="legend-label">VIML:</span><span class="viml-ref viml-current">VIML 2022<span class="viml-latest-badge">Latest</span></span><span class="viml-ref viml-prior">VIML 2013, 2000</span><span class="viml-ref viml-legacy">VIML 1968</span></div><p style="${ssrRenderStyle({
					"margin": "0.5em 0 0",
					"font-size": "0.85em",
					"color": "var(--gray-text)"
				})}"> Authoritative definitions form the baseline against which OIML publication definitions are compared. Newer editions take precedence; older ones are shown faded and may have been superseded. </p></aside><section class="card"><h2>Authoritative definition</h2>`);
				if (_ctx.term.kind !== "undefined" && _ctx.term.official_concept) {
					_push(`<!--[--><div class="${ssrRenderClass(["authority-defn", _ctx.confidenceClass(_ctx.term.official_concept.source)])}"><div class="authority-defn-head"><span class="${ssrRenderClass(_ctx.confidenceClass(_ctx.term.official_concept.source))}">${ssrInterpolate(_ctx.term.official_concept.edition_label || _ctx.term.official_concept.source)} `);
					if (_ctx.currentOf(_ctx.term.official_concept.source)) _push(`<span class="viml-latest-badge">Latest</span>`);
					else _push(`<!---->`);
					_push(`</span> · concept <strong>#${ssrInterpolate(_ctx.term.official_concept.id)}</strong>`);
					if (_ctx.term.official_concept.url) _push(`<span> · <a class="external"${ssrRenderAttr("href", _ctx.term.official_concept.url)}>view ↗</a></span>`);
					else _push(`<!---->`);
					_push(`</div>`);
					if (_ctx.term.official_concept.definition_text) _push(`<p class="authority-defn-body">${ssrInterpolate(_ctx.term.official_concept.definition_text)}</p>`);
					else _push(`<p class="muted" style="${ssrRenderStyle({ "margin": "0.3em 0" })}">Definition text unavailable for this edition.</p>`);
					_push(`</div>`);
					if (_ctx.supersededOf(_ctx.term.official_concept.source)) _push(`<div class="admonition warn"><strong>Outdated reference:</strong> This term cites ${ssrInterpolate(_ctx.term.official_concept.edition_label)}, which has been superseded. The latest authoritative edition of the same vocabulary is <strong>${ssrInterpolate(_ctx.latestOf(_ctx.term.official_concept.source))}</strong> — editors should re-check whether the term still appears there with the same or a revised definition. </div>`);
					else _push(`<!---->`);
					_push(`<!--]-->`);
				} else _push(`<p class="muted">Not defined in VIM or VIML.</p>`);
				if ((_ctx.term.related || []).length) {
					_push(`<!--[--><h3>Related VIM/VIML references</h3><ul class="related-list"><!--[-->`);
					ssrRenderList(_ctx.term.related, (edge, i) => {
						_push(`<li>`);
						if (edge.ref) {
							_push(`<!--[--><span class="${ssrRenderClass(_ctx.confidenceClass(edge.ref.source))}">${ssrInterpolate(edge.ref.edition_label || edge.ref.source)} `);
							if (_ctx.currentOf(edge.ref.source)) _push(`<span class="viml-latest-badge">Latest</span>`);
							else _push(`<!---->`);
							_push(`</span> · concept <strong>#${ssrInterpolate(edge.ref.id)}</strong>`);
							if (_ctx.urlOf(edge.ref.source, edge.ref.id)) _push(`<a class="external"${ssrRenderAttr("href", _ctx.urlOf(edge.ref.source, edge.ref.id))}>view ↗</a>`);
							else _push(`<!---->`);
							if (edge.ref.definition_text) _push(`<div class="authority-defn-body" style="${ssrRenderStyle({
								"margin-top": "0.4em",
								"font-size": "0.92em"
							})}">${ssrInterpolate(edge.ref.definition_text)}</div>`);
							else _push(`<!---->`);
							_push(`<!--]-->`);
						} else _push(`<!---->`);
						_push(`</li>`);
					});
					_push(`<!--]--></ul><!--]-->`);
				} else _push(`<!---->`);
				_push(`</section>`);
				if (_ctx.actions.length) {
					_push(`<section class="card"><h2>Suggested actions for TC 1 / Vocabularies</h2><ol class="actions-list"><!--[-->`);
					ssrRenderList(_ctx.actions, (a, i) => {
						_push(`<li class="${ssrRenderClass(["action", `action-${a.priority}`])}"><span class="${ssrRenderClass(["action-pill", `action-pill-${a.priority}`])}">${ssrInterpolate(a.priority.toUpperCase())}</span><span class="action-text">${ssrInterpolate(a.text)}</span>`);
						if (a.link && a.label) _push(`<!--[--> · <a${ssrRenderAttr("href", a.link)}>${ssrInterpolate(a.label)}</a><!--]-->`);
						else _push(`<!---->`);
						_push(`</li>`);
					});
					_push(`<!--]--></ol></section>`);
				} else _push(`<!---->`);
				_push(`<section class="card"><div class="card-head"><h2>Publication instances</h2><div class="pub-controls"><label class="inline-check"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(onlyDivergent.value) ? ssrLooseContain(onlyDivergent.value, null) : onlyDivergent.value) ? " checked" : ""}> Show only divergent definitions </label><span class="edition-filter"> Show editions: <!--[-->`);
				ssrRenderList(_ctx.term.editions_present || [], (ed) => {
					_push(`<label class="inline-check edition-toggle-label"><input type="checkbox"${ssrIncludeBooleanAttr(_ctx.enabledEditions.has(ed)) ? " checked" : ""}><span class="${ssrRenderClass(["edition-pill", `edition-${ed.toLowerCase()}`])}">${ssrInterpolate(ed)}</span></label>`);
				});
				_push(`<!--]--></span></div></div><table class="pubs-table"><thead><tr><th>Ed.</th><th>Year</th><th>Publication</th><th>TC/SC</th><th>Clause</th><th>Definition</th><th>Consistency</th></tr></thead><tbody><!--[-->`);
				ssrRenderList(_ctx.term.publications, (p) => {
					_push(`<tr class="${ssrRenderClass(["pub-row", _ctx.distinctDefs.length > 1 && p.definition !== _ctx.distinctDefs[0] ? "row-divergent" : ""])}" style="${ssrRenderStyle(_ctx.enabledEditions.has(p.edition) ? null : { display: "none" })}"><td><span class="${ssrRenderClass(["edition-pill", `edition-${(p.edition || "").toLowerCase()}`])}">${ssrInterpolate(p.edition)}</span></td><td class="num">${ssrInterpolate(p.year || "—")}</td><td><a${ssrRenderAttr("href", `/publications/${p.publication_id}/`)}>${ssrInterpolate(p.publication)}</a><div class="g18-ref">G 18 #${ssrInterpolate(p.g18_entry)}</div></td><td>`);
					if (p.tc_sc) _push(`<a${ssrRenderAttr("href", `/tc/${p.tc_sc}/`)}>${ssrInterpolate(p.tc_sc)}</a>`);
					else _push(`<span class="muted">—</span>`);
					_push(`</td><td class="num">${ssrInterpolate(p.clause || "—")}</td><td class="definition"><div class="def-text">${ssrInterpolate(p.definition || "(no definition recorded)")}</div></td><td><span class="${ssrRenderClass(["badge", `badge-${p.consistency || "pending"}`])}">${ssrInterpolate(p.consistency || "pending")}</span></td></tr>`);
				});
				_push(`<!--]--></tbody></table></section><!--]-->`);
			}
		};
	}
});
//#endregion
//#region src/pages/terms/[slug].vue
var _sfc_setup = _slug__vue_vue_type_script_setup_true_lang_default.setup;
_slug__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/terms/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _slug__default = _slug__vue_vue_type_script_setup_true_lang_default;
//#endregion
export { _slug__default as default };
