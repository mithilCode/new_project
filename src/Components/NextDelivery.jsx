/* eslint-disable react/prop-types */
import { Icon } from "@iconify/react/dist/iconify.js";
import { Modal, Box, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { memo, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch,useSelector } from "react-redux";
import { deliveryDateEdit } from "../Redux/reducers/userlist.slice";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 991,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 4,
  p: 3,
  height: "auto",
  maxHeight: "500px",
  overflowY: "auto",
};

const NextDelivery = ({ data, setData }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(
    ({ userList }) => userList
  );
  const [open, setOpen] = useState(false);
  const [dateData, setDateData] = useState();
  const [userId, setUserId] = useState();
  const handleOpen = (data, id) => {
    setDateData(data);
    setUserId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDateChange = (newDate) => {
    setDateData(newDate);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const obj = {
      delivery_date: dayjs(dateData).format("DD/MM/YYYY"),
      _id: userId?._id,
      user_id: userId?.user_id,
    };
    dispatch(deliveryDateEdit(obj));
    handleClose();
  };

  return (
    <>
      <Modal
        open={data.open}
        onClose={() => setData({ open: false, data: null })}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style} className="modal_content">
          <p className="modal_content_title">
            Next Delivery{" "}
            <span className="user_name">
              ({data.data?.first_name} {data.data?.last_name})
            </span>
          </p>
          <div className="next_day_delivery_container">
            <table className="delivery-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Date</th>
                  <th>Plant Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.delivery_data?.map((deliveryItem, index) =>
                  deliveryItem.next_delivery.map((delivery, idx) => {
                    return (
                      <tr key={`${index}-${idx}`}>
                        {idx === 0 && (
                          <td rowSpan={deliveryItem.next_delivery.length}>
                            {deliveryItem.day}
                          </td>
                        )}
                        <td className="edit_date">
                          {delivery.date}
                          <Tooltip title="Edit" placement="bottom" arrow>
                            <button
                              className="edit"
                              onClick={() =>
                                handleOpen(delivery.date, deliveryItem)
                              }
                            >
                              <Icon icon="lucide:edit" />
                            </button>
                          </Tooltip>
                        </td>
                        {delivery.plant_details.length > 0 ? (
                          <>
                            <td>{delivery.plant_details[0].plant_name}</td>
                            <td>{delivery.plant_details[0].quantity}</td>
                          </>
                        ) : (
                          <>
                            <td colSpan="2">
                              No plants scheduled for delivery
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Box>
      </Modal>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 500 }}>
          <form onSubmit={handleSubmit} className="date_picker_set">
            <label>Date</label>
            <input
              type="date"
              value={dayjs(dateData).format("YYYY-MM-DD")}
              onChange={(e) => handleDateChange(e.target.value)}
            />
            <button>Submit</button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

const PlantDetails = ({ data }) => {
  const columns = [
    {
      name: "Plant Name",
      selector: (row) => row.plant_name,
    },
    {
      name: "Quantity",
      sortable: true,
      selector: (row) => row.quantity,
    },
  ];
  return (
    <div className="subrow_container">
      <DataTable
        columns={columns}
        data={data?.plant_details ?? []}
        noHeader={true}
        customStyles={{
          table: {
            style: {
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            },
          },
          headCells: {
            style: {
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
            },
          },
          cells: {
            style: {
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
            },
          },
        }}
      />
    </div>
  );
};

export default memo(NextDelivery);
