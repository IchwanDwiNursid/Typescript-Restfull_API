import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import {
  CreateRequestAddress,
  GetAddressRequest,
  UpdateRequestAddress,
} from "../model/address";
import { AddressService } from "../service/address-service";

export class AddressController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateRequestAddress = req.body as CreateRequestAddress;
      request.contact_id = Number(req.params.contactId);
      const result = await AddressService.create(req.user!, request);
      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: GetAddressRequest = {
        id: Number(req.params.addressId),
        contact_id: Number(req.params.contactId),
      };
      request.contact_id = Number(req.params.contactId);
      const result = await AddressService.get(req.user!, request);
      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateRequestAddress = req.body as UpdateRequestAddress;
      request.id = Number(req.params.addressId);
      request.contact_id = Number(req.params.contactId);
      const result = await AddressService.update(req.user!, request);
      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: GetAddressRequest = {
        id: Number(req.params.addressId),
        contact_id: Number(req.params.contactId),
      };
      const result = await AddressService.delete(req.user!, request);
      res.status(200).json({
        data: "OK",
      });
    } catch (e) {
      next(e);
    }
  }

  static async list(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId: number = Number(req.params.contactId);
      const result = await AddressService.list(req.user!, contactId);
      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }
}
