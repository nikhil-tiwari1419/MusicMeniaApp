/**
 * ============================================================
 * UNIT TEST: EWMA Scoring Engine
 * ============================================================
 * Tests the core mathematical logic of Exponentially Weighted
 * Moving Average calculations. These tests run WITHOUT any
 * database or external dependency.
 * ============================================================
 */
import { jest } from "@jest/globals";

// --- Mock preferenceService BEFORE importing EWMAService ---
const mockGetPreference = jest.fn();
const mockUpdatePreferenceScore = jest.fn();

jest.unstable_mockModule("../services/preferenceService.js", () => ({
  default: {
    getPreference: mockGetPreference,
    updatePreferenceScore: mockUpdatePreferenceScore,
  },
}));

const { default: EWMAService } = await import("../services/EWMAService.js");

describe("EWMA Scoring Engine", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================
  // PURE MATH TESTS
  // ============================
  describe("calculateNewScore()", () => {
    test("should return correct EWMA score for PLAY interaction (+1)", () => {
      const previousScore = 0;
      const weight = 1; // PLAY
      const result = EWMAService.calculateNewScore(previousScore, weight);
      // Formula: 0.3 * 1 + 0.7 * 0 = 0.3
      expect(result).toBeCloseTo(0.3, 5);
    });

    test("should return correct EWMA score for LIKE interaction (+3)", () => {
      const previousScore = 5;
      const weight = 3; // LIKE
      const result = EWMAService.calculateNewScore(previousScore, weight);
      // Formula: 0.3 * 3 + 0.7 * 5 = 0.9 + 3.5 = 4.4
      expect(result).toBeCloseTo(4.4, 5);
    });

    test("should return correct EWMA score for FOLLOW interaction (+10)", () => {
      const previousScore = 2;
      const weight = 10; // FOLLOW
      const result = EWMAService.calculateNewScore(previousScore, weight);
      // Formula: 0.3 * 10 + 0.7 * 2 = 3 + 1.4 = 4.4
      expect(result).toBeCloseTo(4.4, 5);
    });

    test("should reduce score for SKIP interaction (-1)", () => {
      const previousScore = 5;
      const weight = -1; // SKIP
      const result = EWMAService.calculateNewScore(previousScore, weight);
      // Formula: 0.3 * (-1) + 0.7 * 5 = -0.3 + 3.5 = 3.2
      expect(result).toBeCloseTo(3.2, 5);
    });

    test("should handle zero previous score correctly", () => {
      const result = EWMAService.calculateNewScore(0, 4);
      // Formula: 0.3 * 4 + 0.7 * 0 = 1.2
      expect(result).toBeCloseTo(1.2, 5);
    });

    test("should decay score toward zero when weight is 0", () => {
      const previousScore = 10;
      const result = EWMAService.calculateNewScore(previousScore, 0);
      // Formula: 0.3 * 0 + 0.7 * 10 = 7.0
      expect(result).toBeCloseTo(7.0, 5);
    });

    test("recent behavior should outweigh historical over repeated interactions", () => {
      // Simulate a user who WAS into Rock (score=20) but now only listens to Jazz
      let rockScore = 20;
      let jazzScore = 0;

      // 10 rounds of no Rock, all Jazz
      for (let i = 0; i < 10; i++) {
        rockScore = EWMAService.calculateNewScore(rockScore, 0);
        jazzScore = EWMAService.calculateNewScore(jazzScore, 3); // LIKE weight
      }

      expect(jazzScore).toBeGreaterThan(rockScore);
    });
  });

  // ============================
  // INTERACTION WEIGHT MAPPING
  // ============================
  describe("Interaction Weights", () => {
    test("PLAY weight should be 1", () => {
      expect(EWMAService.WEIGHTS.PLAY).toBe(1);
    });

    test("REPLAY weight should be 2", () => {
      expect(EWMAService.WEIGHTS.REPLAY).toBe(2);
    });

    test("LIKE weight should be 3", () => {
      expect(EWMAService.WEIGHTS.LIKE).toBe(3);
    });

    test("PLAYLIST_ADD weight should be 4", () => {
      expect(EWMAService.WEIGHTS.PLAYLIST_ADD).toBe(4);
    });

    test("FOLLOW weight should be 10", () => {
      expect(EWMAService.WEIGHTS.FOLLOW).toBe(10);
    });

    test("SKIP weight should be -1", () => {
      expect(EWMAService.WEIGHTS.SKIP).toBe(-1);
    });
  });

  // ============================
  // ALPHA CONSTANT
  // ============================
  describe("Alpha Configuration", () => {
    test("Alpha should be between 0 and 1 (exclusive)", () => {
      expect(EWMAService.ALPHA).toBeGreaterThan(0);
      expect(EWMAService.ALPHA).toBeLessThan(1);
    });

    test("Alpha should be 0.3", () => {
      expect(EWMAService.ALPHA).toBe(0.3);
    });
  });

  // ============================
  // processInteraction() TESTS
  // ============================
  describe("processInteraction()", () => {
    const userId = "user123";

    test("should update song preference for SONG entity", async () => {
      mockGetPreference.mockResolvedValue({ score: 5 });
      mockUpdatePreferenceScore.mockResolvedValue({ score: 4.4 });

      const interaction = {
        userId,
        interactionType: "LIKE",
        entityType: "SONG",
        entityId: "song123",
      };

      await EWMAService.processInteraction(interaction, {});
      expect(mockUpdatePreferenceScore).toHaveBeenCalledWith(
        userId,
        "SONG",
        "song123",
        expect.any(Number)
      );
    });

    test("should update artist preference when metadata.artistId is provided", async () => {
      mockGetPreference.mockResolvedValue({ score: 0 });
      mockUpdatePreferenceScore.mockResolvedValue({ score: 0.3 });

      const interaction = {
        userId,
        interactionType: "PLAY",
        entityType: "SONG",
        entityId: "song123",
      };
      const metadata = { artistId: "artist456" };

      await EWMAService.processInteraction(interaction, metadata);

      // Should call for SONG and ARTIST
      expect(mockUpdatePreferenceScore).toHaveBeenCalledWith(
        userId,
        "ARTIST",
        "artist456",
        expect.any(Number)
      );
    });

    test("should update genre preferences when metadata.genres is provided", async () => {
      mockGetPreference.mockResolvedValue({ score: 0 });
      mockUpdatePreferenceScore.mockResolvedValue({ score: 0.3 });

      const interaction = {
        userId,
        interactionType: "PLAY",
        entityType: "SONG",
        entityId: "song123",
      };
      const metadata = { artistId: "artist456", genres: ["Rock", "Metal"] };

      await EWMAService.processInteraction(interaction, metadata);

      // Should be called for: SONG, ARTIST, GENRE(Rock), GENRE(Metal) = 4 calls
      expect(mockUpdatePreferenceScore).toHaveBeenCalledTimes(4);
    });

    test("should skip unknown interaction types", async () => {
      const interaction = {
        userId,
        interactionType: "UNKNOWN_TYPE",
        entityType: "SONG",
        entityId: "song123",
      };

      await EWMAService.processInteraction(interaction);
      expect(mockUpdatePreferenceScore).not.toHaveBeenCalled();
    });
  });
});
