import imagekit from "../config/imagekit.js";

class ImageKitService {
  /**
   * Upload a file to ImageKit
   * @param {Buffer} fileBuffer - The file buffer to upload
   * @param {string} fileName - The name of the file
   * @param {string} folder - The folder to store the file in
   * @returns {Promise<Object>} - The upload response from ImageKit
   */
  async uploadFile(fileBuffer, fileName, folder = "/music-menia") {
    try {
      const response = await imagekit.upload({
        file: fileBuffer, // can be base64, buffer or file url
        fileName: fileName,
        folder: folder,
      });
      return response;
    } catch (error) {
      console.error("[ImageKitService] Upload failed:", error);
      throw new Error("Failed to upload file to ImageKit");
    }
  }

  /**
   * Delete a file from ImageKit
   * @param {string} fileId - The ID of the file to delete
   */
  async deleteFile(fileId) {
    try {
      await imagekit.deleteFile(fileId);
    } catch (error) {
      console.error("[ImageKitService] Deletion failed:", error);
      throw new Error("Failed to delete file from ImageKit");
    }
  }
}

export default new ImageKitService();
