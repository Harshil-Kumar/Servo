"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link for client-side navigation
import PreviousRawMaterials from "../previous-raw-materials/page";
import {
  addClient,
  getClients,
  removeClient,
  tranferToPrevious,
  updateClient,
} from "@/app/actions/clientActions/presentRawMaterials";

interface RawMaterial {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  address: string;
  selected?: boolean; // Added 'selected' property for the checkbox
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

const presentRawMaterials = () => {
  //state for clients from mongo
  const [clientsMongo, setClientsMongo] = useState<RawMaterialMongo[]>([]);
  const [clientsSelect, setClientsSelect] = useState<RawMaterialMongo[]>([]);
  const [editBool, setEditBool] = useState<Boolean>(false);
  const [newClient, setNewClient] = useState<RawMaterialMongo>({
    _id: "",
    clientName: "",
    email: "",
    contactPerson: "",
    address: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSelectedTransfer = (id: string) => {
    setClientsSelect((prevClientsSelect) => {
      return prevClientsSelect.map((client) => {
        if (client._id === id) {
          return { ...client, selected: !client.selected };
        }

        return client;
      });
    });
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState<RawMaterialMongo[]>([]);
  const router = useRouter();

  //fetch clients from mongo
  const fetchClients = async () => {
    try {
      const clientsAll = await getClients();
      setClientsMongo(clientsAll);
      setClientsSelect(clientsAll);
      console.log(clientsAll);
    } catch (err) {
      throw new Error("Error fetching clients!");
    }
  };

  //add new client to mongo
  const addNewClient = async () => {
    try {
      const clientAdd = await addClient(
        newClient.clientName,
        newClient.contactPerson,
        newClient.email,
        newClient.address
      );

      if (clientAdd) {
        setIsFormOpen(false);
        setNewClient({ _id: "", clientName: "", contactPerson: "", email: "",  address: "" });
        fetchClients();
      }
    } catch (err) {
      throw new Error("Error!");
    }
  };

  //edit client form
  const editClientForm = (id: string) => {
    const selectedClient = clientsMongo.find((client) => client._id === id);
    if (selectedClient) {
      setNewClient(selectedClient);
      setIsFormOpen(true);
      setEditBool(true);
    }
  };

  //edit client mongo
  const editClientMongo = async () => {
    const updateClientBool = await updateClient(
      newClient._id,
      newClient.clientName,
      newClient.contactPerson,
      newClient.email,
      newClient.address
    );
    if (updateClientBool) {
      setIsFormOpen(false);
      setEditBool(false);
      setNewClient({ _id: "", clientName: "", email: "", contactPerson: "", address: "" });
      fetchClients();
    }
  };

  //delete client mongo
  const deleteClientMongo = async (_id: string) => {
    const res = await removeClient(_id);
    if (res) {
      fetchClients();
    }
  };

  //transfer client previous
  const transferPreviousMongo = async () => {
    const transferClients = clientsSelect
      .filter((client) => client.selected)
      .map((client) => client._id);
    const res = await tranferToPrevious(transferClients);

    if (res) {
      fetchClients();
    }
  };

  //to fetch clients from mongo
  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setNewClient({ _id: "", clientName: "", email: "", contactPerson: "", address: ""});
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <span className="font-bold text-4xl text-center pb-3">
        Present Raw Materials
      </span>
      <div className="flex items-center justify-between">
        {!isFormOpen && (
          <div className="mt-1">
            <label className="sr-only">Search:</label>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
              className="mt-1 p-2 border rounded-md inline-block w-60 mb-2"
            />
          </div>
        )}

        {isFormOpen && (
          <button
            className="mt-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 ml-auto"
            onClick={handleCloseForm}
          >
            &#10006; {/* Close (cross mark) character */}
          </button>
        )}

        {!isFormOpen && (
          <button
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={handleOpenForm}
          >
            Add Client
          </button>
        )}
      </div>

      {isFormOpen && (
        <>
          <div className="mt-4 mx-auto max-w-md">
            {" "}
            {/* Add mx-auto and max-w-md for centering and maximum width */}
            <label className="block text-sm font-medium text-black">
              Client Name:
            </label>
            <input
              type="text"
              name="clientName"
              value={newClient.clientName}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-96"
            />
          </div>

          <div className="mt-4 mx-auto max-w-md">
            <label className="block text-sm font-medium text-black">
              Contact Person:
            </label>
            <input
              type="text"
              name="contactPerson"
              value={newClient.contactPerson}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-96"
            />
          </div>

          <div className="mt- mx-auto max-w-md">
            <label className="block text-sm font-medium text-black">
              Email:
            </label>
            <input
              type="text"
              name="email"
              value={newClient.email}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-96"
            />
          </div>

          <div className="mt- mx-auto max-w-md">
            <label className="block text-sm font-medium text-black">
              Address:
            </label>
            <input
              type="text"
              name="address"
              value={newClient.address}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-96"
            />
          </div>

          {!editBool && (
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mx-auto max-w-md mb-5"
              onClick={addNewClient}
            >
              Add Client
            </button>
          )}

          {editBool && (
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mx-auto max-w-md mb-5"
              onClick={editClientMongo}
            >
              Update Details
            </button>
          )}
        </>
      )}

      <table className="w-full mt-4">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200">Row Number</th>
            <th className="py-2 px-4 bg-gray-200">Client Name</th>
            <th className="py-2 px-4 bg-gray-200">Contact Person</th>
            <th className="py-2 px-4 bg-gray-200">Email</th>
            <th className="py-2 px-4 bg-gray-200">Address</th>
            <th className="py-2 px-4 bg-gray-200">Actions</th>
            <th className="py-2 px-4 bg-gray-200">Transfer</th>
          </tr>
        </thead>
        <tbody>
          {clientsMongo.map((client, index) => (
            <tr key={index}>
              <td className="py-2 pl-16">{index + 1}</td>
              <td className="py-2 pl-16">{client.clientName}</td>
              <td className="py-2 pl-16">{client.contactPerson}</td>
              <td className="py-2 pl-16">{client.email}</td>
              <td className="py-2 pl-16">{client.address}</td>
              <td className="py-2 pl-16">
                <button
                  className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 mr-2"
                  onClick={() => editClientForm(client._id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                  onClick={() => deleteClientMongo(client._id)}
                >
                  Delete
                </button>
              </td>
              <td className="py-2 pl-16">
                <input
                  type="checkbox"
                  checked={clientsSelect[index].selected}
                  onChange={() => handleSelectedTransfer(client._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="mt-6 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ml-auto "
        onClick={transferPreviousMongo}
      >
        Transfer to Previous Raw Materials
      </button>
    </>
  );
};

export default presentRawMaterials;
