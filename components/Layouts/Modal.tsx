const Modal = ({ children, setModalOpen }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="w-[600px] max-h-[80vh] bg-white top-52 rounded overflow-scroll p-4 m-2">
        <button
          onClick={(e) => {
            setModalOpen(false);
          }}
          className="float-right w-10 h-10 font-medium text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
