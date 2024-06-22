import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./Login.scss";
import logo from "../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAction } from "../../Redux/reducers/auth.slice";
import { Oval } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address.")
    .required("Email is required."),
  password: yup.string().required("Password is required."),
});

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordIcon, setPasswordIcon] = useState(false);
  const handlePassword = () => {
    setPasswordIcon(!passwordIcon);
  };
  const { authLoading, isUserLogin } = useSelector(({ auth }) => auth);
  const {
    register,
    handleSubmit,

    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    setPasswordIcon(false)
    dispatch(loginAction(data));
  };
  useEffect(() => {
    if (isUserLogin) {
      navigate("/");
    }
  }, [isUserLogin]);
  return (
    <div className="login_form">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="login_logo">
          <img src={logo} alt="" />
        </div>
        <div className="form_control">
          <label>Email</label>
          <input {...register("email", { required: true })} type="email" />
          {(errors.email || touchedFields?.email) && (
            <p className="error_show">{errors?.email?.message}</p>
          )}
        </div>
        <div className="form_control">
          <label>Password</label>
          <div className="password_field">
            <input
              {...register("password", { required: true })}
              type={passwordIcon ? "text" : "password"}
            />
            <div className="password_icon" onClick={handlePassword}>
              {passwordIcon ? (
                // <Icon icon="mdi:show" />
                <Icon icon="mynaui:lock-open-password" />
              ) : (
                // <Icon icon="mdi:hide" />
                <Icon icon="mynaui:lock-password" />
              )}
            </div>
          </div>
          {(errors.password || touchedFields?.password) && (
            <p className="error_show">{errors?.password?.message}</p>
          )}
        </div>
        <button>
          {authLoading ? (
            <div className="loader_set_btn">
              <Oval
                visible={true}
                height="20"
                width="20"
                color="#fff"
                ariaLabel="oval-loading"
              />
              <span>Loading...</span>
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}
