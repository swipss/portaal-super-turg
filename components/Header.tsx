import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

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
        <Link href={'/account'}>
          <a>
            <img
              className="h-10 w-10 rounded-full shadow-md"
              src="https://st2.depositphotos.com/4111759/12123/v/450/depositphotos_121232442-stock-illustration-male-default-placeholder-avatar-profile.jpg?forcejpeg=true"
            ></img>
          </a>
        </Link>
      </div>
    );
  }

  return (
    <nav className="bg-blue-500 flex justify-between items-center p-6">
      {left}
      {right}
    </nav>
  );
};

export default Header;
