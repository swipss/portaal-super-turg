import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { AvatarDropdown } from './PostComponents/AvatarDropdown';
import Head from 'next/head';

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

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
      <AvatarDropdown
        name={session?.user?.name}
        email={session?.user?.email}
      />
    );
  }

  return (
    <>
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`}
        ></script>
      </Head>
      <nav className="bg-blue-500 w-full sticky top-0 z-50">
        <div className="max-w-[1400px] h-16 flex mx-auto justify-between items-center px-2">
          {left}
          <div>{right}</div>
        </div>
      </nav>
    </>
  );
};

export default Header;
