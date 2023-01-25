import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { trpc } from '../utils/trpc';

const ReportModal = ({
  setIsReportModalOpen,
  postId,
}: {
  setIsReportModalOpen: Dispatch<SetStateAction<boolean>>;
  postId: string;
}) => {
  const [reason, setReason] = useState('');
  const { data: session } = useSession();
  const reportPost = trpc.post.createReport.useMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    reportPost.mutateAsync(
      {
        reason: reason,
        reportedBy: session?.user?.email,
        postId,
      },
      {
        onSuccess: () => {
          console.log('reported post');
          setIsReportModalOpen(false);
        },
      }
    );
  };
  return (
    <div className="fixed left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto top-40">
      <div className="relative h-full max-w-[300px] mx-auto">
        <div className="relative w-full bg-white rounded-lg shadow ">
          <button
            onClick={() => setIsReportModalOpen(false)}
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900">
              Teavita probleemist
            </h3>
            <form
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="reason"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Kirjelda probleemi lühidalt
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  name="reason"
                  id="reason"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                  rows={5}
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-messenger hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Saada
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
