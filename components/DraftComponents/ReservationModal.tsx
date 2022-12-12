import Modal from '../Layouts/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

const ReservationModal = ({ setModalOpen, post, refetch }) => {
  const [startDate, setStartDate]: any = useState(new Date());
  return (
    <Modal setModalOpen={setModalOpen}>
      <h1 className="title">Broneerimine</h1>
      <div className="flex items-center justify-center outline">
        <DatePicker
          className="outline"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
      </div>
    </Modal>
  );
};

export default ReservationModal;
