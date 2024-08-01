/* eslint-disable @next/next/no-img-element */
import React from "react";

export const ListDetails = () => {
  const admins = [
    {
      id: 1,
      name: "Admin 1",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 2,
      name: "Admin 2",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 3,
      name: "Admin 3",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 4,
      name: "Admin 4",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 5,
      name: "Admin 5",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    },
  ];

  return (
    <>
      <div>
        <p className="text-2xl font-semibold">List Header Here</p>
        <div className="flex items-center space-x-2">
          By{" "}
          <img
            className="ml-2 h-4 w-4 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHVzZXJ8ZW58MHx8MHx8fDA%3D"
          />
          <span>Account Id</span>
          <span className="text-gray-500">Created 3d ago</span>
        </div>
        <div className="grid grid-cols-8">
          <div className="col-span-5 pr-3">
            <img
              src="https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZXZlbnR8ZW58MHx8MHx8fDA%3D"
              alt="image"
              className="mt-3 h-[180px] w-full rounded-md object-cover"
            />
          </div>
          <div className="col-span-3 p-4 pt-0">
            <p className="mb-4 text-lg">
              Lorem ipsum dolor sit amet consectetur Duis fermentum turpis vitae
              mi augue erat et lectus Auctor a diam amet sagittis dui at
              accumsan adipiscing Suspendisse sapien ante dolor id leo Placerat
              convallis enim est diam ipsum tempor lorem ipsum consectetur
            </p>
            <div className="mb-4 flex items-center">
              <span className="mr-4 font-semibold text-gray-700">Admins</span>
              <div className="flex -space-x-2">
                {admins.map((admin, index) => (
                  <img
                    key={admin.id}
                    className="h-10 w-10 rounded-full border-2 border-white"
                    src={admin.image}
                    alt={admin.name}
                  />
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-red-500 text-sm font-semibold text-white">
                  5+
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
