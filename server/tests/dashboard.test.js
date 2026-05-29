/**
 * ============================================================
 * UNIT TEST: Dashboard Service — Adaptive Section Ordering
 * ============================================================
 * Tests the dashboard section reordering logic for New, Growing,
 * and Mature users WITHOUT any DB dependency.
 * ============================================================
 */
import { jest } from "@jest/globals";

// --- Mock ALL external dependencies ---
jest.unstable_mockModule("../config/redis.js", () => ({
  default: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue("OK"),
    del: jest.fn().mockResolvedValue(1),
  },
}));

jest.unstable_mockModule("../repositories/preferenceRepository.js", () => ({
  default: {
    findTopPreferences: jest.fn().mockResolvedValue([]),
  },
}));

jest.unstable_mockModule("../services/recommendationService.js", () => ({
  default: {
    getSongRecommendations: jest.fn().mockResolvedValue([{ _id: "s1" }]),
    getArtistRecommendations: jest.fn().mockResolvedValue([{ _id: "a1" }]),
    getTrendingInGenres: jest.fn().mockResolvedValue([{ _id: "t1" }]),
    getDiscoveryContent: jest.fn().mockResolvedValue([{ _id: "d1" }]),
    getNewReleases: jest.fn().mockResolvedValue([{ _id: "n1" }]),
  },
}));

jest.unstable_mockModule("../repositories/interactionRepository.js", () => ({
  default: {
    findRecentByUserId: jest.fn().mockResolvedValue([]),
  },
}));

jest.unstable_mockModule("../models/Song.js", () => ({
  default: {
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([]),
    }),
  },
}));

const { default: dashboardService } = await import(
  "../services/dashboardService.js"
);
const { default: prefRepo } = await import(
  "../repositories/preferenceRepository.js"
);
const { default: interactionRepo } = await import(
  "../repositories/interactionRepository.js"
);
const { default: Song } = await import("../models/Song.js");

describe("Dashboard Service — Adaptive Ordering", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Song.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([]),
    });
  });

  describe("_moveSection()", () => {
    test("should move a section to the specified index", () => {
      const sections = [
        { id: "a" },
        { id: "b" },
        { id: "c" },
        { id: "d" },
      ];
      dashboardService._moveSection(sections, "c", 0);
      expect(sections[0].id).toBe("c");
    });

    test("should not change array if section id does not exist", () => {
      const sections = [{ id: "a" }, { id: "b" }];
      dashboardService._moveSection(sections, "z", 0);
      expect(sections[0].id).toBe("a");
      expect(sections[1].id).toBe("b");
    });

    test("should not change array if already at target index", () => {
      const sections = [{ id: "a" }, { id: "b" }];
      dashboardService._moveSection(sections, "a", 0);
      expect(sections[0].id).toBe("a");
    });
  });

  describe("New User Dashboard", () => {
    test("should prioritize Trending and Recommended for new users (no recently played)", async () => {
      // Simulate new user: no interactions
      interactionRepo.findRecentByUserId.mockResolvedValue([]);
      prefRepo.findTopPreferences.mockResolvedValue([]);

      const dashboard = await dashboardService.getPersonalizedDashboard(
        "newUserId"
      );

      const sectionIds = dashboard.sections.map((s) => s.id);
      // Trending should be first, Recommended should be second
      expect(sectionIds[0]).toBe("trending");
      expect(sectionIds[1]).toBe("recommended");
    });
  });

  describe("Mature User Dashboard", () => {
    test("should prioritize Recommended and Artists for mature users", async () => {
      // Simulate mature user: has recently played and strong preferences
      interactionRepo.findRecentByUserId.mockResolvedValue([
        { entityType: "SONG", entityId: "s1" },
      ]);
      prefRepo.findTopPreferences.mockResolvedValue([
        { targetId: "artist1", score: 10 },
      ]);
      Song.find.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue([{ _id: "s1" }]),
      });

      const dashboard = await dashboardService.getPersonalizedDashboard(
        "matureUserId"
      );

      const sectionIds = dashboard.sections.map((s) => s.id);
      expect(sectionIds[0]).toBe("recommended");
      expect(sectionIds[1]).toBe("artists");
    });
  });
});
