import supertest from "supertest";
import { app } from "../src/application/app";
import { logger } from "../src/application/logging";
import { UserTest } from "./test-util";
import bcrypt from "bcrypt";
import { response } from "express";

describe("POST /api/users", () => {
  afterAll(async () => {
    await UserTest.delete();
  });
  it("should can rejects supertest", async () => {
    const response = await supertest(app)
      .post("/api/users")
      .send({ username: "", password: "", name: "" });

    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should can create new user", async () => {
    const response = await supertest(app)
      .post("/api/users")
      .send({ username: "ichwan", password: "ichwan", name: "ichwan" });
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.name).toBe("ichwan");
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should can Login", async () => {
    const result = await supertest(app).post("/api/users/login").send({
      username: "ichwan",
      password: "ichwan",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("ichwan");
    expect(result.body.data.token).toBeDefined();
  });

  it("should can reject login", async () => {
    const result = await supertest(app).post("/api/users/login").send({
      username: "salah",
      password: "ichwan",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("can get User", async () => {
    const result = await supertest(app)
      .get("/api/users/current")
      .set("X-API-TOKEN", "ichwan");

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("ichwan");
    expect(result.body.data.name).toBe("ichwan");
  });

  it("can reject get User if token is invalid", async () => {
    const result = await supertest(app)
      .get("/api/users/current")
      .set("X-API-TOKEN", "wrong");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Unauthorized");
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should can reject update user", async () => {
    const result = await supertest(app)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "ichwan")
      .send({ name: "", password: "" });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined;
  });

  it("should can reject update user if token is wrong", async () => {
    const result = await supertest(app)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "wrong")
      .send({ name: "doni", password: "prasetya" });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined;
  });

  it("should can update user by name", async () => {
    const result = await supertest(app)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "ichwan")
      .send({ name: "test" });

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("test");
  });

  it("should can update user by password", async () => {
    const result = await supertest(app)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "ichwan")
      .send({ password: "test" });

    const user = await UserTest.get(); // query ke DB

    expect(await bcrypt.compare("test", user.password)).toBe(true);
  });
});

describe("DELETE /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should can logout", async () => {
    const result = await supertest(app)
      .delete("/api/users/current")
      .set("X-API-TOKEN", "ichwan");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeUndefined();
  });

  it("should reject logout if token is wrong", async () => {
    const result = await supertest(app)
      .delete("/api/users/current")
      .set("X-API-TOKEN", "wrong");

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Unauthorized");
  });
});
