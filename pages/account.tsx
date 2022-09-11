import { GetServerSideProps, NextPage } from 'next';
import { useSession, signOut, signIn, getSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { Sidebar } from '../components/AccountComponents/Sidebar';
import Layout from '../components/Layout';
import prisma from '../lib/prisma';
import { Social, User } from '../types';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  const account: User = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
    include: {
      socials: true,
    },
  });

  return {
    props: { account: JSON.parse(JSON.stringify(account)) },
  };
};

const Account: NextPage<{ account: User }> = ({ account }) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [accountData, setAccountData] = useState<User>(account);
  const [newSocial, setNewSocial] = useState<Social>();
  // console.log(accountData.socials);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await fetch('/api/update-account', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
    setIsEditing(false);
    return await result.json();
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    social: Social
  ) => {
    const newState = accountData.socials.map((obj) => {
      if (obj.name === social.name) {
        return {
          ...obj,
          link: e.target.value,
          name: social.name,
        };
      }

      return obj;
    });
    setAccountData({ ...accountData, socials: newState });
  };

  return (
    <Layout>
      <div className="flex mt-4 mx-auto w-max">
        <Sidebar />
        {/* Account detail component */}
        <div className="ml-4 rounded-md p-4 shadow-md w-full">
          {session?.user ? (
            <div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`border py-2 px-4 rounded-md transition-all ease-in float-right ${
                  isEditing && 'text-white bg-blue-500'
                }`}
              >
                Muuda
              </button>

              <div className="flex items-center space-x-6">
                <p>
                  Meiliaadress <em>{account?.email}</em>
                </p>
                <img
                  className="w-20 h-20 rounded-full shadow-md"
                  src={
                    account?.image &&
                    'https://st2.depositphotos.com/4111759/12123/v/450/depositphotos_121232442-stock-illustration-male-default-placeholder-avatar-profile.jpg?forcejpeg=true'
                  }
                />
              </div>

              <h1 className="font-bold my-2">Kontakt</h1>
              <form onSubmit={handleSubmit}>
                <div className="flex gap-2 items-center  justify-between">
                  <label>Telefon</label>
                  <input
                    disabled={!isEditing}
                    type={'number'}
                    onChange={(e) =>
                      setAccountData({ ...accountData, phone: e.target.value })
                    }
                    value={accountData.phone}
                    className={`w-7/12 px-2 py-1 rounded-md mb-2 ${
                      isEditing ? 'border' : 'italic'
                    }`}
                  />
                </div>
                {accountData?.socials?.map((social) => (
                  <div
                    key={social.id}
                    className="flex gap-2 items-center  justify-between"
                  >
                    <label>{social.name}</label>
                    <input
                      disabled={!isEditing}
                      value={social.link || 'Määramata'}
                      onChange={(e) => handleChange(e, social)}
                      type={'text'}
                      className={`w-7/12 px-2 py-1 rounded-md mb-2 ${
                        isEditing ? 'border' : 'italic'
                      }`}
                    />
                  </div>
                ))}
                {isEditing && (
                  <>
                    <div className="flex gap-2 items-center  mb-2 ">
                      <select
                        className="border rounded-md px-2 py-1"
                        onChange={(e) =>
                          setNewSocial({ ...newSocial, name: e.target.value })
                        }
                      >
                        <option></option>
                        <option>Instagram</option>
                        <option>Twitter</option>
                        <option>Facebook</option>
                        <option>Snapchat</option>
                      </select>
                      <input
                        type={'text'}
                        className={`w-7/12 px-2 py-1 rounded-md  border  ml-auto`}
                        onChange={(e) =>
                          setNewSocial({ ...newSocial, link: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        className="w-8 h-8 bg-green-200 text-green-500 rounded-md font-bold text-center "
                        onClick={() =>
                          setAccountData({
                            ...accountData,
                            socials: [
                              ...accountData.socials,
                              { ...newSocial, userId: accountData.id },
                            ],
                          })
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white rounded-md px-4 py-2"
                    >
                      Salvesta
                    </button>
                  </>
                )}
              </form>
              <button
                onClick={() => signOut()}
                className={`border border-red-500 text-red-500 py-2 px-4 rounded-md transition-all ease-in  float-right hover:bg-red-500 hover:text-white`}
              >
                Logi välja
              </button>
            </div>
          ) : (
            <div>
              <h1>Pole sisse logitud</h1>
              <button onClick={() => signIn()}>Logi sisse</button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Account;
