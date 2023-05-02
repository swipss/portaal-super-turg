import Link from 'next/link';
import { useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import { trpc } from '../../utils/trpc';
import Unauthorized from '../unauthorized';
import { AdminTabs } from './teavitused';

const UsersPage = () => {
  const { data: user } = trpc.drafts.getUser.useQuery();
  const { data: users, refetch } = trpc.admin.getAllUsers.useQuery();
  const [searchNameFilter, setSearchNameFilter] = useState('');

  if (user?.role !== 'ADMIN') {
    return (
      <Unauthorized>
        <h1>Sul puuduvaid õigused lehe kuvamiseks</h1>
      </Unauthorized>
    );
  }

  return (
    <Layout>
      <AdminTabs />
      <div>
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only">
          Otsi
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Otsi kasutajat..."
            onChange={(e) => setSearchNameFilter(e.target.value)}
            value={searchNameFilter}
          />
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
          >
            Otsi
          </button>
        </div>
      </div>
      <div className="relative mt-2 overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3"
              >
                Profiil
              </th>
              <th
                scope="col"
                className="px-6 py-3"
              >
                Kasutaja
              </th>

              <th
                scope="col"
                className="px-6 py-3"
              >
                Akt. kuulutusi
              </th>
              <th
                scope="col"
                className="px-6 py-3"
              >
                Comments
              </th>
            </tr>
          </thead>
          <tbody>
            {users
              ?.filter((user) =>
                user.name
                  ?.toLowerCase()
                  .includes(searchNameFilter.toLowerCase())
              )
              .map((user) => (
                <tr className="bg-white hover:bg-gray-50">
                  <td className="w-32 p-4">
                    <img
                      src={user.image ?? ''}
                      className="object-cover object-center w-full h-20"
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {user.name ? (
                      <Link
                        href={`/user/${user.id}`}
                        legacyBehavior
                      >
                        <a className="text-blue-500 hover:underline">
                          {user.name}
                        </a>
                      </Link>
                    ) : (
                      <p className="italic">kasutajanimi puudub</p>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {
                      user?.posts?.filter((post) => post.published === true)
                        .length
                    }
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {user?.comments?.length}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default UsersPage;
