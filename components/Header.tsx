import React from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

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
      <div className="items-center first-letter flex gap-3 text-white text-center ">
        <Link href={'/drafts'}>Minu kuulutused</Link>
        <Link href={'/create'}>
          <button>
            <a>Uus kuulutus</a>
          </button>
        </Link>
        <button onClick={() => signOut()}>Logi välja</button>
        <div
          onClick={() => Router.push('/account')}
          className="h-10 w-10 bg-gray-300 rounded-full shadow-md cursor-pointer"
        ></div>
      </div>
    );
  }

  return (
    <nav className="bg-blue-500 flex justify-between items-center rounded-b-lg shadow-md p-6">
      {left}
      {right}
    </nav>
  );
};

export default Header;
