import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import RecommendationBanner from "@/components/RecommendationBanner.vue";

describe("RecommendationBanner", () => {
  it("renders the recommendation text and label", () => {
    const wrapper = mount(RecommendationBanner, {
      props: {
        recommendation: {
          level: "ok",
          icon: "✅",
          text: "Citation is up to date.",
          link: null,
          action: "",
        },
      },
    });
    expect(wrapper.text()).toContain("Recommendation");
    expect(wrapper.text()).toContain("Citation is up to date.");
    expect(wrapper.text()).toContain("✅");
  });

  it("applies the level CSS class", () => {
    const wrapper = mount(RecommendationBanner, {
      props: {
        recommendation: { level: "warn", icon: "⚠️", text: "outdated", link: null, action: "" },
      },
    });
    expect(wrapper.find(".recommendations-banner").classes()).toContain("rec-warn");
  });

  it("renders the action button when an action is provided and emits on click", async () => {
    const wrapper = mount(RecommendationBanner, {
      props: {
        recommendation: {
          level: "info",
          icon: "📋",
          text: "propose",
          link: "/somewhere",
          action: "Propose",
        },
      },
    });
    const button = wrapper.find("button.rec-action");
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain("Propose →");
    await button.trigger("click");
    const events = wrapper.emitted("action");
    expect(events).toBeTruthy();
    expect(events![0][0]).toMatchObject({ action: "Propose", link: "/somewhere" });
  });

  it("hides the action button when action is empty", () => {
    const wrapper = mount(RecommendationBanner, {
      props: {
        recommendation: { level: "ok", icon: "✅", text: "fine", link: null, action: "" },
      },
    });
    expect(wrapper.find("button.rec-action").exists()).toBe(false);
  });

  it("supports all four levels (ok, warn, info, none)", () => {
    for (const level of ["ok", "warn", "info", "none"]) {
      const wrapper = mount(RecommendationBanner, {
        props: {
          recommendation: { level, icon: "•", text: "t", link: null, action: "" },
        },
      });
      expect(wrapper.find(".recommendations-banner").classes()).toContain(`rec-${level}`);
    }
  });
});
