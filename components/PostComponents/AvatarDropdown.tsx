import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';

export const AvatarDropdown = ({ name, email }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="flex items-center text-sm font-medium text-white rounded-full md:mr-2"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <span className="sr-only">Open user menu</span>
        {/* <img
          className="mr-2 w-8 h-8 rounded-full"
          src="https://st2.depositphotos.com/4111759/12123/v/450/depositphotos_121232442-stock-illustration-male-default-placeholder-avatar-profile.jpg?forcejpeg=true"
          alt="user photo"
        /> */}

        {name}
        <svg
          className="w-4 h-4 mx-1.5"
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
      {open && (
        <div className="z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow-lg absolute right-0 mt-10 mr-2">
          <div className="py-3 px-4 text-sm text-gray-900">
            <div className="font-medium ">{name}</div>
            <div className="truncate">{email}</div>
          </div>
          <ul
            className="py-1 text-sm text-gray-700 "
            aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton"
          >
            <li>
              <Link href="/account/kuulutused">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100 e"
                >
                  Minu konto
                </a>
              </Link>
            </li>
          </ul>
          <div className="py-1 ">
            <div
              onClick={() => signOut()}
              className="block py-2 px-4 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
            >
              Logi välja
            </div>
          </div>
        </div>
      )}
    </>
  );
};
