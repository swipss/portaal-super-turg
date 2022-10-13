import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { TiDelete } from 'react-icons/ti';

export const AvatarDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  const publishedPostsLength = user?.posts?.filter(
    (post) => post.published === true
  );
  return (
    <>
      <div className="flex items-center gap-2 text-white justify-center  rounded p-1">
        <Link href="/account/andmed">
          <a>
            <img
              src={user?.image}
              className="w-10 h-10 rounded-full p-0.5 hover:bg-blue-600  transition-all duration-100"
            />
          </a>
        </Link>
        <button
          className="flex justify-center transition-all duration-100 hover:bg-blue-600 h-full items-center text-sm font-medium text-white rounded px-1"
          type="button"
          onClick={() => setOpen(!open)}
        >
          {user?.name}
          <span className="sr-only">Open user menu</span>
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
      </div>

      {open && (
        <div className="z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow-lg absolute right-0 mt-10 mr-2">
          <ul
            className="py-1 text-sm text-gray-700 "
            aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton"
          >
            <li>
              <Link href="/account/kuulutused">
                <a
                  href="#"
                  className="py-2 px-4 hover:bg-gray-100 flex gap-2  transition-all duration-100 "
                >
                  Kuulutused
                  <p className="w-5 h-5 font-medium text-xs flex items-center justify-center text-blue-600 bg-blue-200 rounded-full">
                    {publishedPostsLength?.length}
                  </p>
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100  transition-all duration-100"
                >
                  Raha ja arved
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100  transition-all duration-100"
                >
                  Küsimused
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100  transition-all duration-100"
                >
                  Suhtlus
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100  transition-all duration-100"
                >
                  Teated
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100  transition-all duration-100"
                >
                  Märksõnaga otsing
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100  transition-all duration-100"
                >
                  Lemmikud
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100  transition-all duration-100"
                >
                  Vaatasin
                </a>
              </Link>
            </li>
            <li>
              <Link href="/account/andmed">
                <a
                  href="#"
                  className="block py-2 px-4 hover:bg-gray-100  transition-all duration-100"
                >
                  Minu konto
                </a>
              </Link>
            </li>
            <li>
              <button
                onClick={() => signOut()}
                className="block w-full text-left border-t text-red-500 py-2 px-4 hover:bg-gray-100  transition-all duration-100"
              >
                Logi välja
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};
