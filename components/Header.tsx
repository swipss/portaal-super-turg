import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { AvatarDropdown } from './PostComponents/AvatarDropdown';
import useSWR from 'swr';
import Head from 'next/head';
import { IoIosPaper } from 'react-icons/io';
import { TiDelete } from 'react-icons/ti';

async function fetchUserPosts() {
  const response = await fetch('/api/userPosts');
  const data = await response.json();
  return data;
}

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const { data: user, error } = useSWR('/api/userPosts', fetchUserPosts);
  const publishedPostsLength = user?.posts?.filter(
    (post) => post.published === true
  );
  console.log(user);
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  let left = (
    <div className="">
      <Link href="/">
        <a
          className="text-white"
          data-active={isActive('/')}
        >
          SuperTurg
        </a>
      </Link>
    </div>
  );

  let right = null;

  if (status === 'loading') {
    left = (
      <div className="">
        <Link href="/">
          <a
            className="text-white"
            data-active={isActive('/')}
          >
            SuperTurg
          </a>
        </Link>
      </div>
    );
    right = (
      <div className="">
        <p>Login sisse...</p>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="">
        <Link href="/api/auth/signin">
          <a
            data-active={isActive('signup')}
            className="text-white"
          >
            Logi sisse
          </a>
        </Link>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="text-white">
        <Link href={'/'}>
          <a
            className="text-white mr-4"
            data-active={isActive('/')}
          >
            SuperTurg
          </a>
        </Link>
      </div>
    );
    right = (
      <div className="flex gap-1">
        <Link href={'/account/kuulutused'}>
          <a
            href="#"
            className="text-white  flex items-center p-2 text-base font-normal hover:bg-blue-600 rounded"
          >
            <IoIosPaper
              size={20}
              color={'white'}
            />
            <span className="ml-1">{publishedPostsLength?.length ?? '0'}</span>
          </a>
        </Link>
        <AvatarDropdown user={user} />
      </div>
    );
  }

  return (
    <>
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`}
        ></script>
        <script src="https://unpkg.com/flowbite@1.5.3/dist/datepicker.js"></script>
      </Head>
      <nav className="bg-blue-500 w-full sticky top-0 z-50">
        <div className="max-w-[1400px] h-16 flex mx-auto justify-between items-center px-2">
          {left}
          <div className="relative">{right}</div>
        </div>
      </nav>
    </>
  );
};

export default Header;
