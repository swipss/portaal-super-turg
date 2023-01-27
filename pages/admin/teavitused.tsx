import moment from 'moment';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import { trpc } from '../../utils/trpc';
import Unauthorized from '../unauthorized';

const ReportsPage = () => {
  const { data: user } = trpc.drafts.getUser.useQuery();
  const { data: reports, refetch } = trpc.admin.getReports.useQuery();
  const resolveReport = trpc.admin.resolveReport.useMutation();
  const deleteReport = trpc.admin.deleteReport.useMutation();
  const unresolveReport = trpc.admin.unresolveReport.useMutation();
  const [isResolvedFilter, setIsResolvedFilter] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (user?.role !== 'ADMIN') {
    return (
      <Unauthorized>
        <h1>Sul puuduvaid õigused lehe kuvamiseks</h1>
      </Unauthorized>
    );
  }

  const handleResolveReport = (id: string) => {
    resolveReport.mutate(id, {
      onSuccess: () => refetch(),
    });
  };

  const handleDeleteReport = (id: string) => {
    deleteReport.mutate(id, {
      onSuccess: () => refetch(),
    });
  };
  return (
    <Layout>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="inline-flex mb-2 items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        type="button"
      >
        {isResolvedFilter === false ? 'Aktiivsed' : 'Arhiiv'}

        <svg
          className="w-3 h-3 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {isDropdownOpen && (
        <div className="absolute z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
          <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                <input
                  id="active"
                  type="radio"
                  onClick={() => setIsResolvedFilter(false)}
                  checked={isResolvedFilter === false}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="active"
                  className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                >
                  Aktiivsed
                </label>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                <input
                  id="resolved"
                  type="radio"
                  onClick={() => setIsResolvedFilter(true)}
                  checked={isResolvedFilter === true}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="resolved"
                  className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                >
                  Arhiiv
                </label>
              </div>
            </li>
          </ul>
        </div>
      )}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3"
              >
                Kuulutus
              </th>
              <th
                scope="col"
                className="px-6 py-3"
              >
                Kommentaar
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
                Kuupäev
              </th>
              <th
                scope="col"
                className="px-6 py-3"
              >
                Tegevused
              </th>
            </tr>
          </thead>
          <tbody>
            {reports
              ?.filter((report) => report.resolved === isResolvedFilter)
              .map((report) => (
                <>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="w-32 p-4">
                      <Link href={`/kuulutus/${report.post?.id}`}>
                        <a>
                          <img
                            src={report.post?.images[0].secureUrl ?? ''}
                            className="object-cover object-center h-20"
                          />
                        </a>
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {report.reason}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <a
                        href={`/user/${report.post?.author?.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {report.post?.author?.name}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {moment(report.date).format('DD.MM h:mm')}
                    </td>
                    <td className="px-6 py-4">
                      {!report.resolved ? (
                        <button
                          onClick={() => handleResolveReport(report.id)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Kustuta
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Kustuta jäädavalt
                        </button>
                      )}
                    </td>
                  </tr>
                  <td
                    className="px-6"
                    colSpan={5}
                  >
                    <tr className="text-xs text-gray-500">
                      Teatatud {moment(report.date).format('DD.MM h:mm')}{' '}
                      <Link href={`/user/${report.post?.author?.id}`}>
                        <a className="text-blue-500 hover:underline">
                          {report.reportedBy?.name}
                        </a>
                      </Link>{' '}
                      &nbsp;poolt (varem teatanud{' '}
                      {report.post?.author?.reports?.length} korda)
                    </tr>
                  </td>
                </>
              ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ReportsPage;
