import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div className="border mt-4 max-w-[750px] m-auto">
    <Header />
    <div className="">{props.children}</div>
  </div>
);

export default Layout;
