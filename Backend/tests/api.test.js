// Run with: npm test   (needs a MongoDB; set TEST_MONGODB_URI or uses localhost)
process.env.NODE_ENV = "test";
process.env.CLOUDINARY_CLOUD_NAME = ""; // always test local storage
process.env.JWT_SECRET = "test-secret-test-secret-test-secret-123456";

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import mongoose from "mongoose";
import { execFileSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const { checkConfig } = await import("../utils/config.js");
const { connectDB, disconnectDB } = await import("../database/db.js");
const { createApp } = await import("../app.js");
const { User } = await import("../models/userModels.js");
const { AUDIO_DIR } = await import("../utils/storage.js");

const uri = process.env.TEST_MONGODB_URI || "mongodb://127.0.0.1:27017/rge_test";
let app, adminToken, memberToken, sermonId, tmp;

before(async () => {
  checkConfig();
  await connectDB(uri);
  await mongoose.connection.db.dropDatabase();
  app = createApp();

  const admin = new User({ name: "Admin", email: "admin@rge.test", role: "admin" });
  await admin.setPassword("admin-password");
  await admin.save();
  adminToken = (await request(app).post("/api/auth/login").send({ email: "admin@rge.test", password: "admin-password" })).body.token;

  tmp = await fs.mkdtemp(path.join(os.tmpdir(), "rge-test-"));
  // A real 20-second stereo WAV, like a raw recording from a mixer (~3.5 MB)
  execFileSync(ffmpegPath, ["-loglevel", "error", "-f", "lavfi", "-i", "sine=frequency=220:duration=20",
    "-ac", "2", "-ar", "44100", path.join(tmp, "faith.wav")]);
  await fs.writeFile(path.join(tmp, "broken.mp3"), Buffer.from("this is not really audio"));
  await fs.writeFile(path.join(tmp, "cover.jpg"), Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]));
});

after(async () => {
  await mongoose.connection.db.dropDatabase();
  await disconnectDB();
  await fs.rm(tmp, { recursive: true, force: true });
});

test("health check", async () => {
  const res = await request(app).get("/api/health");
  assert.equal(res.status, 200);
});

test("member can register; duplicates and weak passwords are refused", async () => {
  const bad = await request(app).post("/api/auth/register").send({ name: "Ada", email: "ada@rge.test", password: "short" });
  assert.equal(bad.status, 400);
  assert.match(bad.body.error, /8 characters/);

  const res = await request(app).post("/api/auth/register").send({ name: "Ada Obi", email: "ADA@rge.test", password: "password123" });
  assert.equal(res.status, 201);
  assert.ok(res.body.token);
  assert.equal(res.body.user.email, "ada@rge.test");
  assert.equal(res.body.user.role, "member");
  assert.equal(res.body.user.passwordHash, undefined);
  memberToken = res.body.token;

  const dup = await request(app).post("/api/auth/register").send({ name: "Ada", email: "ada@rge.test", password: "password123" });
  assert.equal(dup.status, 409);
});

test("login works with the right password only", async () => {
  const wrong = await request(app).post("/api/auth/login").send({ email: "ada@rge.test", password: "nope-nope" });
  assert.equal(wrong.status, 401);
  const ok = await request(app).post("/api/auth/login").send({ email: "ada@rge.test", password: "password123" });
  assert.equal(ok.status, 200);
  const me = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${ok.body.token}`);
  assert.equal(me.body.user.name, "Ada Obi");
});

test("members cannot upload sermons", async () => {
  const res = await request(app).post("/api/sermons").set("Authorization", `Bearer ${memberToken}`).field("title", "x").field("date", "2026-01-01");
  assert.equal(res.status, 403);
  const anon = await request(app).post("/api/sermons").field("title", "x");
  assert.equal(anon.status, 401);
});

test("admin uploads a sermon with audio and cover", async () => {
  const missing = await request(app).post("/api/sermons").set("Authorization", `Bearer ${adminToken}`).field("speaker", "x");
  assert.equal(missing.status, 400);

  const res = await request(app)
    .post("/api/sermons")
    .set("Authorization", `Bearer ${adminToken}`)
    .field("title", "Faith That Burns")
    .field("series", "Foundations")
    .field("date", "2026-02-12")
    .attach("audio", path.join(tmp, "faith.wav"), { contentType: "audio/wav" })
    .attach("image", path.join(tmp, "cover.jpg"), { contentType: "image/jpeg" });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  assert.equal(res.body.sermon.hasAudio, true);
  // Compressed: a 3.5 MB WAV becomes a ~160 KB mono MP3 at 64 kbps
  const original = (await fs.stat(path.join(tmp, "faith.wav"))).size;
  assert.equal(res.body.sermon.audioFormat, "mp3");
  assert.ok(res.body.sermon.audioBytes < original / 10, `expected big shrink, got ${res.body.sermon.audioBytes} from ${original}`);
  assert.ok(res.body.sermon.audioBytes > 120_000 && res.body.sermon.audioBytes < 200_000);
  assert.equal(res.body.sermon.durationSec, 20);
  assert.equal(res.body.sermon.speaker, "Apostle Light Iwuh");
  assert.match(res.body.sermon.imageUrl, /\/uploads\/images\//);
  sermonId = res.body.sermon.id;

  const wrongType = await request(app)
    .post("/api/sermons")
    .set("Authorization", `Bearer ${adminToken}`)
    .field("title", "Bad").field("date", "2026-01-01")
    .attach("audio", path.join(tmp, "cover.jpg"), { contentType: "image/jpeg" });
  assert.equal(wrongType.status, 400);

  const broken = await request(app)
    .post("/api/sermons")
    .set("Authorization", `Bearer ${adminToken}`)
    .field("title", "Broken").field("date", "2026-01-01")
    .attach("audio", path.join(tmp, "broken.mp3"), { contentType: "audio/mpeg" });
  assert.equal(broken.status, 400);
  assert.match(broken.body.error, /couldn't be read/);
});

test("anyone can browse sermons, but audio details stay private", async () => {
  const res = await request(app).get("/api/sermons?search=burns");
  assert.equal(res.status, 200);
  assert.equal(res.body.total, 1);
  const s = res.body.sermons[0];
  assert.equal(s.title, "Faith That Burns");
  assert.equal(s.audio, undefined);
  assert.equal(s.downloads, undefined);

  const series = await request(app).get("/api/sermons/series");
  assert.deepEqual(series.body.series, ["Foundations"]);
  const none = await request(app).get("/api/sermons?search=zzz");
  assert.equal(none.body.total, 0);
});

test("downloading needs a login and gives a working short-lived link", async () => {
  const anon = await request(app).get(`/api/sermons/${sermonId}/download`);
  assert.equal(anon.status, 401);

  const res = await request(app).get(`/api/sermons/${sermonId}/download`).set("Authorization", `Bearer ${memberToken}`);
  assert.equal(res.status, 200);
  assert.match(res.body.filename, /2026-02-12 - Faith That Burns/);
  const url = new URL(res.body.url);

  const file = await request(app).get(url.pathname + url.search);
  assert.equal(file.status, 200);
  assert.match(file.headers["content-disposition"], /attachment/);
  assert.match(file.headers["content-disposition"], /\.mp3/);
  assert.equal(file.headers["content-type"], "audio/mpeg");
  assert.ok(file.body.length > 120_000);

  const forged = await request(app).get(`/api/sermons/${sermonId}/file?token=abc`);
  assert.equal(forged.status, 403);

  const listen = await request(app).get(`/api/sermons/${sermonId}/download?mode=listen`).set("Authorization", `Bearer ${memberToken}`);
  const lurl = new URL(listen.body.url);
  const stream = await request(app).get(lurl.pathname + lurl.search);
  assert.equal(stream.headers["content-disposition"], undefined);

  const stats = await request(app).get("/api/sermons/admin/all").set("Authorization", `Bearer ${adminToken}`);
  assert.equal(stats.body.sermons[0].downloads, 1); // listening doesn't count as a download
});

test("unpublished sermons are hidden from the public", async () => {
  const res = await request(app).patch(`/api/sermons/${sermonId}`).set("Authorization", `Bearer ${adminToken}`).field("published", "false");
  assert.equal(res.status, 200);
  assert.equal((await request(app).get("/api/sermons")).body.total, 0);
  assert.equal((await request(app).get(`/api/sermons/${sermonId}`)).status, 404);
  await request(app).patch(`/api/sermons/${sermonId}`).set("Authorization", `Bearer ${adminToken}`).field("published", "true");
});

test("deleting a sermon removes its audio file", async () => {
  const before = await fs.readdir(AUDIO_DIR);
  const res = await request(app).delete(`/api/sermons/${sermonId}`).set("Authorization", `Bearer ${adminToken}`);
  assert.equal(res.status, 200);
  const after = await fs.readdir(AUDIO_DIR);
  assert.equal(after.length, before.length - 1);
  assert.equal((await request(app).get(`/api/sermons/${sermonId}`)).status, 404);
});

test("password reset flow", async () => {
  const logs = [];
  const orig = console.log;
  console.log = (...a) => logs.push(a.join(" "));
  const res = await request(app).post("/api/auth/forgot-password").send({ email: "ada@rge.test" });
  const unknown = await request(app).post("/api/auth/forgot-password").send({ email: "nobody@rge.test" });
  console.log = orig;
  assert.equal(res.status, 200);
  assert.equal(unknown.body.message, res.body.message); // same answer either way

  const token = logs.join("\n").match(/reset-password\?token=([a-f0-9]+)/)[1];
  const reset = await request(app).post("/api/auth/reset-password").send({ token, password: "brand-new-pass" });
  assert.equal(reset.status, 200);
  const again = await request(app).post("/api/auth/reset-password").send({ token, password: "another-pass" });
  assert.equal(again.status, 400); // link only works once
  const login = await request(app).post("/api/auth/login").send({ email: "ada@rge.test", password: "brand-new-pass" });
  assert.equal(login.status, 200);
});

test("visitor form and newsletter", async () => {
  const bad = await request(app).post("/api/visitors").send({ name: "" });
  assert.equal(bad.status, 400);
  const ok = await request(app).post("/api/visitors").send({ name: "Chidi", phone: "0803 123 4567", service: "Friday" });
  assert.equal(ok.status, 201);
  const list = await request(app).get("/api/visitors").set("Authorization", `Bearer ${adminToken}`);
  assert.equal(list.body.visitors[0].service, "Friday");
  assert.equal((await request(app).get("/api/visitors").set("Authorization", `Bearer ${memberToken}`)).status, 403);

  assert.equal((await request(app).post("/api/newsletter").send({ email: "bad" })).status, 400);
  assert.equal((await request(app).post("/api/newsletter").send({ email: "a@b.co" })).status, 201);
  assert.equal((await request(app).post("/api/newsletter").send({ email: "A@b.co" })).status, 201);
  const subs = await request(app).get("/api/newsletter").set("Authorization", `Bearer ${adminToken}`);
  assert.equal(subs.body.subscribers.length, 1);
});

test("admin can see members and promote one", async () => {
  const list = await request(app).get("/api/users").set("Authorization", `Bearer ${adminToken}`);
  assert.equal(list.body.users.length, 2);
  const ada = list.body.users.find((u) => u.email === "ada@rge.test");
  const res = await request(app).patch(`/api/users/${ada.id}/role`).set("Authorization", `Bearer ${adminToken}`).send({ role: "admin" });
  assert.equal(res.body.user.role, "admin");
});
