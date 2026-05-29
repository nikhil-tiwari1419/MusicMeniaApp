/**
 * ============================================================
 * UNIT TEST: ImageKit Service
 * ============================================================
 * Tests file upload and deletion using mocked ImageKit SDK.
 * ============================================================
 */
import { jest } from "@jest/globals";

const mockUpload = jest.fn();
const mockDeleteFile = jest.fn();

jest.unstable_mockModule("../config/imagekit.js", () => ({
  default: {
    upload: mockUpload,
    deleteFile: mockDeleteFile,
  },
}));

const { default: imageKitService } = await import(
  "../services/imageKitService.js"
);

describe("ImageKit Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadFile()", () => {
    test("should upload a file and return response", async () => {
      const mockResponse = {
        fileId: "file123",
        url: "https://ik.imagekit.io/music/test.mp3",
        name: "test.mp3",
      };
      mockUpload.mockResolvedValue(mockResponse);

      const buffer = Buffer.from("fake audio content");
      const result = await imageKitService.uploadFile(
        buffer,
        "test.mp3",
        "/audio"
      );

      expect(mockUpload).toHaveBeenCalledWith({
        file: buffer,
        fileName: "test.mp3",
        folder: "/audio",
      });
      expect(result.fileId).toBe("file123");
      expect(result.url).toContain("imagekit.io");
    });

    test("should use default folder when none specified", async () => {
      mockUpload.mockResolvedValue({ fileId: "f1" });

      await imageKitService.uploadFile(Buffer.from("data"), "file.jpg");

      expect(mockUpload).toHaveBeenCalledWith(
        expect.objectContaining({ folder: "/music-menia" })
      );
    });

    test("should throw error on upload failure", async () => {
      mockUpload.mockRejectedValue(new Error("Network error"));

      await expect(
        imageKitService.uploadFile(Buffer.from("data"), "file.jpg")
      ).rejects.toThrow("Failed to upload file to ImageKit");
    });
  });

  describe("deleteFile()", () => {
    test("should delete a file by ID", async () => {
      mockDeleteFile.mockResolvedValue(undefined);

      await imageKitService.deleteFile("file123");
      expect(mockDeleteFile).toHaveBeenCalledWith("file123");
    });

    test("should throw error on deletion failure", async () => {
      mockDeleteFile.mockRejectedValue(new Error("Not found"));

      await expect(imageKitService.deleteFile("bad_id")).rejects.toThrow(
        "Failed to delete file from ImageKit"
      );
    });
  });
});
