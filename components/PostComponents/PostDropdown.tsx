import moment from 'moment';
import React, { useState } from 'react';

export const PostDropdown = ({ postId, setEditing }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');

  const min_date = moment().format('YYYY-MM-DD');
  console.log(min_date, date);

  async function addReservation(): Promise<void> {
    if (date <= min_date) {
      alert(
        'Broneeringu kuupäev ei saa olla väiksem või võrdne kui tänane päev'
      );
      return;
    }
    await fetch(`/api/post/reserve`, {
      method: 'PUT',
      body: JSON.stringify({ postId: postId, reservedUntil: new Date(date) }),
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
        <div
          className="p-3  flex gap-2 items-center justify-center  text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownMenuIconHorizontalButton"
        >
          <p>Broneeritud kuni</p>
          <input
            type={'date'}
            min={min_date}
            className="border rounded-lg p-2 text-sm appearance-none"
            onClick={(e) => {
              e.preventDefault();
            }}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            type="button"
            className="button"
            onClick={(e) => {
              e.preventDefault();
              addReservation();
            }}
          >
            Lisa märge
          </button>
        </div>
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
        </div>
      </div>
    </>
  );
};
