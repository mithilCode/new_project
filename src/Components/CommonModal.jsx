/* eslint-disable react/prop-types */
import { Modal, Box } from "@mui/material";
import { memo } from "react";

const CommonModal = ({ open, handleClose, title, handleProceed }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 4,
    p: 3,
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style} className="modal_content">
        <p className="modal_content_title">{title}</p>
        <div className="confirm_btn">
          <button className="proceed_btn" onClick={handleProceed}>
            Yes
          </button>
          <button className="cancle_btn" onClick={handleClose}>
            No
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default memo(CommonModal);
