import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
  toContactResponse,
} from "../model/contact-model";
import { Validation } from "../validation/validation";
import { ContactValidation } from "../validation/contact-validation";
import { prismaClient } from "../application/database";
import { Contact, User } from "@prisma/client";
import { ResponseError } from "../error/error-response";
import { Pageable } from "../model/page";

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    const createRequest = Validation.validate(
      ContactValidation.CREATE,
      request
    );

    const record = {
      ...createRequest,
      ...{ username: user.username },
    };

    const contact = await prismaClient.contact.create({
      data: record,
    });

    return toContactResponse(contact);
  }

  static async contactMustExist(
    username: string,
    contactId: number
  ): Promise<Contact> {
    const findContact = await prismaClient.contact.findFirst({
      where: {
        id: contactId,
        username: username,
      },
    });

    if (!findContact) {
      throw new ResponseError(404, "Contact Not Found");
    }

    return findContact;
  }

  static async get(user: User, id: number): Promise<ContactResponse> {
    const findContact = await this.contactMustExist(user.username, id);

    return toContactResponse(findContact);
  }

  static async update(
    user: User,
    request: UpdateContactRequest
  ): Promise<ContactResponse> {
    const updateValidation = Validation.validate(
      ContactValidation.UPDATE,
      request
    );

    await this.contactMustExist(user.username, updateValidation.id);

    const contact = await prismaClient.contact.update({
      where: {
        id: updateValidation.id,
        username: user.username,
      },
      data: updateValidation,
    });

    return toContactResponse(contact);
  }

  static async remove(user: User, id: number): Promise<ContactResponse> {
    await this.contactMustExist(user.username, id);

    const result = await prismaClient.contact.delete({
      where: {
        id: id,
        username: user.username,
      },
    });

    return toContactResponse(result);
  }

  static async search(
    user: User,
    request: SearchContactRequest
  ): Promise<Pageable<ContactResponse>> {
    const searchRequest = Validation.validate(
      ContactValidation.SEARCH,
      request
    );
    const skip = (searchRequest.page - 1) * searchRequest.size;

    const filters = [];

    //Must Name Exist
    if (searchRequest.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: searchRequest.name,
            },
          },
          {
            last_name: {
              contains: searchRequest.name,
            },
          },
        ],
      });
    }

    // Must Email Exist
    if (searchRequest.email) {
      filters.push({
        email: {
          contains: searchRequest.email,
        },
      });
    }

    // Must Phone Exist
    if (searchRequest.phone) {
      filters.push({
        phone: {
          contains: searchRequest.phone,
        },
      });
    }

    const contacts = await prismaClient.contact.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await prismaClient.contact.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    return {
      data: contacts.map((contact) => toContactResponse(contact)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(total / searchRequest.size),
        size: searchRequest.size,
      },
    };
  }
}
