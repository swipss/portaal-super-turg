import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { AvatarDropdown } from './AvatarDropdown';
import useSWR from 'swr';
import Head from 'next/head';
import { IoIosPaper } from 'react-icons/io';
import { trpc } from '../../../utils/trpc';
import io from 'socket.io-client';

const socket = io('https://portaal-super-turg.vercel.app/', {
  reconnectionDelay: 1000,
  reconnection: true,
  transports: ['websocket'],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false,
  reconnectionAttempts: 10,
});

const Header: React.FC = () => {
  const { data: user, isLoading, refetch } = trpc.drafts.getUser.useQuery();

  const router = useRouter();

  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const publishedPostsLength = user?.posts?.filter(
    (post) => post.published === true
  );

  const [onlineUsers, setOnlineUsers] = useState<number>();
  console.log('online users', onlineUsers);

  useEffect(() => {
    fetch('/api/socket').finally(() => {
      socket.on('connect', () => {
        console.log('CONNECTED');
      });
      socket.emit('get-online-users');
      socket.on('online-users', (users) => {
        setOnlineUsers(Object.values(users).length);
      });
    });
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit('login', user?.id);
    }
  }, [user]);

  return (
    <>
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`}
        ></script>
      </Head>
      <nav className="sticky top-0 z-10 w-full bg-white shadow-md">
        <p className="text-xs text-gray-400">
          {onlineUsers} kasutaja(t) online
        </p>
        <div className="relative flex items-center justify-between h-16 max-w-5xl px-2 mx-auto text-white">
          <Link href={'/'}>
            <a
              className="mr-4 text-lg font-bold text-messenger "
              data-active={isActive('/')}
            >
              SuperTurg
            </a>
          </Link>
          <div>
            {!user ? (
              <Link href="/api/auth/signin">
                <a className="font-bold text-slate-900">Logi sisse</a>
              </Link>
            ) : (
              <div className="flex">
                <Link href={'/account/kuulutused'}>
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
                <Link href={'#'}>
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
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
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
