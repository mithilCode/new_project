import { useEffect, useState } from "react";
import Layout from "../../Components/Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  assignFarmToUser,
  createFarm,
  deleteFarm,
  getFarmList,
  setFarmData,
  setFarmDelete,
  setUpDateData,
  updateFarm,
} from "../../Redux/reducers/farm.slice";
import DataTable from "react-data-table-component";
import Loader from "../../Components/Loader";
import { Icon } from "@iconify/react/dist/iconify.js";
import "./farm.scss";
import { Box, Modal } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getUserList } from "../../Redux/reducers/userlist.slice";
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "6px",
  padding: 3,
  height: "auto",
};
const schema = yup.object().shape({
  farm_name: yup.string().required("Farm Name is required"),
  flax_farm: yup
    .string()
    .matches(/^\d+$/, "Flax Farm must be a number")
    .required("Flax Farm is required"),
  farm_water_tank: yup
    .string()
    .matches(/^\d+$/, "Farm Water Tank must be a number")
    .required("Farm Water Tank is required"),
  farm_image: yup.mixed(),
});

const Farm = () => {
  const dispatch = useDispatch();
  const { farmData, loading, isFarmDelete, isFarmAssign } = useSelector(
    ({ farmList }) => farmList
  );
  const { userData } = useSelector(({ userList }) => userList);
  const [modalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("add");
  const [userId, setUserId] = useState("");
  const [assignData, setAssignData] = useState({
    user_id: "",
    farm_id: "",
  });
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    dispatch(getFarmList());
  }, []);

  const columns = [
    {
      name: <p>Sr. No.</p>,
      cell: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Farm Image",
      selector: (row) => (
        <div className="table_img">
          {row.farm_image !== "" ? (
            <img src={row.farm_image} alt="Image" />
          ) : (
            "No Image"
          )}
        </div>
      ),
      width: "150px",
    },
    {
      name: "Flex Farm",
      sortable: true,
      selector: (row) => row.flax_farm,
    },
    {
      name: "Farm Name",
      sortable: true,
      selector: (row) => row.farm_name,
    },
    {
      name: "Farm Water Tank",
      sortable: true,
      selector: (row) => row.farm_water_tank,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="action_btn_group">
          <button
            className="delete_btn"
            onClick={() => {
              handleOpen(), setUserId(row?._id);
            }}
          >
            <Icon icon="material-symbols:delete" />
          </button>
          <button
            className="update_btn"
            onClick={() => {
              handleModalOpen("update", row);
            }}
          >
            <Icon icon="ci:note-edit" />
          </button>
        </div>
      ),
    },
  ];
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleassignModal = () => {
    if (userData?.length === 0) {
      dispatch(getUserList());
    }
    setAssignModal(true);
  };
  const handleModalOpen = (status, data) => {
    setModalOpen(true);
    setUserId("");
    setModalStatus(status);
    if (status === "update") {
      setUserId(data?._id);
      setValue("farm_name", data?.farm_name);
      setValue("flax_farm", data?.flax_farm);
      setValue("farm_water_tank", data?.farm_water_tank);
    } else {
      reset();
    }
  };
  const onSubmit = async (data) => {
    const obj=data;
    if (modalStatus === "add") {
      await dispatch(createFarm(obj)).then((res) => {
        if (res?.payload) {
          dispatch(setFarmData(res?.payload));
          setModalOpen(false);
        }
      });
    } else {
      obj.farm_id=userId
      await dispatch(updateFarm(obj)).then((res) => {
        if (res?.payload) {
          dispatch(setUpDateData(res?.payload));
          setModalOpen(false);
        }
      });
    }
  };
  const handleProceed = () => {
    dispatch(deleteFarm({ farm_id: userId }));
    setOpen(false);
  };
  useEffect(() => {
    if (isFarmDelete) {
      dispatch(setFarmDelete({ userId, success: false }));
      setUserId("");
    }
  }, [isFarmDelete]);
  const handleAssign = (e) => {
    e.preventDefault();
    dispatch(assignFarmToUser(assignData));
  };
  const handleselect = (e) => {
    const { name, value } = e.target;
    setAssignData({
      ...assignData,
      [name]: value,
    });
  };
  const handleassignModalClose = () => {
    setAssignModal(false);
    setAssignData({
      user_id: "",
      farm_id: "",
    });
  };
  useEffect(() => {
    if (isFarmAssign) {
      setAssignModal(false);
    }
  }, [isFarmAssign]);

  return (
    <>
      {loading && <Loader />}
      <Layout>
        <div className="add_farm_list">
          <button onClick={() => handleModalOpen("add")}>Add Farm</button>
          <button onClick={() => handleassignModal()}>
            Assign Farm to User
          </button>
        </div>
        <DataTable
          columns={columns}
          data={farmData}
          fixedHeader
          pagination
          title="Farm List"
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
        <Modal
          open={assignModal}
          onClose={handleassignModalClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={modalStyle} className="modal_content">
            <h3>Assign Farm to user</h3>
            <form className="select_menu" onSubmit={handleAssign}>
              <p>Select User</p>
              <select
                name="user_id"
                className="select_set"
                value={assignData?.user_id}
                onChange={handleselect}
                required
              >
                <option selected hidden defaultValue>
                  Select Here
                </option>
                {userData?.map((item) => {
                  return (
                    <>
                      <option value={item?._id} key={item?._id}>
                        <span>{item?.first_name + " " + item?.last_name}</span>
                      </option>
                    </>
                  );
                })}
              </select>
              <p>Select Farm</p>
              <select
                name="farm_id"
                className="select_set"
                value={assignData?.farm_id}
                onChange={handleselect}
                required
              >
                <option selected hidden defaultValue>
                  Select Here
                </option>
                {farmData?.map((item) => {
                  return (
                    <option value={item?._id} key={item?._id}>
                      {item?.farm_name}
                    </option>
                  );
                })}
              </select>
              <button>Submit</button>
            </form>
          </Box>
        </Modal>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={modalStyle} className="modal_content">
            <p className="modal_content_title">
              Are you sure you want to Remove?
            </p>
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
        <Modal
          open={modalOpen}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <h4>{modalStatus === "add" ? "Add Farm" : "Update Farm"}</h4>
            <div className="modal_content_scroll">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* <div className="form_control">
                  <label>Farm Image</label>
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={(e) => {
                      handleImageChange(e);
                      register("farm_image").onChange(e);
                    }}
                  />
                  {errors.farm_image && (
                    <p className="error_show">{errors.farm_image.message}</p>
                  )}
                </div> */}
                <div className="form_control">
                  <label>Farm Name</label>
                  <input
                    type="text"
                    {...register("farm_name", {
                      required: "Farm Name is required",
                    })}
                  />
                  {errors.farm_name && (
                    <p className="error_show">{errors.farm_name.message}</p>
                  )}
                </div>

                <div className="flax_farm_select_menu">
                  <p>Flax Farm</p>
                  <select
                    className="select_set"
                    name="flax_farm"
                    {...register("flax_farm", {
                      required: "Flax Farm is required",
                    })}
                    required
                  >
                    <option selected hidden defaultValue>
                      Select Here
                    </option>
                    <option value="35">35</option>
                    <option value="60">60</option>
                  </select>
                  {errors.flax_farm && (
                    <p className="error_show">{errors.flax_farm.message}</p>
                  )}
                </div>

                <div className="form_control">
                  <label>Farm Water Tank</label>
                  <input
                    type="text"
                    {...register("farm_water_tank", {
                      required: "Farm Water Tank is required",
                    })}
                  />
                  {errors.farm_water_tank && (
                    <p className="error_show">
                      {errors.farm_water_tank.message}
                    </p>
                  )}
                </div>

                <button type="submit">
                  {modalStatus === "add" ? "Add Data" : "Update Data"}
                </button>
              </form>
            </div>
          </Box>
        </Modal>
      </Layout>
    </>
  );
};

export default Farm;
