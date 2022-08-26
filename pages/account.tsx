import { useSession, signOut, signIn } from 'next-auth/react';
import React from 'react';
import Layout from '../components/Layout';

const Account = () => {
  const { data: session } = useSession();
  return (
    <Layout>
      <div>
        {session?.user ? (
          <div>
            <h1>
              Kasutaja {session?.user?.name} ({session?.user?.email})
            </h1>
            <button onClick={() => signOut()}>Logi välja</button>
          </div>
        ) : (
          <div>
            <h1>Pole sisse logitud</h1>
            <button onClick={() => signIn()}>Logi sisse</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Account;
