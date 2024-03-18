import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";
import { Address, Contact, User } from "@prisma/client";
import { ResponseError } from "../src/error/error-response";
import { add } from "winston";

export class UserTest {
  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        username: "ichwan",
      },
    });
  }

  static async create() {
    await prismaClient.user.create({
      data: {
        username: "ichwan",
        name: "ichwan",
        password: await bcrypt.hash("ichwan", 10),
        token: "ichwan",
      },
    });
  }

  static async get(): Promise<User> {
    const user = await prismaClient.user.findFirst({
      where: {
        username: "ichwan",
      },
    });

    if (!user) {
      throw new Error("User Not Found");
    }

    return user;
  }
}

export class ContactTest {
  static async deleteall() {
    await prismaClient.contact.deleteMany({
      where: {
        username: "ichwan",
      },
    });
  }

  static async create() {
    await prismaClient.contact.create({
      data: {
        username: "ichwan",
        first_name: "ichwan",
        last_name: "ichwan",
        email: "ichwan@gmail.com",
        phone: "08123456789",
      },
    });
  }

  static async get(): Promise<Contact> {
    const contact = await prismaClient.contact.findFirst({
      where: {
        username: "ichwan",
      },
    });

    if (!contact) {
      throw new ResponseError(404, "Contact is Not Found");
    }

    return contact;
  }
}

export class AddressTest {
  static async deleteall() {
    await prismaClient.address.deleteMany({
      where: {
        country: "indonesia",
      },
    });
  }
  static async create() {
    const contact = await ContactTest.get();
    await prismaClient.address.create({
      data: {
        street: "Jl. Raya",
        city: "Jakarta",
        province: "DKI Jakarta",
        country: "Indonesia",
        postal_code: "12345",
        contact_id: contact.id,
      },
    });
  }

  static async get(): Promise<Address> {
    const address = await prismaClient.address.findFirst({
      where: {
        country: "Indonesia",
      },
    });

    if (!address) {
      throw new ResponseError(404, "Address Not Found");
    }

    return address;
  }
}
