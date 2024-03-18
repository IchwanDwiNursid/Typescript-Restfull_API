import supertest from "supertest";
import { ContactTest, UserTest } from "./test-util";
import { AddressTest } from "./test-util";
import { app } from "../src/application/app";
import { logger } from "../src/application/logging";

describe("POST /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteall();
    await ContactTest.deleteall();
    await UserTest.delete();
  });

  it("Should Can Create Address", async () => {
    const contact = await ContactTest.get();
    const result = await supertest(app)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set("X-API-TOKEN", "ichwan")
      .send({
        street: "Jl. Raya",
        city: "Jakarta",
        province: "DKI Jakarta",
        country: "Indonesia",
        postal_code: "12345",
      });

    logger.debug(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.street).toBe("Jl. Raya");
    expect(result.body.data.city).toBe("Jakarta");
    expect(result.body.data.province).toBe("DKI Jakarta");
    expect(result.body.data.country).toBe("Indonesia");
    expect(result.body.data.postal_code).toBe("12345");
  });

  it("Should Can't Create Address", async () => {
    const contact = await ContactTest.get();
    const result = await supertest(app)
      .post(`/api/contacts/${contact.id + 1}/addresses`)
      .set("X-API-TOKEN", "ichwan")
      .send({
        street: "Jl. Raya",
        city: "Jakarta",
        province: "DKI Jakarta",
        country: "Indonesia",
        postal_code: "12345",
      });

    logger.debug(result.body);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteall();
    await ContactTest.deleteall();
    await UserTest.delete();
  });

  it("should can get address", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const result = await supertest(app)
      .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("X-API-TOKEN", "ichwan");

    logger.debug(result.body);
    expect(result.status).toBe(200);
  });

  it("should can't get address", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const result = await supertest(app)
      .get(`/api/contacts/${contact.id + 1}/addresses/${address.id + 1}`)
      .set("X-API-TOKEN", "ichwan");

    logger.debug(result.body);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteall();
    await ContactTest.deleteall();
    await UserTest.delete();
  });

  it("should be able can update products", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const result = await supertest(app)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("X-API-TOKEN", "ichwan")
      .send({
        street: "Jl.jend,Sudirman",
        city: "Jakarta",
        province: "DKI Jakarta",
        country: "Indonesia",
        postal_code: "12345",
      });

    logger.debug(result.body);

    expect(result.status).toBe(200);
  });

  it("should not be able can update products with invalid data", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const result = await supertest(app)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("X-API-TOKEN", "ichwan")
      .send({
        street: "Jl.jend,Sudirman",
        city: "Jakarta",
        province: "DKI Jakarta",
        country: "",
        postal_code: "",
      });

    logger.debug(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should not able can update products because address not found", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const result = await supertest(app)
      .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set("X-API-TOKEN", "ichwan")
      .send({
        street: "Jl.jend,Sudirman",
        city: "Jakarta",
        province: "DKI Jakarta",
        country: "Indonesia",
        postal_code: "12345",
      });

    logger.debug(result.body);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteall();
    await ContactTest.deleteall();
    await UserTest.delete();
  });

  it("should be able to delete products", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const result = await supertest(app)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("X-API-TOKEN", "ichwan");

    logger.debug(result.body);

    expect(result.status).toBe(200);
  });

  it("should not able to delete products", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const result = await supertest(app)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set("X-API-TOKEN", "ichwan");

    logger.debug(result.body);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteall();
    await ContactTest.deleteall();
    await UserTest.delete();
  });

  it("should be able to list address", async () => {
    const contact = await ContactTest.get();
    const result = await supertest(app)
      .get(`/api/contacts/${contact.id}/addresses`)
      .set("X-API-TOKEN", "ichwan");

    logger.debug(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
  });
});
