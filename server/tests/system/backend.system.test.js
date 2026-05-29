import dotenv from "dotenv";
import mongoose from "mongoose";
import request from "supertest";

let app;
let redis;
let interactionQueue;
let interactionWorker;
let User;
let Artist;
let Song;
let Interaction;
let Preference;
let setupComplete = false;

dotenv.config({ path: "../.env.test", override: true });
dotenv.config({ path: ".env.test", override: true });
dotenv.config({ path: "../.env" });
dotenv.config();

const ensureEnv = () => {
  if (process.env.REDIS_URL && (!process.env.REDIS_HOST || !process.env.REDIS_PORT)) {
    const url = new URL(process.env.REDIS_URL);
    process.env.REDIS_HOST = url.hostname;
    process.env.REDIS_PORT = url.port || "6379";
  }

  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "test-secret";
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be set for system tests");
  }

  if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
    throw new Error("REDIS_HOST and REDIS_PORT must be set for system tests");
  }
};

const waitForQueueToDrain = async (queue, timeoutMs = 15000) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const counts = await queue.getJobCounts("waiting", "active", "delayed", "failed");
    if (counts.failed > 0) {
      throw new Error(`Interaction queue has ${counts.failed} failed jobs`);
    }
    if (counts.waiting === 0 && counts.active === 0 && counts.delayed === 0) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("Timed out waiting for interaction queue to drain");
};

const clearRedisCache = async () => {
  const recKeys = await redis.keys("recommendations:*");
  const dashKeys = await redis.keys("dashboard:*");
  const keys = [...new Set([...recKeys, ...dashKeys])];
  if (keys.length > 0) {
    await redis.del(keys);
  }
};

const registerAndVerify = async (server, { name, email, password, role }) => {
  const registerRes = await server
    .post("/api/users/register")
    .send({ name, email, password, role });

  expect(registerRes.status).toBe(201);

  const user = await User.findOne({ email });
  const verifyRes = await server
    .post("/api/users/verify-otp")
    .send({ email, otp: user.otp });

  expect(verifyRes.status).toBe(200);

  return { user, token: verifyRes.body.token };
};

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

beforeAll(async () => {
  ensureEnv();

  ({ default: app } = await import("../../app.js"));
  ({ default: redis } = await import("../../config/redis.js"));
  ({ interactionQueue } = await import("../../services/queueService.js"));
  ({ default: interactionWorker } = await import("../../workers/interactionWorker.js"));
  ({ default: User } = await import("../../models/User.js"));
  ({ default: Artist } = await import("../../models/Artist.js"));
  ({ default: Song } = await import("../../models/Song.js"));
  ({ default: Interaction } = await import("../../models/Interaction.js"));
  ({ default: Preference } = await import("../../models/Preference.js"));

  await mongoose.connect(process.env.MONGO_URI);
  setupComplete = true;
});

beforeEach(async () => {
  if (!setupComplete) return;
  await waitForQueueToDrain(interactionQueue);
  await interactionQueue.obliterate({ force: true });
  await clearRedisCache();

  await Promise.all([
    Interaction.deleteMany({}),
    Preference.deleteMany({}),
    Song.deleteMany({}),
    Artist.deleteMany({}),
    User.deleteMany({}),
  ]);
});

afterAll(async () => {
  if (!setupComplete) return;
  await waitForQueueToDrain(interactionQueue);
  await interactionWorker.close();
  await interactionQueue.close();
  await redis.quit();
  await mongoose.disconnect();
});

describe("System: Auth and Profile", () => {
  test("register -> verify OTP -> login -> profile", async () => {
    const server = request(app);
    const email = "user1@example.com";
    const password = "StrongPass123!";

    const { token } = await registerAndVerify(server, {
      name: "User One",
      email,
      password,
    });

    const loginRes = await server
      .post("/api/users/login")
      .send({ email, password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();

    const profileRes = await server
      .get("/api/users/profile")
      .set(authHeader(token));

    expect(profileRes.status).toBe(200);
    expect(profileRes.body.email).toBe(email);
  });
});

describe("System: Interactions -> Worker -> Preferences -> Cache", () => {
  test("rejects invalid interaction type", async () => {
    const server = request(app);
    const { token } = await registerAndVerify(server, {
      name: "User Two",
      email: "user2@example.com",
      password: "StrongPass123!",
    });

    const res = await server
      .post("/api/interactions")
      .set(authHeader(token))
      .send({
        interactionType: "INVALID",
        entityType: "SONG",
        entityId: "000000000000000000000000",
      });

    expect(res.status).toBe(400);
  });

  test("LIKE interaction updates preferences and invalidates cache", async () => {
    const server = request(app);
    const { user, token } = await registerAndVerify(server, {
      name: "User Two",
      email: "user2@example.com",
      password: "StrongPass123!",
    });

    const artist = await Artist.create({
      name: "Artist A",
      genres: ["Rock"],
    });

    const song = await Song.create({
      title: "Song A",
      artistId: artist._id,
      genre: "Rock",
    });

    await redis.set(`recommendations:songs:${user._id}`, JSON.stringify([{ _id: "x" }]));
    await redis.set(`recommendations:artists:${user._id}`, JSON.stringify([{ _id: "y" }]));
    await redis.set(`dashboard:${user._id}`, JSON.stringify({ sections: [] }));

    const res = await server
      .post("/api/interactions")
      .set(authHeader(token))
      .send({
        interactionType: "LIKE",
        entityType: "SONG",
        entityId: song._id.toString(),
      });

    expect(res.status).toBe(201);

    await waitForQueueToDrain(interactionQueue);

    const prefs = await Preference.find({ userId: user._id });
    const songPref = prefs.find((p) => p.targetType === "SONG" && p.targetId.toString() === song._id.toString());
    const artistPref = prefs.find((p) => p.targetType === "ARTIST" && p.targetId.toString() === artist._id.toString());
    const genrePref = prefs.find((p) => p.targetType === "GENRE" && p.targetId === "Rock");

    expect(songPref).toBeDefined();
    expect(artistPref).toBeDefined();
    expect(genrePref).toBeDefined();
    expect(songPref.score).toBeCloseTo(0.9, 5);
    expect(artistPref.score).toBeCloseTo(0.9, 5);
    expect(genrePref.score).toBeCloseTo(0.9, 5);

    expect(await redis.get(`recommendations:songs:${user._id}`)).toBeNull();
    expect(await redis.get(`recommendations:artists:${user._id}`)).toBeNull();
    expect(await redis.get(`dashboard:${user._id}`)).toBeNull();
  });
});

describe("System: Preferences", () => {
  test("rejects missing targetType", async () => {
    const server = request(app);
    const { token } = await registerAndVerify(server, {
      name: "User Six",
      email: "user6@example.com",
      password: "StrongPass123!",
    });

    const res = await server
      .get("/api/preferences/top")
      .set(authHeader(token));

    expect(res.status).toBe(400);
  });
});

describe("System: Recommendations", () => {
  test("filters recently played and uses cached results", async () => {
    const server = request(app);
    const { user, token } = await registerAndVerify(server, {
      name: "User Three",
      email: "user3@example.com",
      password: "StrongPass123!",
    });

    const artistA = await Artist.create({ name: "Artist A", genres: ["Rock"] });
    const artistB = await Artist.create({ name: "Artist B", genres: ["Pop"] });

    const song1 = await Song.create({ title: "Rock 1", artistId: artistA._id, genre: "Rock" });
    const song2 = await Song.create({ title: "Rock 2", artistId: artistA._id, genre: "Rock" });
    await Song.create({ title: "Pop 1", artistId: artistB._id, genre: "Pop" });

    const interactionRes = await server
      .post("/api/interactions")
      .set(authHeader(token))
      .send({
        interactionType: "LIKE",
        entityType: "SONG",
        entityId: song1._id.toString(),
      });

    expect(interactionRes.status).toBe(201);
    await waitForQueueToDrain(interactionQueue);

    const firstRes = await server
      .get("/api/recommendations/songs?limit=3")
      .set(authHeader(token));

    expect(firstRes.status).toBe(200);
    const firstIds = firstRes.body.map((s) => s._id.toString());
    expect(firstIds).toContain(song2._id.toString());
    expect(firstIds).not.toContain(song1._id.toString());

    const cacheKey = `recommendations:songs:${user._id}`;
    const cached = await redis.get(cacheKey);
    expect(cached).not.toBeNull();

    await Song.deleteMany({});

    const secondRes = await server
      .get("/api/recommendations/songs?limit=3")
      .set(authHeader(token));

    expect(secondRes.status).toBe(200);
    expect(secondRes.body).toEqual(firstRes.body);
  });
});

describe("System: Dashboard Personalization", () => {
  test("new user prioritizes trending and recommended", async () => {
    const server = request(app);
    const { token } = await registerAndVerify(server, {
      name: "User Four",
      email: "user4@example.com",
      password: "StrongPass123!",
    });

    const artist = await Artist.create({ name: "Artist C", genres: ["Rock"] });
    await Song.create({ title: "Song C", artistId: artist._id, genre: "Rock" });

    const dashboardRes = await server
      .get("/api/dashboard")
      .set(authHeader(token));

    expect(dashboardRes.status).toBe(200);
    const sectionIds = dashboardRes.body.sections.map((s) => s.id);
    expect(sectionIds[0]).toBe("trending");
    expect(sectionIds[1]).toBe("recommended");
  });

  test("mature user prioritizes recommended and artists", async () => {
    const server = request(app);
    const { user, token } = await registerAndVerify(server, {
      name: "User Five",
      email: "user5@example.com",
      password: "StrongPass123!",
    });

    const artist = await Artist.create({ name: "Artist D", genres: ["Jazz"] });
    const song = await Song.create({ title: "Jazz 1", artistId: artist._id, genre: "Jazz" });

    await server
      .post("/api/interactions")
      .set(authHeader(token))
      .send({ interactionType: "PLAY", entityType: "SONG", entityId: song._id.toString() });

    await server
      .post("/api/interactions")
      .set(authHeader(token))
      .send({ interactionType: "FOLLOW", entityType: "ARTIST", entityId: artist._id.toString() });

    await server
      .post("/api/interactions")
      .set(authHeader(token))
      .send({ interactionType: "FOLLOW", entityType: "ARTIST", entityId: artist._id.toString() });

    await waitForQueueToDrain(interactionQueue);

    const dashboardRes = await server
      .get("/api/dashboard")
      .set(authHeader(token));

    expect(dashboardRes.status).toBe(200);
    const sectionIds = dashboardRes.body.sections.map((s) => s.id);
    expect(sectionIds[0]).toBe("recommended");
    expect(sectionIds[1]).toBe("artists");

    const topArtist = await Preference.findOne({
      userId: user._id,
      targetType: "ARTIST",
      targetId: artist._id,
    });
    expect(topArtist.score).toBeGreaterThan(5);
  });
});
