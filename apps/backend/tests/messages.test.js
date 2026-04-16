const request = require("supertest");
const app = require("../index");
const { emitEvent } = require("../analytics");

// Mock the analytics module
jest.mock("../analytics", () => ({
  emitEvent: jest.fn(),
}));

test("true is true", () => {
  expect(true).toBe(true);
});

test("health endpoint returns ok", async () => {
  const res = await request(app).get("/api/v1/health");
  expect(res.statusCode).toBe(200);
});

test("GET /api/v1/health returns 200 and emits event", async () => {
  const res = await request(app).get("/api/v1/health");

  // ✅ Assert response
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe("ok");

  // ✅ Assert event emission
  expect(emitEvent).toHaveBeenCalledWith("request_success", expect.any(Object));
});
