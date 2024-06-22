/* eslint-disable react/prop-types */
import logo from "../assets/images/logo_1.png";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Tooltip, useMediaQuery } from "@mui/material";
import { NavLink } from "react-router-dom";
const Sidebar = ({ expand }) => {
  const is767 = useMediaQuery("(min-width: 767px)");

  const navigation = [
    {
      id: 1,
      name: "User",
      path: "/",
      icon: <Icon icon="la:user-edit" />,
    },
    {
      id: 2,
      name: "Farm",
      path: "/farm",
      icon: <Icon icon="game-icons:farmer" />,
    },
    {
      id: 3,
      name: "Plant",
      path: "/plant",
      icon: <Icon icon="ph:plant-thin" />,
    },
    {
      id: 4,
      name: "Report",
      path: "/report",
      icon: <Icon icon="mdi:report-box-outline" />,
    },
    {
      id: 5,
      name: "Assign Plant",
      path: "/assign",
      icon: <Icon icon="clarity:cursor-hand-click-line" />,
    },
  ];
  
  return (
    <div
      className={`side_bar ${is767 ? (expand ? "side_bar_half" : "side_bar_full") : expand ? "side_bar_expanded" : "side_bar_hidden"}`}
    >
      <div className="sidebar_logo">
        <img src={logo} alt="" />
      </div>
      <hr className="line_set"></hr>
      <ul className="sidebar_menuList">
        {navigation?.map((item) => {
          return (
            <li key={item?.id} className="list_set">
              <Tooltip title={expand ? item?.name : ""} placement="right" arrow>
                <NavLink
                  className={`${expand ? "icon_set" : ""}`}
                  to={item?.path}
                >
                  <p>{item?.icon}</p>
                  <p className={`list_name ${expand ? "hide" : ""}`}>
                    {item?.name}
                  </p>
                </NavLink>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
