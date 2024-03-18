import { UserTest } from "./test-util";
import supertest from "supertest";
import { app } from "../src/application/app";
import { ContactTest } from "./test-util";
import { logger } from "../src/application/logging";

describe("POST /api/contacts/", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteall();
    await UserTest.delete();
  });

  it("Should can create contacts", async () => {
    const result = await supertest(app)
      .post("/api/contacts")
      .set("X-API-TOKEN", "ichwan")
      .send({
        phone: "08123456789",
        first_name: "ichwan",
        last_name: "ichwan",
        email: "ichwan@gmail.com",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.phone).toBe("08123456789");
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("ichwan");
    expect(result.body.data.last_name).toBe("ichwan");
    expect(result.body.data.email).toBe("ichwan@gmail.com");
  });

  it("Should reject create contacts", async () => {
    const result = await supertest(app)
      .post("/api/contacts")
      .set("X-API-TOKEN", "ichwan")
      .send({
        phone: "08123456789",
        first_name: "",
        last_name: "ichwan",
        email: "ichwan@gmail.com",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteall();
    await UserTest.delete();
  });

  it("should be able get contact", async () => {
    const contact = await ContactTest.get();
    const result = await supertest(app)
      .get(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "ichwan");

    logger.debug(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(contact.id);
    expect(result.body.data.first_name).toBe(contact.first_name);
    expect(result.body.data.last_name).toBe(contact.last_name);
    expect(result.body.data.email).toBe(contact.email);
    expect(result.body.data.phone).toBe(contact.phone);
  });

  it("should not able get contact", async () => {
    const contact = await ContactTest.get();
    const result = await supertest(app)
      .get(`/api/contacts/${contact.id + 1}`)
      .set("X-API-TOKEN", "ichwan");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteall();
    await UserTest.delete();
  });

  it("should can update contact", async () => {
    const contact = await ContactTest.get();
    const result = await supertest(app)
      .put(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "ichwan")
      .send({
        phone: "08123456789",
        first_name: "ichwan",
        last_name: "ichwan",
        email: "ichwan@gmail.com",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.phone).toBe("08123456789");
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("ichwan");
    expect(result.body.data.last_name).toBe("ichwan");
    expect(result.body.data.email).toBe("ichwan@gmail.com");
  });

  it("should can't update contact", async () => {
    const contact = await ContactTest.get();
    const result = await supertest(app)
      .put(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "ichwan")
      .send({
        phone: "0798097099999000000000090990174240972",
        first_name: "",
        last_name: "",
        email: "ichwa",
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteall();
    await UserTest.delete();
  });

  it("should be able delete contact", async () => {
    const contact = await ContactTest.get();
    const result = await supertest(app)
      .delete(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "ichwan");

    logger.debug(result.body);
    expect(result.status).toBe(200);
  });

  it("should be able delete contact", async () => {
    const contact = await ContactTest.get();
    const result = await supertest(app)
      .delete(`/api/contacts/${contact.id + 1}`)
      .set("X-API-TOKEN", "ichwan");

    logger.debug(result.body);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteall();
    await UserTest.delete();
  });

  it("Should can search contact", async () => {
    const result = await supertest(app)
      .get("/api/contacts")
      .set("X-API-TOKEN", "ichwan");

    logger.debug(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1),
      expect(result.body.paging.current_page).toBe(1);
    expect(result.body.paging.size).toBe(10);
    expect(result.body.paging.total_page).toBe(1);
  });

  it("should can search with query", async () => {
    const result = await supertest(app)
      .get("/api/contacts")
      .set("X-API-TOKEN", "ichwan")
      .query({
        name: "ich",
      });

    logger.debug(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1),
      expect(result.body.paging.current_page).toBe(1);
    expect(result.body.paging.size).toBe(10);
    expect(result.body.paging.total_page).toBe(1);
  });
});
