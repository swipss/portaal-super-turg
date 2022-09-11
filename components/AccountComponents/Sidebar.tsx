import Link from 'next/link';
import React from 'react';

export const Sidebar = () => {
  return (
    <div className="h-max bg-blue-500 flex flex-col text-white p-4 pr-20 gap-4 rounded-lg shadow-lg">
      <Link href={'#'}>
        <a>Kuulutused</a>
      </Link>
      <Link href={'#'}>
        <a>Raha ja arved</a>
      </Link>
      <Link href={'#'}>
        <a>Küsimused</a>
      </Link>
      <Link href={'#'}>
        <a>Suhtlus</a>
      </Link>
      <Link href={'#'}>
        <a>Teated</a>
      </Link>
      <Link href={'#'}>
        <a>Teated</a>
      </Link>
      <Link href={'#'}>
        <a>Märksõnaga otsing</a>
      </Link>
      <Link href={'#'}>
        <a>Lemmikud</a>
      </Link>
      <Link href={'#'}>
        <a>Mina vaatasin</a>
      </Link>
      <Link href={'#'}>
        <a>Minu andmed</a>
      </Link>
    </div>
  );
};
