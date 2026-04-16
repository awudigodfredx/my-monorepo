const request = require("supertest");
const app = require("../index");

jest.mock("../analytics", () => ({
  emitEvent: jest.fn(),
}));

jest.mock("../db", () => ({
  db: {
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockResolvedValue({}),
    }),
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        groupBy: jest.fn().mockResolvedValue([
          { type: "hero_view", count: 10 }
        ])
      }),
    }),
  },
}));

describe("Analytics API", () => {
  const validEvent = {
    type: "hero_view",
    url: "http://localhost:5173/",
    sessionId: "abc123",
  };

  describe("POST /api/v1/analytics/events", () => {
    it("returns 201 and success:true for a valid event", async () => {
      const res = await request(app).post("/api/v1/analytics/events").send(validEvent);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ success: true });
    });
  });

  describe("POST /api/v1/analytics/events/batch", () => {
    it("returns 201 for a valid batch", async () => {
      const res = await request(app)
        .post("/api/v1/analytics/events/batch")
        .send({ events: [validEvent, validEvent] });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
    });

    it("returns 400 for empty batch", async () => {
      const res = await request(app)
        .post("/api/v1/analytics/events/batch")
        .send({ events: [] });
      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /api/v1/analytics/summary", () => {
    it("returns 401 when no auth provided", async () => {
      const res = await request(app).get("/api/v1/analytics/summary");
      expect(res.statusCode).toBe(401);
    });

    it("returns 200 and data when valid auth provided", async () => {
      const password = process.env.VITE_ADMIN_PASSWORD || "admin123";
      const auth = Buffer.from(`admin:${password}`).toString("base64");
      
      const res = await request(app)
        .get("/api/v1/analytics/summary")
        .set("Authorization", `Basic ${auth}`);
        
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("hero_view", 10);
    });
  });
});
