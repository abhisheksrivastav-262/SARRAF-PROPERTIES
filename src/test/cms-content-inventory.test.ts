import { describe, expect, it } from "vitest";
import { CMS_PAGES, legacyWebsitePageContent } from "@/lib/cms";

describe("existing website content inventory", () => {
  it("provides a mapped page document for every current CMS route", () => {
    for (const [slug] of CMS_PAGES) {
      const document = legacyWebsitePageContent(slug);
      expect(document?.sections.length, slug).toBeGreaterThan(0);
      expect(
        document?.sections.some((section) => section.type === "hero"),
        slug,
      ).toBe(true);
    }
  });

  it("includes each current service and its bundled image on Home and Services", () => {
    for (const slug of ["home", "services"]) {
      const serviceSection = legacyWebsitePageContent(slug)?.sections.find(
        (section) => section.type === "services",
      );
      expect(serviceSection?.items).toHaveLength(6);
      expect(serviceSection?.items?.every((item) => item.media_path?.startsWith("static:"))).toBe(
        true,
      );
    }
  });

  it("preserves per-image titles, categories, alt text, and paths in the gallery mapping", () => {
    const gallery = legacyWebsitePageContent("gallery")?.sections.find(
      (section) => section.type === "gallery",
    );
    expect(gallery?.items).toHaveLength(4);
    expect(
      gallery?.items?.every((item) => item.title && item.body && item.alt_text && item.media_path),
    ).toBe(true);
  });
});
