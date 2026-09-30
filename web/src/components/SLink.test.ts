import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SLink from "@/components/SLink.vue";

describe("SLink", () => {
  it("prepends base URL to relative path", () => {
    const wrapper = mount(SLink, {
      props: { to: "terms/calibration/" },
      slots: { default: "calibration" },
    });
    const href = wrapper.find("a").attributes("href");
    expect(href).toContain("terms/calibration/");
  });

  it("handles leading slash in path", () => {
    const wrapper = mount(SLink, {
      props: { to: "/terms/calibration/" },
      slots: { default: "calibration" },
    });
    const href = wrapper.find("a").attributes("href");
    expect(href).toContain("terms/calibration/");
    expect(href).not.toContain("//terms");
  });

  it("renders slot content as link text", () => {
    const wrapper = mount(SLink, {
      props: { to: "terms/accuracy/" },
      slots: { default: "accuracy class" },
    });
    expect(wrapper.find("a").text()).toBe("accuracy class");
  });

  it("produces valid anchor element", () => {
    const wrapper = mount(SLink, {
      props: { to: "publications/oiml-r-76-1-2006/" },
      slots: { default: "OIML R 76-1" },
    });
    const a = wrapper.find("a");
    expect(a.exists()).toBe(true);
    expect(a.attributes("href")).toBeTruthy();
  });

  // Regression test: in a list that re-renders rows (e.g. the gaps
  // analysis page when scope changes after SSR/hydration), the `to`
  // prop updates but the link's href must follow. Previously href was
  // a plain const computed once at setup, so it stayed stale even
  // though the slot text updated — producing mismatched links like
  // "automatic checking facility" pointing at /concepts/electronic-device/.
  it("updates href reactively when `to` prop changes", async () => {
    const wrapper = mount(SLink, {
      props: { to: "concepts/automatic-checking-facility/" },
      slots: { default: "automatic checking facility" },
    });
    expect(wrapper.find("a").attributes("href")).toContain("concepts/automatic-checking-facility/");

    await wrapper.setProps({ to: "concepts/electronic-device/" });
    expect(wrapper.find("a").attributes("href")).toContain("concepts/electronic-device/");
    expect(wrapper.find("a").attributes("href")).not.toContain("automatic-checking-facility");
  });
});
