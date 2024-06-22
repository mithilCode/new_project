import { Route, Routes } from "react-router-dom";
import { appRoute } from "./appRoute";
import PrivateRouter from "./PrivateRouter";
import PublicRouter from "./PublicRouter ";
import NotFound from "../Views/notFound/notFound";

const index = () => {
  return (
    <Routes>
      {appRoute?.map((item, index) => {
        return item?.isPublic === false ? (
          <Route
            key={index}
            path={item?.path}
            element={<PrivateRouter>{item.element}</PrivateRouter>}
          />
        ) : (
          <Route
            key={index}
            path={item?.path}
            element={<PublicRouter>{item.element}</PublicRouter>}
          />
        );
      })}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default index;
