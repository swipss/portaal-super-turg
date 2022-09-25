import moment from 'moment';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useRef, useState } from 'react';

import AccountLayout from '../../components/AccountComponents/AccountLayout';

import prisma from '../../lib/prisma';
import { AiOutlineCloudUpload } from 'react-icons/ai';

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
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`;

const AccountData: NextPage<any> = (props) => {
  const [account, setAccount] = useState(props?.account);
  const { data: session } = useSession();
  console.log(account);

  const today = moment(new Date());
  const createdAt = account?.createdAt;

  const [isEditing, setIsEditing] = useState(false);
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState();

  const handleImageClick = () => {
    if (isEditing) {
      inputFile.current.click();
    }
  };

  const handleImageSelect = (e) => {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET);

      await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => setAccount({ ...account, image: data.secure_url }));
    }
    await fetch('/api/update-account', {
      method: 'POST',
      body: JSON.stringify(account),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));

    console.log(account, 'account');

    console.log('submitted');
  };

  return (
    <AccountLayout>
      <form
        className="p-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="relative">
              {isEditing && (
                <div
                  onClick={() => handleImageClick()}
                  className="absolute bg-gray-300 bg-opacity-50 h-full w-full flex items-center justify-center rounded-full cursor-pointer hover:bg-opacity-80"
                >
                  <AiOutlineCloudUpload
                    size={60}
                    color="white"
                  />
                </div>
              )}
              <img
                src={imagePreview || account?.image || DEFAULT_IMAGE}
                className="h-32 w-32 rounded-full object-cover object-center"
              />
            </div>
            <input
              type={'file'}
              ref={inputFile}
              onChange={handleImageSelect}
              className="hidden"
            />
            <div className="flex items-end ">
              <button
                onClick={() => setIsEditing(!isEditing)}
                type="button"
                className={`${
                  isEditing && 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
                } text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-1 mt-2   focus:outline-none  `}
              >
                {isEditing ? 'Tühista' : 'Muuda andmeid'}
              </button>

              <button
                onClick={() => setIsEditing(false)}
                type="submit"
                className={` ${
                  !isEditing ? 'hidden' : ''
                }  text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-1 mt-2   focus:outline-none  `}
              >
                Salvesta
              </button>
            </div>
          </div>
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
          Nimi
        </label>
        <div className="relative ">
          <input
            disabled={!isEditing}
            type="text"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            placeholder={account?.name || 'Määramata'}
            onChange={(e) => setAccount({ ...account, name: e.target.value })}
            value={account?.name}
          />
        </div>
        <label className="block text-sm my-2 font-medium text-gray-900 ">
          Telefon
        </label>
        <div className="relative ">
          <input
            disabled={!isEditing}
            type="number"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            placeholder={account?.phone || 'Määramata'}
            onChange={(e) => setAccount({ ...account, phone: e.target.value })}
            value={account?.phone}
          />
        </div>

        <label className="block text-sm mb-2 mt-4 font-medium text-gray-900 ">
          Meil
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
      </form>
    </AccountLayout>
  );
};

export default AccountData;
