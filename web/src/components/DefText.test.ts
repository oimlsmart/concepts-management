import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DefText from "@/components/DefText.vue";

describe("DefText", () => {
  it("renders plain text unchanged", () => {
    const wrapper = mount(DefText, { props: { text: "hello world" } });
    expect(wrapper.text()).toBe("hello world");
  });

  it("renders pre-rendered MathML via v-html", () => {
    const mathml = '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>';
    const wrapper = mount(DefText, { props: { text: `value ${mathml} is` } });
    expect(wrapper.html()).toContain("<math");
    expect(wrapper.html()).toContain("<mi>x</mi>");
  });

  it("resolves cross-references to existing G 18 terms by name", () => {
    const wrapper = mount(DefText, {
      props: { text: "see {{3.1,measuring instrument}} for details" },
    });
    const html = wrapper.html();
    expect(html).toContain("href");
    expect(html).toContain("measuring-instrument");
    expect(html).toContain("measuring instrument");
    expect(html).toContain("xref");
  });

  it("renders unresolved cross-references as non-linked spans", () => {
    const wrapper = mount(DefText, {
      props: { text: "see {{99,nonexistent term}} here" },
    });
    const html = wrapper.html();
    expect(html).toContain("xref-unresolved");
    expect(html).toContain("nonexistent term");
    expect(html).not.toContain("href");
  });

  it("handles singular/plural: plural text resolves to singular term", () => {
    const wrapper = mount(DefText, {
      props: { text: "{{3.1,measuring instruments}}" },
    });
    const html = wrapper.html();
    expect(html).toContain("measuring-instrument");
    expect(html).toContain("measuring instruments");
  });

  it("handles multiple cross-references in one string", () => {
    const wrapper = mount(DefText, {
      props: { text: "{{4.1,measuring instrument}} and {{4.2,measuring system}}" },
    });
    const links = wrapper.findAll("a.xref");
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it("handles empty text gracefully", () => {
    const wrapper = mount(DefText, { props: { text: "" } });
    expect(wrapper.text()).toBe("");
  });

  it("handles null/undefined text gracefully", () => {
    const wrapper = mount(DefText, { props: { text: undefined as any } });
    expect(wrapper.exists()).toBe(true);
  });

  it("preserves text outside of math/cross-ref markup", () => {
    const wrapper = mount(DefText, {
      props: { text: "before {{4.1,measuring instrument}} after" },
    });
    const html = wrapper.html();
    expect(html).toContain("before");
    expect(html).toContain("after");
  });
});
