import moment from 'moment';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import AccountLayout from '../../components/AccountComponents/AccountLayout';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { account: {} } };
  }
  const account = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
  });

  return {
    props: { account: JSON.parse(JSON.stringify(account)) },
  };
};

const DEFAULT_IMAGE =
  'https://st2.depositphotos.com/4111759/12123/v/450/depositphotos_121232442-stock-illustration-male-default-placeholder-avatar-profile.jpg?forcejpeg=true';

const AccountData: NextPage<any> = ({ account }) => {
  console.log(account);

  const today = moment(new Date());
  const createdAt = account?.createdAt;
  const { data: session } = useSession();

  return (
    <AccountLayout>
      <div className="p-2">
        <div className="flex flex-col gap-2">
          <img
            src={DEFAULT_IMAGE}
            className="h-32 w-32 rounded-full"
          />
          <p className="font-medium text-sm text-gray-900">{account?.name}</p>
          <em className="font-medium text-sm text-gray-900">
            {account?.email}
          </em>
          <p className="font-medium text-sm text-gray-900">
            Kasutaja alates {moment(account?.createdAt).format('DD/MM/YY')} (
            {today.diff(createdAt, 'days')} päeva tagasi)
          </p>
        </div>

        <p className="font-bold mt-4">Kontakt</p>
        <label className="block text-sm my-2 font-medium text-gray-900 ">
          Telefon
        </label>
        <div className="relative ">
          <input
            disabled
            type="text"
            className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            placeholder={account?.phone}
          />
        </div>

        <label className="block text-sm mb-2 mt-4 font-medium text-gray-900 ">
          Mail
        </label>
        <div className="relative">
          <input
            disabled
            type="text"
            className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            placeholder={account?.email}
          />
        </div>
        <p className="font-bold mt-4 border-t pt-2">Asukoht</p>
        <label className="block text-sm my-2 font-medium text-gray-900 ">
          Piirkond/maakond
        </label>
        <div className="relative ">
          <input
            disabled
            type="text"
            className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            placeholder={'Tartumaa'}
          />
        </div>
        <div className="flex gap-1">
          <div className="w-full">
            <label className="block text-sm mb-2 mt-4 font-medium text-gray-900 ">
              Asula
            </label>
            <div className="relative ">
              <input
                disabled
                type="text"
                className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                placeholder={'Tartu vald'}
              />
            </div>
          </div>
          <div className="w-full">
            <label className="block text-sm mb-2 mt-4 font-medium text-gray-900 ">
              Linnaosa
            </label>
            <div className="relative ">
              <input
                disabled
                type="text"
                className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                placeholder={'Tartu vald'}
              />
            </div>
          </div>
        </div>
        <label className="block text-sm mb-2 mt-4 font-medium text-gray-900 ">
          Täpsusta asukohta
        </label>
        <div className="relative ">
          <input
            disabled
            type="text"
            className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            placeholder={'Tartu vald'}
          />
        </div>
        <p className="font-bold mt-4  border-t pt-2">Keeled</p>
        <label className="block text-sm my-2 font-medium text-gray-900 ">
          Emakeel
        </label>
        <div className="relative ">
          <select
            disabled
            className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
          >
            <option value={'eesti'}>Eesti keel</option>
          </select>
        </div>
        <label className="block text-sm my-2 font-medium text-gray-900 ">
          Võõrkeeled
        </label>
        <div className="relative ">
          <select
            disabled
            className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
          >
            <option value={'vene'}>Vene keel</option>
          </select>
        </div>
        <p className="font-bold mt-4  border-t pt-2">Lisainfo</p>

        <div className="relative ">
          <textarea
            rows={10}
            disabled
            className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
          ></textarea>
        </div>
        <Link href={`/user/${account?.id}`}>
          <a>
            <button className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-1 mt-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ">
              Vaata oma profiili
            </button>
          </a>
        </Link>
      </div>
    </AccountLayout>
  );
};

export default AccountData;
