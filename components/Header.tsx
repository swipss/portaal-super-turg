import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const {data: session, status} = useSession()

  let left = (
    <div className="">
      <Link href="/">
        <a className="text-white" data-active={isActive("/")}>
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
        <a className="text-white" data-active={isActive("/")}>
          SuperTurg
        </a>
      </Link>
      
    </div>
    )
    right = (
      <div className="">
        <p>Login sisse...</p>
        
      </div>
    )
  }

  if (!session) {
    right = (
      <div className="">
        <Link href='/api/auth/signin'>
          <a data-active={isActive('signup')} className="text-white">Logi sisse</a>
        </Link>
        
      </div>
    )
  }

  if (session) {
    left = (
      <div className="text-white">
        <Link href={'/'}>
          <a className="text-white mr-4"  data-active={isActive('/')}>
            SuperTurg
          </a>
        </Link>
        <Link href={'/drafts'} >Minu kuulutused</Link>
        <Link href={'/create'}>
            <button>
              <a className="text-white ml-4">Uus kuulutus</a>
            </button>
          </Link>
        
      </div>
    )
    right = (
      <div className="justify-between flex flex-col">
        <p className="text-white">{session.user.name} ({session.user.email})</p>
          
          <button onClick={() => signOut()}>
            <a className="text-white">Logi välja</a>
          </button>
        
      </div>
    )
  }

  return (
    <nav className="flex justify-between items-center bg-blue-600 p-4">
      {left}
      {right}
      
    </nav>
  );
};

export default Header;
