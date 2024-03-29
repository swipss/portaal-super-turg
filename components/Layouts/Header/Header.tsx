import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AvatarDropdown } from './AvatarDropdown';
import Head from 'next/head';
import { IoIosPaper } from 'react-icons/io';
import { trpc } from '../../../utils/trpc';
import { useSession } from 'next-auth/react';

const Header: React.FC = () => {
  const { data: user } = trpc.drafts.getUser.useQuery();

  const router = useRouter();

  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const publishedPostsLength = user?.posts?.filter(
    (post) => post.published === true
  );

  return (
    <>
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`}
        ></script>
      </Head>
      <nav className="sticky top-0 z-10 w-full bg-white shadow-md">
        {/* <p className="text-xs text-gray-400">
          {onlineUsers} kasutaja(t) online
        </p> */}
        <div className="relative flex items-center justify-between h-16 max-w-5xl px-2 mx-auto text-white">
          <Link
            href={'/'}
            legacyBehavior
          >
            <a
              className="mr-4 text-lg font-bold text-messenger "
              data-active={isActive('/')}
            >
              SuperTurg
            </a>
          </Link>
          <div>
            {!user ? (
              <Link
                href="/api/auth/signin"
                legacyBehavior
              >
                <a className="font-bold text-slate-900">Logi sisse</a>
              </Link>
            ) : (
              <div className="flex">
                {user?.role === 'ADMIN' && (
                  <Link
                    href={'/admin/teavitused'}
                    legacyBehavior
                  >
                    <a className="flex items-center px-4 mr-2 text-sm font-medium text-black bg-white border rounded-full hover:bg-gray-100">
                      Admin
                    </a>
                  </Link>
                )}
                <Link
                  href={'/account/kuulutused'}
                  legacyBehavior
                >
                  <a
                    href="#"
                    className="flex items-center justify-center p-2 mr-2 text-base font-normal text-white bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <IoIosPaper
                      size={20}
                      className="text-slate-900"
                    />
                    <span className="ml-1 text-slate-900">
                      {publishedPostsLength?.length ?? '0'}
                    </span>
                  </a>
                </Link>
                <Link
                  href={'#'}
                  legacyBehavior
                >
                  <a
                    href="#"
                    className="relative flex items-center justify-center p-2 mr-2 text-base font-normal bg-gray-100 rounded-full text-slate-900 hover:bg-gray-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      ></path>
                    </svg>
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce"></span>
                  </a>
                </Link>
                <AvatarDropdown user={user} />
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
