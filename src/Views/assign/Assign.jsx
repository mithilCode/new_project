import { useEffect, useState } from "react";
import Layout from "../../Components/Layout";
import "./assignplant.scss";
import { Box, Modal, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getUserList } from "../../Redux/reducers/userlist.slice";
import {
  assignFarmList,
  assignPlantList,
  assignPlantToUser,
  farmDetail,
  setAssignFarmData,
  setFarmDetailData,
} from "../../Redux/reducers/assignPlant";
import Loader from "../../Components/Loader";
import { getPlantList } from "../../Redux/reducers/plant.slice";
import DataTable from "react-data-table-component";
import { Icon } from "@iconify/react/dist/iconify.js";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "400px",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "6px",
  padding: 3,
  height: "auto",
};
const plantmodalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "400px",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "6px",
  padding: 3,
  height: "auto",
};
const Assign = () => {
  const dispatch = useDispatch();
  const { loading, assignFarmData, farmDetailData, assignPlantListData } =
    useSelector(({ assignPlant }) => assignPlant);
  const { plantData, plantDataLoading } = useSelector(
    ({ plantList }) => plantList
  );
  const { userData, userDataLoading } = useSelector(({ userList }) => userList);
  const [modalOpen, setModalOpen] = useState(false);
  const [plantModal, setPlantModal] = useState(false);
  const [plantDetails, setPlantDetails] = useState("");
  const [selectData, setSelectData] = useState([]);
  const [assignUser, setAssignUser] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [flexFarmData, setFlexFarmData] = useState("");

  const handleModalClose = () => {
    setModalOpen(false);
    dispatch(setAssignFarmData([]));
    dispatch(setFarmDetailData([]));
    setAssignUser([]);
    setSelectData([]);
    setDeliveryDate("");
    setFlexFarmData("");
    setPlantDetails("");
  };

  const handleassignModal = () => {
    if (userData?.length === 0) {
      dispatch(getUserList());
    }
    setModalOpen(true);
  };
  const handleplantModalClose = () => {
    setPlantModal(false);
  };
  const handleplantModal = (data) => {
    setPlantDetails(data);
    setPlantModal(true);
  };
  const [data, setData] = useState({
    user_id: "",
    farm_id: "",
  });
  const hadleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  useEffect(() => {
    if (data?.user_id) {
      dispatch(assignFarmList({ user_id: data?.user_id }));
    }
  }, [data?.user_id]);
  useEffect(() => {
    if (data?.farm_id) {
      dispatch(
        farmDetail({
          user_id: "664effd2d97e0cd4813948e0",
          farm_id: "664de3644fac7aa182ea32f1",
        })
      );
      // dispatch(farmDetail(data));
    }
  }, [data?.farm_id]);
  useEffect(() => {
    if (plantData.length === 0) {
      dispatch(getPlantList());
    }
  }, [assignFarmData]);

  useEffect(() => {
    if (farmDetailData?.length > 0) {
      const initialPlantData = farmDetailData[0]?.plant || [];
      setSelectData(initialPlantData);

      const farmDetailDataset = initialPlantData.map(
        (item) => item?.plant_detail[0]
      );
      const transformedData = farmDetailDataset.map((item, index) => ({
        plant_id: item?._id,
        row: (index + 1).toString(),
      }));
      setAssignUser(transformedData);
    }
  }, [farmDetailData, setAssignUser]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const obj = {};
    obj.user_id = data?.user_id;
    obj.farm_id = data?.farm_id;
    (obj.plant = assignUser), (obj.delivery_date = deliveryDate);
    dispatch(assignPlantToUser(obj));
  };
  useEffect(() => {
    const farm = farmDetailData[0] && farmDetailData[0].flax_farm;
    setFlexFarmData(farm);
  }, [farmDetailData]);
  const handleCreateSelect = () => {
    if (
      (flexFarmData === "35" && selectData?.length < 3) ||
      (flexFarmData === "60" && selectData?.length < 6)
    ) {
      setSelectData([...selectData, { plant_detail: [] }]);
    }
  };

  const handleSelect = (item, value) => {
    const data = { plant_id: item, row: (value + 1).toString() };
    const isDuplicate = assignUser.some((assign) => assign.plant_id === item);

    if (isDuplicate) {
      toast.error("The Plant matches a previous item.");
    } else {
      setAssignUser((prevAssignUser) => {
        const updatedAssignUser = [...prevAssignUser];
        updatedAssignUser[value] = data;
        return updatedAssignUser;
      });
    }
  };

  useEffect(() => {
    dispatch(assignPlantList());
  }, []);
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
      name: "Plant Detail",
      center: "center",
      cell: (row) => (
        <div className="">
          <Tooltip title="Plant Detail" placement="bottom" arrow>
            <button
              className="next_day_delivery"
              onClick={() => handleplantModal(row)}
            >
              <Icon icon="fluent:open-16-filled" width="16" height="16" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      {(loading || userDataLoading || plantDataLoading) && <Loader />}
      <Layout>
        <div className="assign_plant">
          <button onClick={() => handleassignModal()}>Assign Plant</button>
        </div>
        <DataTable
          columns={columns}
          data={assignPlantListData}
          fixedHeader
          pagination
          title="Assign Plant List"
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
          open={modalOpen}
          onClose={handleModalClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={modalStyle} className="modal_content">
            <h3>Assign Plant</h3>
            <form onSubmit={handleSubmit}>
              {userData?.length > 0 && (
                <>
                  <p>Select User</p>
                  <select
                    name="user_id"
                    onChange={hadleChange}
                    value={data?.userid}
                    className="select_set"
                    required
                  >
                    <option selected hidden defaultValue>
                      Select Here
                    </option>
                    {userData?.map((item) => {
                      return (
                        <>
                          <option value={item?._id} key={item?._id}>
                            <span>
                              {item?.first_name + " " + item?.last_name}
                            </span>
                          </option>
                        </>
                      );
                    })}
                  </select>
                </>
              )}
              {assignFarmData?.length > 0 && (
                <>
                  <p>Select Farm</p>
                  <select
                    name="farm_id"
                    onChange={hadleChange}
                    className="select_set"
                    value={data?.farm_id}
                    required
                  >
                    <option selected hidden defaultValue>
                      Select Here
                    </option>
                    {assignFarmData?.map((item) => {
                      return (
                        <option value={item?._id} key={item?._id}>
                          {item?.farm_name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="form_control">
                    <label>Delivery Date</label>
                    <input
                      type="date"
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div>
                {flexFarmData&&assignFarmData?.length > 0 && (
                  <>
                    <div className="farmDetail_set">
                      <div>
                        <p>
                          Flex Farm :{" "}
                          <b>
                            {farmDetailData[0] && farmDetailData[0].flax_farm}
                          </b>
                        </p>
                      </div>
                      <button type="button" onClick={handleCreateSelect}>Add Plant</button>
                    </div>
                    
                    <p>Select Plant</p>
                    {selectData?.map((item, index) => {
                      const plant_detail = item?.plant_detail[0];
                      return (
                        <>
                          <select
                            onChange={(e) =>
                              handleSelect(e.target.value, index)
                            }
                            className="select_set"
                            required
                            key={index}
                            disabled={item && item?._id}
                          >
                            <option selected hidden defaultValue>
                              Select Here
                            </option>
                            {plantData.map((item) => (
                              <option
                                value={item._id}
                                selected={
                                  item.plant_name === plant_detail?.plant_name
                                }
                                key={item._id}
                              >
                                {item.plant_name}
                              </option>
                            ))}
                          </select>
                        </>
                      );
                    })}
                    <button type="submit" className="submit_btn">Submit</button>
                  </>
                )}
              </div>
            </form>
          </Box>
        </Modal>
        <Modal
          open={plantModal}
          onClose={handleplantModalClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={plantmodalStyle} className="modal_content">
            <p className="name_set">
              {plantDetails?.first_name + " " + plantDetails?.last_name}
            </p>
            <table className="plant-details-table">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Day</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {plantDetails?.plant_detail?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.day}</td>
                      <td>{dayjs(item?.date).format("DD-MM-YYYY")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        </Modal>
      </Layout>
    </>
  );
};

export default Assign;
