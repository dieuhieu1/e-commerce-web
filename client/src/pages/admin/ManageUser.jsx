import React, { useCallback, useEffect, useState } from "react";
import { apiGetUsers } from "@/apis/user";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import Button from "@/components/Common/Button";
import InputField from "@/components/Input/InputField";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "@/components/Pagination/Pagination";
import { useSearchParams } from "react-router-dom";

const ManageUser = () => {
  const [data, setData] = useState([]);
  const [queries, setQueries] = useState({ q: "" });
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();

  const queriesDebounce = useDebounce(queries.q, 800);

  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const response = await apiGetUsers({ ...params, limit: 5 });
      setData(response || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.q = queriesDebounce;
    fetchUsers(queries);
  }, [params, queriesDebounce]);

  const setValue = useCallback(
    (value) => setQueries((prev) => ({ ...prev, q: value })),
    []
  );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-8">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow-md flex justify-between items-center text-2xl font-semibold px-6 py-4 rounded-xl border border-gray-200">
        <span className="text-gray-800">👥 Manage Users</span>
        <Button
          onClick={() => fetchUsers()}
          variant="outline"
          className="flex items-center gap-2 font-medium hover:bg-gray-100 transition-all duration-200"
          width="w-[150px]"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          Refresh
        </Button>
      </header>

      {/* Search bar */}
      <div className="flex justify-end mt-6 mb-4">
        <InputField
          name="q"
          value={queries.q}
          setValue={setValue}
          label="Search by name"
          width="w-[350px]"
          className="shadow-sm"
        />
      </div>

      {/* Table container */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">#</th>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-left">Address</th>
              <th className="px-6 py-4 text-center">Verified</th>
              <th className="px-6 py-4 text-center">Role</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.users?.length > 0 ? (
              data.users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b border-gray-100 hover:bg-blue-50 transition-all duration-200`}
                >
                  <td className="px-6 py-4 font-medium text-gray-600">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <Avatar className="w-9 h-9 ring-2 ring-offset-1 ring-blue-100">
                      <AvatarImage src={user.avatar} alt={user.firstname} />
                      <AvatarFallback>
                        {user.firstname[0]}
                        {user.lastname[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-800">{`${user.firstname} ${user.lastname}`}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{user.mobile}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {user.address?.[0] || (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.isVerified ? (
                      <Badge className="bg-green-100 text-green-700 rounded-full px-3 py-1">
                        Yes
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-600 rounded-full px-3 py-1">
                        No
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 capitalize">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.isBlocked ? (
                      <Badge className="bg-red-100 text-red-600 rounded-full px-3 py-1">
                        Blocked
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 rounded-full px-3 py-1">
                        Active
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-400 text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="hover:bg-red-600 transition-all"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-8 text-gray-500 font-medium"
                >
                  {loading ? "Loading users..." : "No users found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="w-full flex justify-center py-6 bg-gray-50 rounded-b-2xl border-t border-gray-100">
          <Pagination totalCount={data.totalCount} pageSize={5} />
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
