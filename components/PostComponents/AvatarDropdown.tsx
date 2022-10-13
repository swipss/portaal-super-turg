import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { TiDelete } from 'react-icons/ti';

export const AvatarDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Link href="/account/andmed">
        <a>
          <img
            src={user?.image}
            className="w-9 h-9 rounded-full "
          />
        </a>
      </Link>
      <button
        className="flex items-center text-sm font-medium text-white rounded-full "
        type="button"
        onClick={() => setOpen(!open)}
      >
        <span className="sr-only">Open user menu</span>
        {/* <img
          className="mr-2 w-8 h-8 rounded-full"
          src="https://st2.depositphotos.com/4111759/12123/v/450/depositphotos_121232442-stock-illustration-male-default-placeholder-avatar-profile.jpg?forcejpeg=true"
          alt="user photo"
        /> */}
        {user?.name}
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
            <div className="font-medium ">{user?.name}</div>
            <div className="truncate">{user?.email}</div>
          </div>
          <ul
            className="py-1 text-sm text-gray-700 "
            aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton"
          >
            <li>
              <Link href="/account/kuulutused">
                <a
                  href="#"
                  className="py-2 px-4 hover:bg-gray-100 flex gap-2"
                >
                  Kuulutused
                  <p className="w-5 h-5 font-medium text-xs flex items-center justify-center text-blue-600 bg-blue-200 rounded-full">
                    {user?.posts?.length}
                  </p>
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100 e"
                >
                  Raha ja arved
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100 e"
                >
                  Küsimused
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100 e"
                >
                  Suhtlus
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100 e"
                >
                  Teated
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100 e"
                >
                  Märksõnaga otsing
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100 e"
                >
                  Lemmikud
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100 e"
                >
                  Vaatasin
                </a>
              </Link>
            </li>
            <li>
              <Link href="/account/andmed">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100 e"
                >
                  Minu konto
                </a>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};
