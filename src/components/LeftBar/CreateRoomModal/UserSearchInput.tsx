import React from "react";

import { Search } from "lucide-react";

type UserSearchInputProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export const UserSearchInput: React.FC<UserSearchInputProps> = ({
  searchTerm,
  setSearchTerm,
}) => (
  <div className="relative mb-6 w-full">
    <input
      type="text"
      placeholder="사용자 검색..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
  </div>
);
