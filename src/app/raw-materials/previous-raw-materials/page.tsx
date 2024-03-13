// previous-clients/page.tsx

"use client";
import { getClientsPrevious } from "@/app/actions/clientActions/presentRawMaterials";
import React, { useEffect, useState } from "react";

interface RawMaterial {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  address: string;
}

//clients from mongodb
interface RawMaterialMongo {
  clientName: string;
  contactPerson: string;
  email: string;
  address: string;
  selected?: boolean;
  _id: string;
}

interface PreviousRawMaterialsProps {
  clients?: RawMaterial[]; // Make clients prop optional
}

const PreviousRawMaterials: React.FC<PreviousRawMaterialsProps> = ({ clients = [] }) => {
  const [clientsMongo, setClientsMongo] = useState<RawMaterialMongo[]>([]);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<RawMaterialMongo[]>([]);

  const fetchClients = async () => {
    try {
      const clientsAll = await getClientsPrevious();
      setClientsMongo(clientsAll);
      setOptions(clientsAll);
    } catch (err) {
      throw new Error("Error fetching clients!");
    }
  };

  useEffect(() => {
    fetchClients();
  },[]);

  const Searchhandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    const filterdata = clientsMongo.filter((client) =>
      client.clientName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.log(filterdata);
    setOptions(filterdata);
  };

  return (
    <>
      <span className="font-bold text-4xl text-center pb-3">
        Previous Raw Materials
      </span>

      <div className="mt-1">
        <label className="sr-only">Search:</label>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={Searchhandler}
          className="mt-1 p-2 border rounded-md inline-block w-60 mb-2"
        />
      </div>

      <table className="w-full mt-4">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200">Row Number</th>
            <th className="py-2 px-4 bg-gray-200">Client Name</th>
            <th className="py-2 px-4 bg-gray-200">Contact Person</th>
            <th className="py-2 px-4 bg-gray-200">Email</th>
            <th className="py-2 px-4 bg-gray-200">Address</th>
          </tr>
        </thead>
        <tbody>
          {options?.map((client, index) => (
            <tr key={index}>
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{client.clientName}</td>
              <td className="py-2 px-4">{client.contactPerson}</td>
              <td className="py-2 px-4">{client.email}</td>
              <td className="py-2 px-4">{client.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default PreviousRawMaterials;