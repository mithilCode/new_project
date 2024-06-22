/* eslint-disable react/prop-types */
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../assets/style/Layout.scss";
import { useState } from "react";
const Layout = ({ children }) => {
  const findWidth=window.innerWidth<450?true:false;
  const [expand, setExpand] = useState(findWidth);
  const handleExpand=(data)=>{
    setExpand(data)
  }
  return (
    <div className="layout_set">
      <Sidebar expand={expand} />
      <main className="main_section">
        <Header expanResponse={handleExpand} />
        <section className="content_set">{children}</section>
      </main>
    </div>
  );
};

export default Layout;
