import { useEffect, useState } from "react";
import Layout from "../../Components/Layout";
import {
  createPlant,
  deletePlant,
  getPlantList,
  setPlantData,
  setPlantDelete,
  setUpDateData,
  updatePlant,
} from "../../Redux/reducers/plant.slice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Components/Loader";
import DataTable from "react-data-table-component";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Box, Modal } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
  maxHeight: "90%",
  overflowY: "auto",
};
const schema = yup.object().shape({
  plant_category: yup.string().required("Plant Category is required"),
  plant_title: yup.string().required("Plant Title is required"),
  plant_name: yup.string().required("Plant Name is required"),
  plant_code: yup.string().required("Plant Code is required"),
  time_of_germinate: yup.string().required("Time of Germinate is required"),
  time_of_harvest: yup.string().required("Time of Harvest is required"),
  description: yup.string().required("Description is required"),
});
const Plant = () => {
  const dispatch = useDispatch();
  const { plantData, plantDataLoading, isPlantDelete } = useSelector(
    ({ plantList }) => plantList
  );
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const [vectorImage, setVectorImage] = useState(null);
  const [reaclImage, setReaclImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("add");
  useEffect(() => {
    dispatch(getPlantList());
  }, []);
  const columns = [
    {
      name: <p>Sr. No.</p>,
      cell: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Plant Image",
      selector: (row) => (
        <div className="table_img">
          {row.plant_image !== "" ? (
            <img src={row.plant_image} alt="Image" />
          ) : (
            "No Image"
          )}
        </div>
      ),
      width: "150px",
    },
    {
      name: "Plant Name",
      sortable: true,
      selector: (row) => row.plant_name,
    },
    {
      name: "Plant Title",
      sortable: true,
      selector: (row) => row.plant_title,
    },
    {
      name: "Plant code",
      sortable: true,
      selector: (row) => row.plant_code,
      width: "120px",
    },
    {
      name: "Time of Germinate",
      sortable: true,
      selector: (row) => row.time_of_germinate,
    },
    {
      name: "Time of Harvest",
      sortable: true,
      selector: (row) => row.time_of_harvest,
    },
    {
      name: "Plant Category",
      sortable: true,
      selector: (row) => row.plant_category,
    },
    {
      name: "Description",
      sortable: true,
      selector: (row) => row.description,
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
  const handleProceed = () => {
    dispatch(deletePlant({ plant_id: userId }));
    setOpen(false);
  };
  useEffect(() => {
    if (isPlantDelete) {
      dispatch(setPlantDelete({ userId, success: false }));
      setUserId("");
    }
  }, [isPlantDelete]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleRealImage = (event) => {
    const file = event.target.files[0];
    setReaclImage(file);
  };
  const handleVectorImage = (event) => {
    const file = event.target.files[0];
    setVectorImage(file);
  };
  const handleModalOpen = (status, data) => {
    setModalOpen(true);
    setUserId("");
    setVectorImage(data?.plant_vectorimage ?? "");
    setReaclImage(data?.plant_realimage ?? "");
    setModalStatus(status);
    if (status === "update") {
      setUserId(data?._id);
      setValue("plant_category", data?.plant_category);
      setValue("plant_title", data?.plant_title);
      setValue("plant_name", data?.plant_name);
      setValue("plant_code", data?.plant_code);
      setValue("time_of_germinate", data?.time_of_germinate);
      setValue("time_of_harvest", data?.time_of_harvest);
      setValue("description", data?.description);
    } else {
      reset();
    }
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("plant_image_1", vectorImage);
    formData.append("plant_image_2", reaclImage);
    formData.append("plant_title", data?.plant_title);
    formData.append("plant_category", data?.plant_category);
    formData.append("plant_name", data?.plant_name);
    formData.append("plant_code", data?.plant_code);
    formData.append("time_of_germinate", data?.time_of_germinate);
    formData.append("time_of_harvest", data?.time_of_harvest);
    formData.append("description", data?.description);
    if (modalStatus === "add") {
      await dispatch(createPlant(formData)).then((res) => {
        if (res?.payload) {
          dispatch(setPlantData(res?.payload));
          setModalOpen(false);
        }
      });
    } else {
      formData.append("plant_id", userId);
      await dispatch(updatePlant(formData)).then((res) => {
        if (res?.payload) {
          dispatch(setUpDateData(res?.payload));
          setModalOpen(false);
        }
      });
    }
  };
  return (
    <>
      {plantDataLoading && <Loader />}
      <Layout>
        <div className="add_farm_list">
          <button onClick={() => handleModalOpen("add")}>Add Plant</button>
        </div>
        <DataTable
          columns={columns}
          data={plantData}
          fixedHeader
          pagination
          title="Plant List"
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
            <h4>{modalStatus === "add" ? "Add Plant" : "Update Plant"}</h4>
            <div className="modal_content_scroll">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form_control">
                  <label> Vector image </label>
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    {...register("plant_image_1", {
                      required: "Plant Image is required",
                      onChange: handleVectorImage,
                    })}
                  />
                </div>
                <div className="form_control">
                  <label> Real image </label>
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    {...register("plant_image_2", {
                      required: "Plant Image is required",
                      onChange: handleRealImage,
                    })}
                  />
                </div>
                <div className="form_control">
                  <label>Plant Title</label>
                  <input
                    type="text"
                    {...register("plant_title", {
                      required: "Plant Title is required",
                    })}
                  />
                  {errors.plant_title && (
                    <p className="error_show">{errors.plant_title.message}</p>
                  )}
                </div>

                <div className="form_control">
                  <label>Plant Category</label>
                  <input
                    type="text"
                    {...register("plant_category", {
                      required: "Plant Name is required",
                    })}
                  />
                  {errors.plant_category && (
                    <p className="error_show">
                      {errors.plant_category.message}
                    </p>
                  )}
                </div>
                <div className="form_control">
                  <label>Plant Name</label>
                  <input
                    type="text"
                    {...register("plant_name", {
                      required: "Plant Name is required",
                    })}
                  />
                  {errors.plant_name && (
                    <p className="error_show">{errors.plant_name.message}</p>
                  )}
                </div>

                <div className="form_control">
                  <label>Plant Code</label>
                  <input
                    type="text"
                    {...register("plant_code", {
                      required: "Plant Code is required",
                    })}
                  />
                  {errors.plant_code && (
                    <p className="error_show">{errors.plant_code.message}</p>
                  )}
                </div>

                <div className="form_control">
                  <label>Time of Germinate</label>
                  <input
                    type="text"
                    {...register("time_of_germinate", {
                      required: "Time of Germinate is required",
                    })}
                  />
                  {errors.time_of_germinate && (
                    <p className="error_show">
                      {errors.time_of_germinate.message}
                    </p>
                  )}
                </div>

                <div className="form_control">
                  <label>Time of Harvest</label>
                  <input
                    type="text"
                    {...register("time_of_harvest", {
                      required: "Time of Harvest is required",
                    })}
                  />
                  {errors.time_of_harvest && (
                    <p className="error_show">
                      {errors.time_of_harvest.message}
                    </p>
                  )}
                </div>

                <div className="form_control">
                  <label>Description</label>
                  <input
                    type="text"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                  {errors.description && (
                    <p className="error_show">{errors.description.message}</p>
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

export default Plant;
