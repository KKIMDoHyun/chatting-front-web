import React from "react";

import { TUser } from "@typings/User";

type UserListProps = {
  users: TUser[];
  selectedUsers: Omit<TUser, "email">[];
  handleUserToggle: (user: TUser) => void;
};

export const UserList: React.FC<UserListProps> = ({
  users,
  selectedUsers,
  handleUserToggle,
}) => (
  <div className="w-full flex-grow overflow-y-auto">
    <div className="overflow-y-auto pr-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center space-x-3 rounded-md p-3 transition-colors hover:bg-gray-100"
        >
          <input
            type="checkbox"
            id={`user-${user.id}`}
            checked={selectedUsers.map((v) => v.id).includes(user.id)}
            onChange={() => handleUserToggle(user)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor={`user-${user.id}`}
            className="flex flex-grow cursor-pointer items-center"
          >
            <div className="h-7 w-7 overflow-hidden rounded-full bg-slate-400">
              <img
                src={user.profileImageUrl}
                alt={`${user.name}'s profile`}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {user.name}
            </span>
          </label>
        </div>
      ))}
    </div>
  </div>
);
