import Head from "next/head";
import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div className=" mt-4 max-w-[1000px] m-auto">
    <Head>
      <script src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAzVX7nLmTpt7_R76b8H-xcQ070Ox1aWTg&libraries=places`}></script>
    </Head>
    <Header />
    <div className="">{props.children}</div>
  </div>
);

export default Layout;
