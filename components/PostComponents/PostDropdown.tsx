import moment from 'moment';
import React, { useState } from 'react';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: 'PUT',
  }).then(() => window.location.reload());
}

const MyContainer = ({ className, children }) => {
  return (
    <div className="bg-blue-500 absolute w-96">
      <CalendarContainer>
        <div>{children}</div>
      </CalendarContainer>
    </div>
  );
};

export const PostDropdown = ({ post, setEditing }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  console.log(post.reservedUntil, 'here');

  async function addReservation(): Promise<void> {
    if (date <= new Date()) {
      alert(
        'Broneeringu kuupäev ei saa olla väiksem või võrdne kui tänane päev'
      );
      return;
    }
    await fetch(`/api/post/reserve`, {
      method: 'PUT',
      body: JSON.stringify({ postId: post.id, reservedUntil: new Date(date) }),
    }).then(() => window.location.reload());
  }
  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
        id="dropdownMenuIconHorizontalButton"
        data-dropdown-toggle="dropdownDotsHorizontal"
        className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-900 bg-white rounded hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        type="button"
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>

      {/* <!-- Dropdown menu --> */}
      <div
        id="dropdownDotsHorizontal"
        className={`${
          !open && 'hidden'
        } absolute w-max right-0  z-10 bg-white rounded divide-y divide-gray-100 shadow-md dark:bg-gray-700 dark:divide-gray-600`}
      >
        {post?.published && (
          <div
            className="p-3  flex gap-2 items-center justify-center  text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownMenuIconHorizontalButton"
          >
            <button
              className="button"
              onClick={(e) => {
                e.preventDefault();
                setIsReservationModalOpen(true);
              }}
            >
              Broneeri
            </button>
            {/* <button
                type="button"
                className="button"
                onClick={(e) => {
                  e.preventDefault();
                  addReservation();
                }}
              >
                Lisa märge
              </button> */}
          </div>
        )}

        <div
          className="p-3  flex gap-2 items-center justify-center  text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownMenuIconHorizontalButton"
        >
          <button
            className="button"
            onClick={(e) => {
              e.preventDefault();
              setEditing(true);
            }}
          >
            Muuda postitust
          </button>
          {!post?.published ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                publishPost(post.id);
              }}
              type="button"
              className="button"
            >
              Aktiveeri
            </button>
          ) : null}
        </div>
      </div>
      {isReservationModalOpen ? (
        <div
          onClick={(e) => e.preventDefault()}
          className=" overflow-y-auto overflow-x-hidden fixed inset-0 top-32 z-50  md:top-32 h-full flex items-center justify-center md:h-full  "
        >
          <div className="relative p-4 w-full max-w-md h-full ">
            <div className="relative bg-gray-50 rounded-lg shadow-2xl dark:bg-gray-700">
              <button
                type="button"
                onClick={() => setIsReservationModalOpen(false)}
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-6 text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Lisa postitusele märge
                </h3>
                <div
                  onClick={(e) => e.preventDefault()}
                  className="mb-4"
                >
                  <DatePicker
                    selected={date}
                    onChange={(e) => setDate(e)}
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addReservation();
                  }}
                  data-modal-toggle="popup-modal"
                  type="button"
                  className="button"
                >
                  Lisa märge
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
