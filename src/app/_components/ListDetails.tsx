/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { List } from "@/common/contracts/potlock/interfaces/lists.interfaces";
import { getList } from "@/common/contracts/potlock/lists";

export const ListDetails = () => {
  const { id } = useParams();
  const [listDetails, setListDetails] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const response = await getList({ list_id: parseInt(id as any) as any });
        console.log({ response });
        setListDetails(response);
      } catch (error) {
        console.error("Error fetching list details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!listDetails) {
    return <p>No list details available.</p>;
  }

  const admins = listDetails.admins.map((admin, index) => ({
    id: index,
    name: admin,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D", // Placeholder image
  }));

  return (
    <>
      <div>
        <p className="text-2xl font-semibold">{listDetails.name}</p>
        <div className="flex items-center space-x-2">
          By{" "}
          <img
            className="ml-2 h-4 w-4 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHVzZXJ8ZW58MHx8MHx8fDA%3D"
            alt="Owner"
          />
          <span>{listDetails.owner}</span>
          <span className="text-gray-500">
            Created {new Date(listDetails.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="grid-cols-8 md:grid">
          <div className="col-span-5 pr-3">
            <img
              src={
                listDetails.cover_image_url || "https://via.placeholder.com/800"
              } // Placeholder image if cover_image_url is null
              alt="cover"
              className="mt-3 h-[180px] w-full rounded-md object-cover"
            />
          </div>
          <div className="col-span-3 p-4 pt-0">
            <p className="mb-4 text-lg">{listDetails.description}</p>
            <div className="mb-4 flex items-center">
              <span className="mr-4 font-semibold text-gray-700">Admins</span>
              <div className="flex -space-x-2">
                {admins.map((admin) => (
                  <img
                    key={admin.id}
                    className="h-10 w-10 rounded-full border-2 border-white"
                    src={admin.image}
                    alt={admin.name}
                  />
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-red-500 text-sm font-semibold text-white">
                  {listDetails.admins.length}+
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600">
                Donate to list
              </button>
              <button className="rounded-md border bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-100">
                Apply to list
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
