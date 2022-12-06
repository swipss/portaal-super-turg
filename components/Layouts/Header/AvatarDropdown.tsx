import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { TiDelete } from 'react-icons/ti';
import { ConfirmationModal } from '../ConfirmationModal';

export const AvatarDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const publishedPostsLength = user?.posts?.filter(
    (post) => post.published === true
  );
  const ref: any = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        console.log('clicked outside');
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <>
      <div className="flex items-center justify-center gap-2 text-white rounded">
        <button onMouseOver={() => setIsOpen(true)}>
          <img
            src={user?.image}
            className="w-10 h-10 border-white rounded-full shadow-xl hover:border-blue-700 "
          />
        </button>
      </div>

      {isOpen && (
        <div
          ref={ref}
          className="absolute right-0 z-50 mt-10 mr-2 bg-white divide-y divide-gray-100 rounded shadow-lg w-44"
        >
          <ul
            className="py-1 text-sm text-gray-700 "
            aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton"
          >
            <li>
              <div className="px-4 py-2 font-bold transition-all duration-100 hover:bg-gray-100">
                <p className="block">{user.name}</p>
                <p className="block text-xs font-normal">({user.email})</p>
              </div>
            </li>
            <li>
              <Link href="/account/kuulutused">
                <a
                  href="#"
                  className="flex gap-2 px-4 py-2 transition-all duration-100 hover:bg-gray-100 "
                >
                  Kuulutused
                  <p className="flex items-center justify-center w-5 h-5 text-xs font-medium text-blue-600 bg-blue-200 rounded-full">
                    {publishedPostsLength?.length}
                  </p>
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block px-4 py-2 transition-all duration-100 hover:bg-gray-100"
                >
                  Raha ja arved
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block px-4 py-2 transition-all duration-100 hover:bg-gray-100"
                >
                  Küsimused
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block px-4 py-2 transition-all duration-100 hover:bg-gray-100"
                >
                  Suhtlus
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block px-4 py-2 transition-all duration-100 hover:bg-gray-100"
                >
                  Teated
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block px-4 py-2 transition-all duration-100 hover:bg-gray-100"
                >
                  Märksõnaga otsing
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block px-4 py-2 transition-all duration-100 hover:bg-gray-100"
                >
                  Lemmikud
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a
                  href="#"
                  className="block px-4 py-2 transition-all duration-100 hover:bg-gray-100"
                >
                  Vaatasin
                </a>
              </Link>
            </li>
            <li>
              <Link href="/account/andmed">
                <a
                  href="#"
                  className="block px-4 py-2 transition-all duration-100 hover:bg-gray-100"
                >
                  Minu konto
                </a>
              </Link>
            </li>
            <li>
              <button
                onClick={() => setIsConfirmationModalOpen(true)}
                className="block w-full px-4 py-2 text-left text-red-500 transition-all duration-100 border-t hover:bg-gray-100"
              >
                Logi välja
              </button>
            </li>
          </ul>
        </div>
      )}
      {isConfirmationModalOpen ? (
        <ConfirmationModal
          setConfirmationModal={setIsConfirmationModalOpen}
          onConfirm={() => signOut()}
          confirmationText={'Kas oled kindel, et soovid välja logida?'}
          confirmationButtonText={'Logi välja'}
        />
      ) : null}
    </>
  );
};
