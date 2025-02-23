"use client";

import NavBar from "./NavBarLog";
import Sidebar from "./SideBar";

const WrapContent = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      
      <Sidebar />

      
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflow: "hidden", 
        }}
      >
        
        <NavBar />

        {/* Scrollable content area */}
        <main
          style={{
            flexGrow: 1,
            padding: "16px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default WrapContent;
