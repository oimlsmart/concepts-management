import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

// Data comes from __fixtures__/pub-list.json — vitest.config.ts aliases the
// generated @/data/pub-list.json to it so this test runs without a data export.
import PublicationsListPage from "@/islands/PublicationsListPage.vue";

function rowRefs(wrapper: ReturnType<typeof mount>): string[] {
  return wrapper.findAll("tbody tr td:first-child").map(td => td.text());
}

describe("PublicationsListPage", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("defaults the status filter to Current only", async () => {
    const wrapper = mount(PublicationsListPage);
    await wrapper.vm.$nextTick();
    const select = wrapper.find("select");
    expect(select.exists()).toBe(true);
    expect((select.element as HTMLSelectElement).value).toBe("current");
    expect(rowRefs(wrapper)).toEqual(["OIML R 142-1:2025"]);
  });

  it("shows every publication when All statuses is selected", async () => {
    const wrapper = mount(PublicationsListPage);
    const select = wrapper.find("select");
    await select.setValue("");
    await wrapper.vm.$nextTick();
    expect(rowRefs(wrapper)).toEqual(["OIML R 142-1:2025", "OIML R 1:2010"]);
  });

  it("never lists VIM/VIML vocabulary editions, in any status filter", async () => {
    const wrapper = mount(PublicationsListPage);
    await wrapper.find("select").setValue("");
    await wrapper.vm.$nextTick();
    const refs = rowRefs(wrapper);
    expect(refs.some(r => r.startsWith("OIML V "))).toBe(false);
    expect(wrapper.find(".lede").text()).toBe(
      "2 publications with terms · 1 current · 1 retired · 0 withdrawn"
    );
  });

  it("honours a lifecycle value carried in the URL", async () => {
    window.history.replaceState({}, "", "/?lifecycle=retired");
    const wrapper = mount(PublicationsListPage);
    await wrapper.vm.$nextTick();
    expect((wrapper.find("select").element as HTMLSelectElement).value).toBe("retired");
    expect(rowRefs(wrapper)).toEqual(["OIML R 1:2010"]);
  });
});
