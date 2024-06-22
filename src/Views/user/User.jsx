import { useEffect, useState } from "react";
import Layout from "../../Components/Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  approveAction,
  getUserList,
  removeUser,
  setIsVerified,
  setIsuserDelete,
} from "../../Redux/reducers/userlist.slice";
import DataTable from "react-data-table-component";
import { Icon } from "@iconify/react/dist/iconify.js";
import "./user.scss";
import { Tooltip } from "@mui/material";
import Loader from "../../Components/Loader";
import CommonModal from "../../Components/CommonModal";
import NextDelivery from "../../Components/NextDelivery";
const User = () => {
  const dispatch = useDispatch();
  const [nextDelivery, setNextDelivery] = useState({ open: false, data: null });

  const { userData, userDataLoading, isVerified, isuserDelete } = useSelector(
    ({ userList }) => userList
  );
  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);
  const columns = [
    {
      name: <p>Sr. No.</p>,
      cell: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Full Name",
      sortable: true,
      selector: (row) => row.first_name + " " + row.last_name,
      width: "200px",
    },
    {
      name: "Email",
      sortable: true,
      selector: (row) => row.email,
      width: "320px",
    },
    {
      name: "Phone Number",
      sortable: true,
      selector: (row) => row.phone_number,
      width: "200px",
    },
    {
      name: "Company",
      sortable: true,
      selector: (row) => row.company,
    },

    {
      name: "Next Delivery",
      center: "center",
      selector: (row) => (
        <Tooltip
          title="Pending"
          placement="bottom"
          arrow
          onClick={() => setNextDelivery({ open: true, data: row })}
        >
          <button className="next_day_delivery">
            <Icon icon="ph:info-fill" />
          </button>
        </Tooltip>
      ),
    },
    {
      name: "Action",
      center: "center",
      cell: (row) => (
        <div className="status">
          {row.registration === "Pending" ? (
            <div className="pending_status">
              <Tooltip title="Pending" placement="bottom" arrow>
                <button
                  className="pending"
                  onClick={() => handleOpen(row?._id)}
                >
                  <Icon icon="ic:round-pending-actions" />
                </button>
              </Tooltip>
            </div>
          ) : (
            <Tooltip title="Verified" placement="bottom" arrow>
              <button className="verified">
                <Icon icon="mdi:approve" />
              </button>
            </Tooltip>
          )}
          <Tooltip title="Remove" placement="bottom" arrow>
            <button
              className="remove_btn"
              onClick={() => handleModalOpen(row?._id)}
            >
              <Icon icon="mdi:delete" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState("");
  const handleClose = () => {
    setOpen(false);
    setUserId("");
  };
  const handleOpen = (id) => {
    setUserId(id);
    setOpen(true);
  };
  const handleModalOpen = (id) => {
    setUserId(id);
    setOpenModal(true);
  };
  const handleModalClose = () => {
    setOpenModal(false);
    setUserId("");
  };
  const handleProceed = () => {
    setOpen(false);
    dispatch(approveAction({ user_id: userId }));
  };
  const handleModalProceed = () => {
    setOpenModal(false);
    dispatch(removeUser({ user_id: userId }));
  };
  useEffect(() => {
    if (isVerified) {
      dispatch(getUserList());
      dispatch(setIsVerified(false));
    }
  }, [isVerified]);
  useEffect(() => {
    if (isuserDelete) {
      dispatch(setIsuserDelete({ status: false, id: userId }));
      setUserId("");
    }
  }, [isuserDelete]);
  return (
    <>
      {userDataLoading && <Loader />}
      <Layout>
        <DataTable
          columns={columns}
          data={userData}
          fixedHeader
          pagination
          title="User List"
          customStyles={{
            header: {
              style: {
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              },
            },
            pagination: {
              style: {
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px",
              },
            },
          }}
        />
        <CommonModal
          open={open}
          handleClose={handleClose}
          title="Are you sure you want to proceed?"
          handleProceed={handleProceed}
        />
        <CommonModal
          open={openModal}
          handleClose={handleModalClose}
          title="Are you sure you want to Remove?"
          handleProceed={handleModalProceed}
        />
      </Layout>

      <NextDelivery data={nextDelivery} setData={setNextDelivery} />
    </>
  );
};

export default User;
