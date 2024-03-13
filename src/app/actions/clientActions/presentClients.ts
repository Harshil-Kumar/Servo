"use server";

import Client from "@/components/models/Client";
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
    const clientNew = new Client({
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
    const clientsAll = await Client.find({ role: "present" });
    return clientsAll;
  } catch (err: any) {
    console.log("err");
    return [];
  }
};

export const getClientsPrevious = async () => {
  await dbConnect();

  try {
    const clientsAll = await Client.find({ role: "previous" });
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
    await Client.findByIdAndUpdate(_id, { clientName, contactPerson, email, address });
    return true;
  } catch (err: any) {
    return false;
  }
};

export const removeClient = async (_id: string) => {
  await dbConnect();

  try {
    await Client.findByIdAndDelete(_id);
    return true;
  } catch (err: any) {
    return false;
  }
};

export const tranferToPrevious = async (clients: string[]) => {
  try {
    clients.forEach(async (id) => {
      const update = await Client.findByIdAndUpdate(
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