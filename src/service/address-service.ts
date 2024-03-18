import { Address, User } from "@prisma/client";
import {
  CreateRequestAddress,
  GetAddressRequest,
  ResponseAddress,
  UpdateRequestAddress,
  toAddressResponse,
} from "../model/address";
import { Validation } from "../validation/validation";
import { AddressValidation } from "../validation/address-validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/error-response";

export class AddressService {
  static async create(
    user: User,
    request: CreateRequestAddress
  ): Promise<ResponseAddress> {
    const createRequest = Validation.validate(
      AddressValidation.CREATE,
      request
    );
    await ContactService.contactMustExist(
      user.username,
      createRequest.contact_id
    );

    const address = await prismaClient.address.create({
      data: createRequest,
    });

    return toAddressResponse(address);
  }

  static async addresMustExist(
    id: number,
    contact_id: number
  ): Promise<Address> {
    const address = await prismaClient.address.findFirst({
      where: {
        id: id,
        contact_id: contact_id,
      },
    });

    if (!address) {
      throw new ResponseError(404, "Address Not Found");
    }

    return address;
  }

  static async get(
    user: User,
    request: GetAddressRequest
  ): Promise<ResponseAddress> {
    const getRequest = Validation.validate(AddressValidation.GET, request);
    await ContactService.contactMustExist(user.username, request.contact_id);

    const address = await this.addresMustExist(
      getRequest.id,
      getRequest.contact_id
    );

    return toAddressResponse(address);
  }

  static async update(
    user: User,
    request: UpdateRequestAddress
  ): Promise<ResponseAddress> {
    const contact = await ContactService.contactMustExist(
      user.username,
      request.contact_id
    );
    const updateRequest = Validation.validate(
      AddressValidation.UPDATE,
      request
    );

    await this.addresMustExist(updateRequest.id, contact.id);

    const updateAddress = await prismaClient.address.update({
      where: {
        id: updateRequest.id,
      },
      data: updateRequest,
    });

    return toAddressResponse(updateAddress);
  }

  static async delete(
    user: User,
    request: GetAddressRequest
  ): Promise<ResponseAddress> {
    await ContactService.contactMustExist(user.username, request.contact_id);
    await this.addresMustExist(request.id, request.contact_id);

    const result = await prismaClient.address.delete({
      where: {
        id: request.id,
      },
    });

    return toAddressResponse(result);
  }

  static async list(
    user: User,
    contact_id: number
  ): Promise<ResponseAddress[]> {
    await ContactService.contactMustExist(user.username, contact_id);
    const addresses = await prismaClient.address.findMany({
      where: {
        contact_id: contact_id,
      },
    });
    return addresses.map((address) => toAddressResponse(address));
  }
}
