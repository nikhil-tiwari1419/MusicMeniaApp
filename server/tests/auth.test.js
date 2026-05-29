/**
 * ============================================================
 * UNIT TEST: Auth Middleware
 * ============================================================
 * Tests JWT verification, token extraction, and role-based
 * authorization. Uses mocked User model.
 * ============================================================
 */
import { jest } from "@jest/globals";

// --- Mock User model ---
const mockFindById = jest.fn();
jest.unstable_mockModule("../models/User.js", () => ({
  default: {
    findById: jest.fn().mockReturnValue({
      select: mockFindById,
    }),
  },
}));

// --- Mock jsonwebtoken ---
const mockVerify = jest.fn();
jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: mockVerify,
  },
}));

const { protect, authorize } = await import(
  "../middleware/authMiddleware.js"
);

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  // ============================
  // protect() TESTS
  // ============================
  describe("protect()", () => {
    test("should return 401 if no token is provided", async () => {
      await protect(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("no token") })
      );
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 401 if token is invalid", async () => {
      req.headers.authorization = "Bearer invalidtoken";
      mockVerify.mockImplementation(() => {
        throw new Error("jwt malformed");
      });

      await protect(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 401 if user not found in DB", async () => {
      req.headers.authorization = "Bearer validtoken";
      mockVerify.mockReturnValue({ id: "user123" });
      mockFindById.mockResolvedValue(null);

      await protect(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test("should call next() and set req.user on valid token", async () => {
      const mockUser = { _id: "user123", name: "Test", role: "user" };
      req.headers.authorization = "Bearer validtoken";
      mockVerify.mockReturnValue({ id: "user123" });
      mockFindById.mockResolvedValue(mockUser);

      await protect(req, res, next);
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });
  });

  // ============================
  // authorize() TESTS
  // ============================
  describe("authorize()", () => {
    test("should return 403 if user role is not in allowed roles", () => {
      req.user = { role: "user" };
      const middleware = authorize("artist", "admin");
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    test("should call next() if user role is allowed", () => {
      req.user = { role: "artist" };
      const middleware = authorize("artist", "admin");
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
