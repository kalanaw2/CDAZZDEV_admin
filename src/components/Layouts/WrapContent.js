"use client";

import NavBar from "./NavBarLog";
import Sidebar from "./SideBar";

const WrapContent = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flexGrow: 1 }}>
        <NavBar />
        <main style={{ flexGrow: 1, padding: "16px" }}>{children}</main>
      </div>
    </div>
  );
};

export default WrapContent;
