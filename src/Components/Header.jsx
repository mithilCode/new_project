/* eslint-disable react/prop-types */
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import Box from "@mui/material/Box";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLogin } from "../Redux/reducers/auth.slice";
import CommonModal from "./CommonModal";
import { useMediaQuery } from "@mui/material";
import { logout } from "../Redux/action";
const Header = ({ expanResponse }) => {
  const findWidth = window.innerWidth < 450 ? true : false;
  const [expand, setExpand] = useState(findWidth);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleExpand = () => {
    setExpand(!expand);
    expanResponse(!expand);
  };
  const handleClick = () => {
    setOpenMenu((prev) => !prev);
  };
  const handleProceed = () => {
    localStorage.clear();
    dispatch(setIsLogin(false));
    navigate("/login");
    dispatch(logout());
  };
  const handleClickAway = () => {
    setOpenMenu(false);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const is767 = useMediaQuery("(max-width: 767px)");

  const styles = {
    position: "absolute",
    top: 35,
    right: 0,
    left: 0,
    zIndex: 1,
    border: "1px solid lightgray",
    p: 1,
    bgcolor: "background.paper",
    borderRadius: "6px",
    cursor: "pointer",
  };

  return (
    <div
      className={`header_set ${is767 && expand ? "header_expanded" : "header_collpsed"}`}
    >
      <div className="expan_icon" onClick={handleExpand}>
        {expand ? (
          <Icon icon="lets-icons:expand-right-double" />
        ) : (
          <Icon icon="lets-icons:expand-left-double" />
        )}
      </div>
      <div className="user_set">
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ position: "relative" }}>
            <button type="button" className="menu_btn" onClick={handleClick}>
              <Icon icon="guidance:user-1" />
            </button>
            {openMenu ? (
              <Box sx={styles} onClick={handleOpen}>
                Logout
              </Box>
            ) : null}
          </Box>
        </ClickAwayListener>
        <CommonModal
          open={open}
          handleClose={handleClose}
          handleProceed={handleProceed}
          title={"Are you sure you want to log out?"}
        />
      </div>
    </div>
  );
};

export default Header;
