import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase", async () => {
  const actual = await vi.importActual<typeof import("@/lib/supabase")>("@/lib/supabase");
  return { ...actual, getSupabase: () => null };
});

import { routeTree } from "@/routeTree.gen";

describe("admin login nested route", () => {
  it("renders the login page through the /admin layout instead of the dashboard guard", async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ["/admin/login"] }),
      context: { queryClient: new QueryClient() },
    });
    await router.load();
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole("heading", { name: "Admin sign in" })).toBeInTheDocument();
    expect(screen.queryByText("Supabase configuration is required for the protected dashboard.")).not.toBeInTheDocument();
  });
});
