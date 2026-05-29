/**
 * ============================================================
 * UNIT TEST: Preference Service
 * ============================================================
 * Tests preference creation, retrieval, and score updates
 * using mocked repository.
 * ============================================================
 */
import { jest } from "@jest/globals";

// --- Mock repository ---
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockUpdateScore = jest.fn();
const mockFindByUserId = jest.fn();
const mockFindTopPreferences = jest.fn();

jest.unstable_mockModule("../repositories/preferenceRepository.js", () => ({
  default: {
    findOne: mockFindOne,
    create: mockCreate,
    updateScore: mockUpdateScore,
    findByUserId: mockFindByUserId,
    findTopPreferences: mockFindTopPreferences,
  },
}));

const { default: preferenceService } = await import(
  "../services/preferenceService.js"
);

describe("Preference Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================
  // getPreference()
  // ============================
  describe("getPreference()", () => {
    test("should return null if no preference exists", async () => {
      mockFindOne.mockResolvedValue(null);
      const result = await preferenceService.getPreference("u1", "GENRE", "Rock");
      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith("u1", "GENRE", "Rock");
    });

    test("should return existing preference", async () => {
      const pref = { userId: "u1", targetType: "GENRE", targetId: "Rock", score: 5 };
      mockFindOne.mockResolvedValue(pref);
      const result = await preferenceService.getPreference("u1", "GENRE", "Rock");
      expect(result.score).toBe(5);
    });
  });

  // ============================
  // initializePreference()
  // ============================
  describe("initializePreference()", () => {
    test("should return existing preference if it exists", async () => {
      const existing = { score: 10 };
      mockFindOne.mockResolvedValue(existing);

      const result = await preferenceService.initializePreference("u1", "SONG", "s1");
      expect(result.score).toBe(10);
      expect(mockCreate).not.toHaveBeenCalled();
    });

    test("should create new preference with score 0 if none exists", async () => {
      mockFindOne.mockResolvedValue(null);
      const newPref = { userId: "u1", targetType: "SONG", targetId: "s1", score: 0 };
      mockCreate.mockResolvedValue(newPref);

      const result = await preferenceService.initializePreference("u1", "SONG", "s1");
      expect(result.score).toBe(0);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ score: 0 })
      );
    });
  });

  // ============================
  // updatePreferenceScore()
  // ============================
  describe("updatePreferenceScore()", () => {
    test("should call repository updateScore with correct args", async () => {
      mockUpdateScore.mockResolvedValue({ score: 7.5 });
      const result = await preferenceService.updatePreferenceScore("u1", "GENRE", "Pop", 7.5);
      expect(mockUpdateScore).toHaveBeenCalledWith("u1", "GENRE", "Pop", 7.5);
      expect(result.score).toBe(7.5);
    });
  });

  // ============================
  // getUserPreferences()
  // ============================
  describe("getUserPreferences()", () => {
    test("should return all preferences for a user", async () => {
      const prefs = [{ score: 5 }, { score: 3 }];
      mockFindByUserId.mockResolvedValue(prefs);

      const result = await preferenceService.getUserPreferences("u1");
      expect(result).toHaveLength(2);
    });

    test("should filter by targetType when provided", async () => {
      mockFindByUserId.mockResolvedValue([{ score: 5 }]);
      await preferenceService.getUserPreferences("u1", "GENRE");
      expect(mockFindByUserId).toHaveBeenCalledWith("u1", "GENRE");
    });
  });

  // ============================
  // getTopPreferences()
  // ============================
  describe("getTopPreferences()", () => {
    test("should return top N preferences sorted by score", async () => {
      const prefs = [{ score: 10 }, { score: 8 }];
      mockFindTopPreferences.mockResolvedValue(prefs);

      const result = await preferenceService.getTopPreferences("u1", "ARTIST", 2);
      expect(mockFindTopPreferences).toHaveBeenCalledWith("u1", "ARTIST", 2);
      expect(result).toHaveLength(2);
      expect(result[0].score).toBe(10);
    });
  });
});
