import moment from 'moment';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { prisma } from '../../server/trpc/prisma';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import Layout from '../../components/Layouts/Layout';

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   const session = await getSession({ req });
//   if (!session) {
//     res.statusCode = 403;
//     return { props: { account: {} } };
//   }
//   const account = await prisma.user.findUnique({
//     where: {
//       email: session?.user?.email ?? '',
//     },
//     include: {
//       locations: true,
//     },
//   });

//   return {
//     props: { account: JSON.parse(JSON.stringify(account)) },
//   };
// };

const DEFAULT_IMAGE =
  'https://st2.depositphotos.com/4111759/12123/v/450/depositphotos_121232442-stock-illustration-male-default-placeholder-avatar-profile.jpg?forcejpeg=true';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`;

const AccountData: NextPage<any> = (props) => {
  const [account, setAccount] = useState(props?.account);
  const { data: session } = useSession();

  const today = moment(new Date());
  const createdAt = account?.createdAt;

  const [isEditing, setIsEditing] = useState(false);
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState();

  const handleImageClick = () => {
    if (isEditing) {
      inputFile?.current?.click();
    }
  };

  const handleImageSelect = (e) => {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch('/api/update-account', {
      method: 'POST',
      body: JSON.stringify(account),
    }).then(() => {
      const formData = new FormData();
      formData.append('file', imageFile ?? '');
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_UPLOAD_PRESET ?? ''
      );
      fetch(CLOUDINARY_URL, {
        method: 'post',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch('/api/upload/image', {
            method: 'put',
            body: JSON.stringify({ account, data }),
          });
        });
    });
  };

  return (
    <Layout>
      <form
        className="p-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <div className="relative">
              {isEditing && (
                <div
                  onClick={() => handleImageClick()}
                  className="absolute flex items-center justify-center w-full h-full bg-gray-300 bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-80"
                >
                  <AiOutlineCloudUpload
                    size={60}
                    color="white"
                  />
                </div>
              )}
              <img
                src={imagePreview || account?.image || DEFAULT_IMAGE}
                className="object-cover object-center w-32 h-32 rounded-full"
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
          <p className="text-sm font-medium text-gray-900">{account?.name}</p>
          <em className="text-sm font-medium text-gray-900">
            {account?.email}
          </em>
          <p className="text-sm font-medium text-gray-900">
            Kasutaja alates {moment(account?.createdAt).format('DD/MM/YY')} (
            {today.diff(createdAt, 'days')} päeva tagasi)
          </p>
        </div>

        <p className="mt-4 font-bold">Kontakt</p>
        <label className="block my-2 text-sm font-medium text-gray-900 ">
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
        <label className="block my-2 text-sm font-medium text-gray-900 ">
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

        <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 ">
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
        <p className="pt-2 mt-4 font-bold border-t">Asukoht</p>
        {account?.locations?.map((item, i) => (
          <>
            <label className="block my-2 text-sm font-medium text-gray-900 ">
              Piirkond/maakond
            </label>
            <div className="relative ">
              <input
                disabled={!isEditing}
                type="text"
                className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                placeholder={item.county}
                value={item.county}
                onChange={(e) =>
                  setAccount({
                    ...account,
                    locations: account.locations.map((el) =>
                      el.id === item.id ? { ...el, county: e.target.value } : el
                    ),
                  })
                }
              />
            </div>
            <div className="flex gap-1">
              <div className="w-full">
                <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 ">
                  Asula
                </label>
                <div className="relative ">
                  <input
                    disabled={!isEditing}
                    type="text"
                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                    placeholder={item.municipality}
                    value={item.municipality}
                    onChange={(e) =>
                      setAccount({
                        ...account,
                        locations: account.locations.map((el) =>
                          el.id === item.id
                            ? { ...el, municipality: e.target.value }
                            : el
                        ),
                      })
                    }
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 ">
                  Linnaosa
                </label>
                <div className="relative ">
                  <input
                    disabled={!isEditing}
                    type="text"
                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                    placeholder={item.district}
                    value={item.district}
                    onChange={(e) =>
                      setAccount({
                        ...account,
                        locations: account.locations.map((el) =>
                          el.id === item.id
                            ? { ...el, district: e.target.value }
                            : el
                        ),
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 ">
              Täpsusta asukohta
            </label>
            <div className="relative ">
              <input
                disabled={!isEditing}
                type="text"
                className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                placeholder={item.specification}
                value={item.specification}
                onChange={(e) =>
                  setAccount({
                    ...account,
                    locations: account.locations.map((el) =>
                      el.id === item.id
                        ? { ...el, specification: e.target.value }
                        : el
                    ),
                  })
                }
              />
            </div>
            <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 ">
              Asukoha link
            </label>
            <div className="relative ">
              <input
                disabled={!isEditing}
                type="text"
                className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                placeholder={item.link}
                value={item.link}
                onChange={(e) =>
                  setAccount({
                    ...account,
                    locations: account.locations.map((el) =>
                      el.id === item.id ? { ...el, link: e.target.value } : el
                    ),
                  })
                }
              />
            </div>
          </>
        ))}

        <p className="pt-2 mt-4 font-bold border-t">Keeled</p>
        <label className="block my-2 text-sm font-medium text-gray-900 ">
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
        <label className="block my-2 text-sm font-medium text-gray-900 ">
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
        <p className="pt-2 mt-4 font-bold border-t">Lisainfo</p>

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
    </Layout>
  );
};

export default AccountData;
