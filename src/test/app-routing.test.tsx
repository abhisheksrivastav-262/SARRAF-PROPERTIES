import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches all ten public pages instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const routes = [
      ["/", "/"],
      ["/about", "/about"],
      ["/residential-properties", "/residential-properties"],
      ["/commercial-properties", "/commercial-properties"],
      ["/buy-property", "/buy-property"],
      ["/sell-property", "/sell-property"],
      ["/services", "/services"],
      ["/locations", "/locations"],
      ["/gallery", "/gallery"],
      ["/contact", "/contact"],
    ] as const;

    for (const [path, routeId] of routes) {
      const matches = router.matchRoutes(path);
      expect(matches.at(-1)?.routeId, `${path} should match ${routeId}`).toBe(routeId);
      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    }
  });

  it("matches the protected admin dashboard and private login routes", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    for (const [path, routeId] of [["/admin", "/admin"], ["/admin/login", "/admin/login"]] as const) {
      const matches = router.matchRoutes(path);
      expect(matches.at(-1)?.routeId, `${path} should match ${routeId}`).toBe(routeId);
    }
  });
});
