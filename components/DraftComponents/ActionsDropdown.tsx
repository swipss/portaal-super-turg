import { useState } from 'react';
import EditPostModal from './EditPostModal';
import ReservationModal from './ReservationModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { trpc } from '../../utils/trpc';

const ActionsDropdown: React.FC<any> = ({
  deactivatePost,
  activatePost,
  post,
  loading,
  deletePost,
  refetch,
}) => {
  const [editingModalOpen, setEditingModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [startDate, setStartDate]: any = useState(new Date());
  const date = new Date();

  const { mutate } = trpc.drafts.addReservation.useMutation();

  const handleAddReservation = () => {
    mutate(
      { id: post.id, date: startDate },
      {
        onError: (err) => {
          console.log(err);
        },
        onSuccess: () => {
          refetch();
          setReservationModalOpen(false);
        },
      }
    );
  };

  return (
    <div className="absolute z-10 p-2 bg-white rounded shadow top-10 right-1">
      <button
        onClick={(e) => {
          setEditingModalOpen(true);
        }}
        disabled={loading}
        className="block w-full p-1 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        Muuda
      </button>
      {editingModalOpen && (
        <EditPostModal
          setModalOpen={setEditingModalOpen}
          post={post}
          refetch={refetch}
        />
      )}
      {post.published && (
        <button
          onClick={() => setReservationModalOpen(!reservationModalOpen)}
          disabled={loading}
          className="block w-full p-1 mt-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          Broneeri
        </button>
      )}
      {reservationModalOpen && (
        <div className="absolute flex p-2 bg-white rounded shadow top-18 -left-48">
          <DatePicker
            className="relative px-2 border rounded w-max"
            open
            minDate={date}
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <button
            onClick={handleAddReservation}
            type="button"
            className="px-4 ml-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Lisa
          </button>
          <button
            className="ml-2 "
            onClick={() => setReservationModalOpen(false)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="grey"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      )}
      {post.published ? (
        <button
          disabled={loading}
          onClick={(e) => {
            deactivatePost(post.id);
          }}
          className="block w-full p-1 mt-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          Deaktiveeri
        </button>
      ) : (
        <button
          disabled={loading}
          onClick={(e) => {
            activatePost(post.id);
          }}
          className="block w-full p-1 mt-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          Aktiveeri
        </button>
      )}
      {!post.published && (
        <button
          onClick={(e) => {
            deletePost(post.id);
          }}
          disabled={loading}
          className="w-full p-1 mt-1 text-red-500 rounded blocktext-red-500 hover:bg-gray-100 disabled:opacity-50"
        >
          Kustuta
        </button>
      )}
    </div>
  );
};

export default ActionsDropdown;
