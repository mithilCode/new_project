import { CirclesWithBar} from "react-loader-spinner";
import "../assets/style/Layout.scss";
const Loader = () => {
  return (
    <div className="loader_set">
      <CirclesWithBar
        height="100"
        width="100"
        color="#10383c"
        outerCircleColor="#10383c"
        innerCircleColor="#10383c"
        barColor="#10383c"
        ariaLabel="circles-with-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default Loader;
