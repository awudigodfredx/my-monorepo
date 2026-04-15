const request = require("supertest");
const app = require("../src/index");

jest.mock("../analytics", () => ({
  emitEvent: jest.fn(),
}));

jest.mock("../db", () => ({
  db: {
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockResolvedValue({}),
    }),
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockResolvedValue([]),
    }),
  },
}));

describe("POST /api/v1/analytics/events", () => {
  const validBody = {
    type: "hero_view",
    url: "http://localhost:5173/",
    sessionId: "abc123",
  };

  it("returns 201 and success:true for a valid event", async () => {
    const res = await request(app).post("/api/v1/analytics/events").send(validBody);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ success: true });
  });

  it("persists the event with correct fields", async () => {
    const { db } = require("../db");
    await request(app).post("/api/v1/analytics/events").send(validBody);
    expect(db.insert).toHaveBeenCalled();
    const valuesFn = db.insert.mock.results[0].value.values;
    expect(valuesFn).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "hero_view",
        url: "http://localhost:5173/",
        sessionId: "abc123",
        payload: null,
      }),
    );
  });

  it("serialises optional payload to JSON string", async () => {
    const { db } = require("../db");
    db.insert.mockClear();
    const body = { ...validBody, payload: { page_name: "home" } };
    await request(app).post("/api/v1/analytics/events").send(body);
    const valuesFn = db.insert.mock.results[0].value.values;
    expect(valuesFn).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: JSON.stringify({ page_name: "home" }),
      }),
    );
  });

  it("returns 400 when type is missing", async () => {
    const { type: _type, ...body } = validBody;
    const res = await request(app).post("/api/v1/analytics/events").send(body);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/required/);
  });

  it("returns 400 when url is missing", async () => {
    const { url: _url, ...body } = validBody;
    const res = await request(app).post("/api/v1/analytics/events").send(body);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/required/);
  });

  it("returns 400 when sessionId is missing", async () => {
    const { sessionId: _sessionId, ...body } = validBody;
    const res = await request(app).post("/api/v1/analytics/events").send(body);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/required/);
  });

  it("returns 500 when the database throws", async () => {
    const { db } = require("../db");
    db.insert.mockReturnValueOnce({
      values: jest.fn().mockRejectedValueOnce(new Error("DB error")),
    });
    const res = await request(app).post("/api/v1/analytics/events").send(validBody);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Failed to save event");
  });
});
