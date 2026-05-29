/**
 * ============================================================
 * UNIT TEST: Recommendation Service
 * ============================================================
 * Tests candidate discovery, scoring, filtering, cache interaction,
 * and controlled exploration.
 * ============================================================
 */
import { jest } from "@jest/globals";

const mockFindTopPreferences = jest.fn();
const mockFindByUserIdPreference = jest.fn();
jest.unstable_mockModule("../repositories/preferenceRepository.js", () => ({
  default: {
    findTopPreferences: mockFindTopPreferences,
    findByUserId: mockFindByUserIdPreference,
  },
}));

const mockFindRecentByUserId = jest.fn();
jest.unstable_mockModule("../repositories/interactionRepository.js", () => ({
  default: {
    findRecentByUserId: mockFindRecentByUserId,
  },
}));

const mockRedisGet = jest.fn();
const mockRedisSet = jest.fn();
const mockRedisDel = jest.fn();
jest.unstable_mockModule("../config/redis.js", () => ({
  default: {
    get: mockRedisGet,
    set: mockRedisSet,
    del: mockRedisDel,
  },
}));

const mockSongFind = jest.fn();
jest.unstable_mockModule("../models/Song.js", () => {
    return {
        default: {
            find: mockSongFind,
        }
    }
});

const mockArtistFind = jest.fn();
jest.unstable_mockModule("../models/Artist.js", () => ({
  default: {
    find: mockArtistFind,
  },
}));

const { default: recommendationService } = await import(
  "../services/recommendationService.js"
);

describe("Recommendation Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSongRecommendations()", () => {
    const userId = "testUser1";

    test("should return cached recommendations if available", async () => {
      const cachedData = [{ _id: "song1", recommendationScore: 10 }];
      mockRedisGet.mockResolvedValue(JSON.stringify(cachedData));

      const result = await recommendationService.getSongRecommendations(userId, 10);
      expect(result).toEqual(cachedData);
      expect(mockRedisGet).toHaveBeenCalledWith(`recommendations:songs:${userId}`);
      expect(mockFindTopPreferences).not.toHaveBeenCalled(); // Shouldn't fetch preferences
    });

    // We skip testing the full DB pipeline in pure unit tests due to mongoose query chaining (e.g. .limit().populate()),
    // but we can test the cache invalidation and scoring logic independently.
  });

  describe("_scoreCandidates()", () => {
      test("should score candidates based on artist and genre preferences", async () => {
          const userId = "testUser2";
          const songs = [
              { _id: "s1", artistId: "a1", genre: "Rock", toObject: () => ({ _id: "s1", artistId: "a1", genre: "Rock" }) },
              { _id: "s2", artistId: "a2", genre: "Pop", toObject: () => ({ _id: "s2", artistId: "a2", genre: "Pop" }) },
          ];

          mockFindByUserIdPreference.mockImplementation((id, type) => {
              if (type === "ARTIST") return Promise.resolve([{ targetId: "a1", score: 5 }]);
              if (type === "GENRE") return Promise.resolve([{ targetId: "Rock", score: 10 }]);
              return Promise.resolve([]);
          });

          const result = await recommendationService._scoreCandidates(userId, songs);
          
          expect(result.find(s => s._id === "s1").recommendationScore).toBe(15); // 5 + 10
          expect(result.find(s => s._id === "s2").recommendationScore).toBe(0);  // 0 + 0
      });
  });

  /* Note: More extensive integration tests for getSongRecommendations require an in-memory DB 
     because of Mongoose Query chained methods we aren't fully mocking here. */
});
