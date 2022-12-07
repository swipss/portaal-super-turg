import { useState } from 'react';
import Modal from '../Layouts/Modal';
import EditPostModal from './EditPostModal';

const ActionsDropdown: React.FC<any> = ({
  deactivatePost,
  activatePost,
  post,
  loading,
  deletePost,
  refetch,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="absolute z-10 p-2 bg-white rounded shadow top-10 right-1">
      <button
        onClick={(e) => {
          setModalOpen(true);
        }}
        disabled={loading}
        className="block w-full p-1 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        Muuda
      </button>
      {modalOpen && (
        <EditPostModal
          setModalOpen={setModalOpen}
          post={post}
          refetch={refetch}
        />
      )}
      <button
        disabled={loading}
        className="block w-full p-1 mt-1 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        Broneeri
      </button>
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
      <button
        onClick={(e) => {
          deletePost(post.id);
        }}
        disabled={loading}
        className="w-full p-1 mt-1 text-red-500 rounded blocktext-red-500 hover:bg-gray-100 disabled:opacity-50"
      >
        Kustuta
      </button>
    </div>
  );
};

export default ActionsDropdown;
