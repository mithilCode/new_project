
import { Link } from "react-router-dom"
import  notfoundImg from "../../assets/images/404.png"
const NotFound = () => {
  return (
    <div className="notfound">
      <img src={notfoundImg} alt="" />
     <h3> <Link to="/">Go to Home</Link></h3>
    </div>
  )
}

export default NotFound