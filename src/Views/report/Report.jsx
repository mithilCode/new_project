import Layout from "../../Components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { getReportList } from "../../Redux/reducers/report.slice";
import { useEffect } from "react";
import Loader from "../../Components/Loader";
import DataTable from "react-data-table-component";
const Report = () => {
  const dispatch = useDispatch();
  const { reportData, loading } = useSelector(({ reportList }) => reportList);
  useEffect(() => {
    dispatch(getReportList());
  }, []);
  const columns = [
    {
      name: <p>Sr. No.</p>,
      cell: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Image",
      selector: (row) => (
        <div className="table_img">
          {row?.report_image !== "" ? (
            <img src={row?.report_image} alt="Image" />
          ) : (
            "No Image"
          )}
        </div>
      ),
      width: "150px",
    },
    {
      name: "Issue",
      sortable: true,
      selector: (row) => row.issue,
    },
    {
      name: "Notes",
      sortable: true,
      selector: (row) => row.notes,
    },
  ];
  return (
    <>
      {loading && <Loader />}
      <Layout>
        <DataTable
          columns={columns}
          data={reportData}
          fixedHeader
          pagination
          title="Report List"
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
      </Layout>
    </>
  );
};

export default Report;
