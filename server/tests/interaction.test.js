/**
 * ============================================================
 * UNIT TEST: Interaction Service
 * ============================================================
 * Tests the business logic of recording, validating, and
 * queuing user interactions.
 * ============================================================
 */
import { jest } from "@jest/globals";

// --- Mock dependencies ---
const mockCreate = jest.fn();
const mockFindByUserId = jest.fn();
const mockFindRecentByUserId = jest.fn();

jest.unstable_mockModule("../repositories/interactionRepository.js", () => ({
  default: {
    create: mockCreate,
    findByUserId: mockFindByUserId,
    findRecentByUserId: mockFindRecentByUserId,
  },
}));

const mockAddInteractionToQueue = jest.fn();
jest.unstable_mockModule("../services/queueService.js", () => ({
  addInteractionToQueue: mockAddInteractionToQueue,
}));

const { default: interactionService } = await import(
  "../services/interactionService.js"
);

describe("Interaction Service", () => {
  const validObjectId = "507f1f77bcf86cd799439011";
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================
  // VALIDATION TESTS
  // ============================
  describe("Validation", () => {
    test("should throw error when userId is missing", async () => {
      await expect(
        interactionService.recordInteraction({
          interactionType: "PLAY",
          entityType: "SONG",
          entityId: validObjectId,
        })
      ).rejects.toThrow("Missing required interaction fields");
    });

    test("should throw error when interactionType is missing", async () => {
      await expect(
        interactionService.recordInteraction({
          userId: "user123",
          entityType: "SONG",
          entityId: validObjectId,
        })
      ).rejects.toThrow("Missing required interaction fields");
    });

    test("should throw error when entityType is missing", async () => {
      await expect(
        interactionService.recordInteraction({
          userId: "user123",
          interactionType: "PLAY",
          entityId: validObjectId,
        })
      ).rejects.toThrow("Missing required interaction fields");
    });

    test("should throw error when entityId is missing", async () => {
      await expect(
        interactionService.recordInteraction({
          userId: "user123",
          interactionType: "PLAY",
          entityType: "SONG",
        })
      ).rejects.toThrow("Missing required interaction fields");
    });

    test("should throw error when all fields are missing", async () => {
      await expect(
        interactionService.recordInteraction({})
      ).rejects.toThrow("Missing required interaction fields");
    });
  });

  // ============================
  // RECORDING TESTS
  // ============================
  describe("recordInteraction()", () => {
    const validData = {
      userId: "user123",
      interactionType: "PLAY",
      entityType: "SONG",
      entityId: validObjectId,
    };

    test("should persist interaction via repository", async () => {
      const mockInteraction = { _id: "int789", ...validData };
      mockCreate.mockResolvedValue(mockInteraction);
      mockAddInteractionToQueue.mockResolvedValue();

      const result = await interactionService.recordInteraction(validData);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user123",
          interactionType: "PLAY",
          entityType: "SONG",
          entityId: validObjectId,
          timestamp: expect.any(Date),
        })
      );
      expect(result._id).toBe("int789");
    });

    test("should queue interaction for background processing", async () => {
      const mockInteraction = { _id: "int789", ...validData };
      mockCreate.mockResolvedValue(mockInteraction);
      mockAddInteractionToQueue.mockResolvedValue();

      await interactionService.recordInteraction(validData);

      expect(mockAddInteractionToQueue).toHaveBeenCalledWith(mockInteraction);
    });
  });

  // ============================
  // HISTORY RETRIEVAL TESTS
  // ============================
  describe("getUserHistory()", () => {
    test("should retrieve user interactions", async () => {
      const mockInteractions = [{ _id: "1" }, { _id: "2" }];
      mockFindByUserId.mockResolvedValue(mockInteractions);

      const result = await interactionService.getUserHistory("user123");
      expect(result).toHaveLength(2);
      expect(mockFindByUserId).toHaveBeenCalledWith("user123");
    });
  });

  describe("getRecentHistory()", () => {
    test("should return limited number of recent interactions", async () => {
      const mockInteractions = [{ _id: "1" }];
      mockFindRecentByUserId.mockResolvedValue(mockInteractions);

      const result = await interactionService.getRecentHistory("user123", 5);
      expect(mockFindRecentByUserId).toHaveBeenCalledWith("user123", 5);
      expect(result).toHaveLength(1);
    });
  });
});
