"use server";

import RawMaterial from "@/components/models/RawMaterial";
import dbConnect from "@/components/utils/dbConnect";
import { NextResponse } from "next/server";

export const addClient = async (
  clientName: string,
  contactPerson: string,
  email: string,
  address: string
) => {
  await dbConnect();

  try {
    const clientNew = new RawMaterial({
      clientName,
      contactPerson,
      email,
      address,
    });

    await clientNew.save();
    return true;
  } catch (err: any) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};

export const getClients = async () => {
  await dbConnect();

  try {
    const clientsAll = await RawMaterial.find({ role: "present" });
    return clientsAll;
  } catch (err: any) {
    console.log("err");
    return [];
  }
};

export const getClientsPrevious = async () => {
  await dbConnect();

  try {
    const clientsAll = await RawMaterial.find({ role: "previous" });
    return clientsAll;
  } catch (err: any) {
    return [];
  }
};

export const updateClient = async (
  _id: string,
  clientName: string,
  contactPerson: string,
  email: string,
  address: string
) => {
  await dbConnect();

  try {
    await RawMaterial.findByIdAndUpdate(_id, { clientName, contactPerson, email, address });
    return true;
  } catch (err: any) {
    return false;
  }
};

export const removeClient = async (_id: string) => {
  await dbConnect();

  try {
    await RawMaterial.findByIdAndDelete(_id);
    return true;
  } catch (err: any) {
    return false;
  }
};

export const tranferToPrevious = async (clients: string[]) => {
  try {
    clients.forEach(async (id) => {
      const update = await RawMaterial.findByIdAndUpdate(
        id,
        {
          $set: { role: "previous" },
        },
        { new: true }
      );

      if (!update) {
        return false;
      }
    });
    return true;
  } catch (err: any) {
    return false;
  }
};