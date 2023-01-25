import moment from 'moment';
import Layout from '../../components/Layouts/Layout';
import { trpc } from '../../utils/trpc';
import Unauthorized from '../unauthorized';

const ReportsPage = () => {
  const { data: user } = trpc.drafts.getUser.useQuery();
  const { data: reports } = trpc.admin.getReports.useQuery();
  console.log(reports);
  if (user?.role !== 'ADMIN') {
    return (
      <Unauthorized>
        <h1>Sul puuduvaid õigused lehe kuvamiseks</h1>
      </Unauthorized>
    );
  }
  return (
    <Layout>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
            {reports?.map((report) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="w-32 p-4">
                  <img src={report.post?.images[0].secureUrl ?? ''} />
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {report.reason}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  <a
                    href={`/user/${report.post?.author?.id}`}
                    className="font-medium text-blue-600 dark:text-red-500 hover:underline"
                  >
                    {report.post?.author?.name}
                  </a>
                </td>
                <td className="px-6 py-4">
                  {moment(report.date).format('DD.MM')}
                </td>
                <td className="px-6 py-4">
                  <button className="font-medium text-red-600 dark:text-red-500 hover:underline">
                    Kustuta
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ReportsPage;
