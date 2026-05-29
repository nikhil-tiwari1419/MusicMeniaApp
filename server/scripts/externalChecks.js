import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(serverRoot, "..");

const loadEnv = () => {
  dotenv.config({ path: path.resolve(repoRoot, ".env.test"), override: true });
  dotenv.config({ path: path.resolve(serverRoot, ".env.test"), override: true });
  dotenv.config({ path: path.resolve(repoRoot, ".env") });
  dotenv.config({ path: path.resolve(serverRoot, ".env") });
  dotenv.config();
};

const run = async () => {
  loadEnv();

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "production";
  }

  const { default: imageKitService } = await import(
    "../services/imageKitService.js"
  );
  const { sendEmail } = await import("../utils/sendEmail.js");

  const results = [];

  const checkImageKit = async () => {
    const hasImageKit =
      process.env.IMAGEKIT_PUBLIC_KEY &&
      process.env.IMAGEKIT_PRIVATE_KEY &&
      process.env.IMAGEKIT_URL_ENDPOINT;

    if (!hasImageKit) {
      throw new Error("Missing ImageKit configuration");
    }

    const payload = Buffer.from("MusicMenia healthcheck", "utf-8");
    const upload = await imageKitService.uploadFile(
      payload,
      "healthcheck.txt",
      "/healthcheck"
    );

    if (!upload?.fileId) {
      throw new Error("ImageKit upload did not return fileId");
    }

    await imageKitService.deleteFile(upload.fileId);
  };

  const checkEmail = async () => {
    const toEmail =
      process.env.HEALTHCHECK_EMAIL_TO ||
      process.env.BREVO_SENDER_EMAIL ||
      process.env.BREVO_EMAIL;

    if (!toEmail) {
      throw new Error("Missing HEALTHCHECK_EMAIL_TO or BREVO sender email");
    }

    const response = await sendEmail(
      toEmail,
      "MusicMenia healthcheck",
      "<p>MusicMenia external email healthcheck.</p>"
    );

    if (!response || response.skipped) {
      throw new Error("Email send was skipped or returned no response");
    }
  };

  const checks = [
    { name: "ImageKit", fn: checkImageKit },
    { name: "Brevo Email", fn: checkEmail },
  ];

  for (const check of checks) {
    try {
      await check.fn();
      results.push({ name: check.name, ok: true });
      console.log(`[ExternalCheck] ${check.name}: OK`);
    } catch (error) {
      results.push({ name: check.name, ok: false, error: error.message });
      console.error(`[ExternalCheck] ${check.name}: FAIL - ${error.message}`);
    }
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    process.exit(1);
  }
};

run().catch((error) => {
  console.error(`[ExternalCheck] Unexpected failure: ${error.message}`);
  process.exit(1);
});
