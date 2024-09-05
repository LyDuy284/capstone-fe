import { Button, TextField } from "@mui/material";
import React, {
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  authentication,
  firebaseNotificationConfig,
} from "../../../firebase-config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

import "./Authentication.css";
import { LoginPayload } from "../../../types/authen/Login";
import { loginUser, loginUserByGoogle } from "../../../redux/apiRequest";
import { LOGO, ROLE } from "../../../constants/consts";
interface Props {
  setRoleLogin: Dispatch<SetStateAction<string>>;
  setMessageStatus: Dispatch<SetStateAction<string>>;
  setMessage: Dispatch<SetStateAction<string>>;
}

const Login: FC<Props> = (props) => {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [messageRegister, setMessageRegister] = useState<string>("");
  const [messageLogin, setMessageLogin] = useState<string>("");

  useEffect(() => {
    if (user !== null) {
      navigate("/");
    }
    setMessageLogin("");
    setMessageRegister("");
  }, []);

  const loginHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userLogin: LoginPayload = {
        email: username,
        password: password,
      };

      const status = await loginUser(userLogin, dispatch, navigate);
      switch (status) {
        case "FAIL":
          props.setMessageStatus("red");
          props.setMessage("Tên đăng nhập hoặc mật khẩu không đúng");
          break;
        case "DISABLE":
          props.setMessageStatus("red");
          props.setMessage(
            "Tài khoản của bạn đã chưa được kích hoạt, vui lòng liên hệ chúng tôi"
          );
          break;
        case "SUCCESS":
          props.setMessageStatus("green");
          props.setMessage(
            "Đăng nhập thành công"
          );
          break;
        default:
          setMessageLogin(status);
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogle = (isRegister: boolean) => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(authentication, provider)
      .then((result) => {
        loginUserByGoogle(result, dispatch, navigate, isRegister);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div id="Authentication">
      <div className="login-cover">
        <div
          className="col-left"
          style={{
            backgroundImage:
              "url(https://firebasestorage.googleapis.com/v0/b/weddingwise-daa83.appspot.com/o/images%2Fwedding-img_login_page.jpg?alt=media&token=d94c744c-ba5f-4a5c-a91b-fc9000377782)",
          }}
        ></div>
        <form onSubmit={loginHandler} className="col-right">
          <img
            className="icon"
            src={LOGO}
            alt=""
          />
          <div className="item">
            <div className="login-header">Đăng nhập</div>
          </div>
          <div className="item">
            <div className="already-register">
              Bạn chưa có tài khoản?{" "}
              <strong
                className="register hover-primary"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Đăng ký ngay
              </strong>
            </div>
          </div>
          <div className="item">
            <input
              className="input"
              placeholder="Tên đăng nhập"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              className="input"
              placeholder="Mật khẩu"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="forgot">Quên mật khẩu?</div>
            <span className="error-message">{messageLogin}</span>
          </div>
          <div className="item">
            <Button type="submit" className="btn-login" variant="contained">
              Đăng nhập
            </Button>
          </div>
          <div className="item hover-primary">
            <div
              className="btn-login-google btn"
              onClick={() => signInWithGoogle(false)}
            >
              <img
                src="images/google-icon.svg"
                className="icon-google"
                alt="google icon"
              />
              <div className="google">Log in with Google</div>
            </div>
          </div>
          <div className="item">
            <div className="question">Bạn là nhà cung cấp?</div>
            <div
              className="vendor-login hover-primary"
              onClick={() => {
                props.setRoleLogin(ROLE.supplier);
                navigate("/register");
              }}
            >
              Đăng ký với tư cách là nhà cung cấp
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
