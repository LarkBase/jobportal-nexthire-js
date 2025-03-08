const request = require("supertest");
const jwt = require("jsonwebtoken");
const prisma = require("../../src/config/db");
const app = require("../../src/config/server");
const ENV = require("../../src/config/env");

describe("Auth API Tests", () => {
  let testUsers = [];
  let invalidToken = "invalid.token.string";
  let validUser, validAccessToken, validRefreshToken;

  beforeAll(async () => {
    // ✅ Create a test user and store reference
    validUser = await prisma.user.create({
      data: {
        email: "testuser@nexthire.tech",
        password: "$2b$10$lzJEnfVClKQpiixbaqxpcOGxpn/moZufVowpqdr1lUCDIO7kGTIiC",
      },
    });
    testUsers.push(validUser.id); // Track user ID for cleanup

    // ✅ Generate valid JWT tokens
    validAccessToken = jwt.sign({ userId: validUser.id, email: validUser.email }, ENV.JWT_SECRET, {
      expiresIn: "15m",
    });

    validRefreshToken = jwt.sign({ userId: validUser.id, email: validUser.email }, ENV.JWT_SECRET, {
      expiresIn: "30d",
    });

    // ✅ Store refresh token in DB and track it
    await prisma.refreshToken.create({
      data: {
        token: validRefreshToken,
        userId: validUser.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
      },
    });
  });

  afterAll(async () => {
    // ✅ Delete only test users created in this test suite
    await prisma.user.deleteMany({ where: { id: { in: testUsers } } });
    await prisma.refreshToken.deleteMany({ where: { userId: { in: testUsers } } });
  });

  it("should return 400 for missing email or password", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 for incorrect credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "wronguser@nexthire.tech",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 and tokens for successful login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@nexthire.tech",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  it("should generate a new access token using refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", `refreshToken=${validRefreshToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should return 401 when using an invalid refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", `refreshToken=invalidtoken`);

    expect(res.statusCode).toBe(401);
  });

  it("should log out and clear cookies", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", [`refreshToken=${validRefreshToken}`]) // ✅ Send refresh token
      .set("Authorization", `Bearer ${validAccessToken}`);  // ✅ Send access token
  
    console.log("Logout Test Response:", res.body);  // ✅ Debugging output
  
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged out from all devices.");
  });
  
  

  it("should prevent SQL injection attacks", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "' OR '1'='1'; --",
      password: "password123",
    });
  
    console.log("SQL Injection Test Response:", res.body);  // ✅ Debugging output
  
    expect(res.statusCode).toBe(401);
  });

  it("should return 401 if logout is attempted without a token", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("should return 401 if logout is attempted with an invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", `refreshToken=${invalidToken}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });
  

  it("should prevent brute force login attempts (rate limit)", async () => {
    for (let i = 0; i < 10; i++) {
      await request(app).post("/api/auth/login").send({
        email: "wrong@user.com",
        password: "wrongpassword",
      });
    }

    const res = await request(app).post("/api/auth/login").send({
      email: "wrong@user.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(429);
    expect(res.body.message).toContain("Too many failed login attempts");
  });

  it("should return 500 for an unexpected server error", async () => {
    const res = await request(app).get("/trigger-server-error"); // Ensure this exists in your controller for testing

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      success: false,
      message: "Unexpected Server Error",
    });
  });

  it("should return the correct status code and message for known errors", async () => {
    const res = await request(app).get("/bad-request-test"); // Simulate known error

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: "Test Bad Request Error",
    });
  });
  
});
