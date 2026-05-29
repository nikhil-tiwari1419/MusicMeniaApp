import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { PassThrough } from "stream";

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

/**
 * Compresses an audio buffer using FFmpeg
 * @param {Buffer} inputBuffer - Original audio buffer
 * @returns {Promise<Buffer>} - Compressed audio buffer
 */
export const compressAudio = async (inputBuffer) => {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    const outputStream = new PassThrough();
    const chunks = [];

    outputStream.on("data", (chunk) => chunks.push(chunk));
    outputStream.on("end", () => resolve(Buffer.concat(chunks)));
    outputStream.on("error", (err) => reject(err));

    ffmpeg(inputStream)
      .toFormat("mp3")
      .audioBitrate("128k") // Standard bitrate for good quality vs size
      .on("error", (err) => {
        console.error("[AudioService] FFmpeg error:", err.message);
        reject(err);
      })
      .pipe(outputStream, { end: true });

    inputStream.end(inputBuffer);
  });
};
