import {
  Autocomplete,
  Button,
  TextField,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import React, {
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  authentication,
} from '../../../firebase-config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import './Authentication.css';
import {
  checkEmailExist,
  loginUserByGoogle,
  registerCouple,
  registerSupplier,
} from '../../../redux/apiRequest';
import {
  RegisterCouplePayload,
  RegisterSupplierPayload,
} from '../../../types/authen/Register';
import { LOGO, ROLE } from '../../../constants/consts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
interface Props {
  setMessageStatus: Dispatch<SetStateAction<string>>;
  setMessage: Dispatch<SetStateAction<string>>;
  roleLogin: String;
}

const categories = [
  { label: 'Đồ cưới' },
  { label: 'Dạm ngõ' },
  { label: 'Chụp hình' },
  { label: 'Địa điểm tổ chức' },
  { label: 'Thiệp mời' },
  { label: 'Lễ vật' },
  { label: 'Xe đón dâu' },
  { label: 'Cổng cưới' },
  { label: 'Gia tiên' },
  { label: 'Âm thanh' },
  { label: 'Ăn uống' },
  { label: 'Make up' },
];

const Register: FC<Props> = (props) => {
  const user = useSelector((state: any) => state.auth.login.currentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [partnerName1, setPartnerName1] = useState<string>('');
  const [partnerName2, setPartnerName2] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [weddingDate, setWeddingDate] = useState<string>('');

  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPersonName, setContactPersonName] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [supplierAddress, setSupplierAddress] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');

  const [isInput, setIsInput] = useState<boolean>(false);

  const CustomDropdown = () => {
    return (
      <ThemeProvider theme={theme}>
        <Autocomplete
          options={categories}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Dịch vụ cung cấp"
              variant="outlined"
            />
          )}
          onChange={(event, value) =>
            setSupplierName(value ? value.label : categories[0].label)
          }
        />
      </ThemeProvider>
    );
  };

  useEffect(() => {
    if (user !== null) {
      navigate('/');
    }
    props.setMessage('');
    console.log(props.roleLogin);
  }, [props.roleLogin]);

  const handlePasswordConfirmation = async () => {
    const checkEmail = await checkEmailExist(username);
    if (!checkEmail) {
      if (password === confirmPassword) {
        setIsInput(true);
      } else {
        props.setMessage('Mật khẩu không giống nhau');
        props.setMessageStatus('red');
      }
    } else {
      props.setMessage('Email đã được sử dụng');
      props.setMessageStatus('red');
    }
  };

  const registerHandler = async (e: FormEvent) => {
    let checkPhone = true;
    if (!/^\d*$/.test(phoneNumber)) {
      props.setMessageStatus("red");
      props.setMessage(
        "Số điện thoại không thể chứa ký tự"
      );
      checkPhone = false;
    }
    // Check if the input length is exactly 10 digits
    else if (phoneNumber.length !== 10) {
      props.setMessageStatus("red");
      props.setMessage(
        "Vui lòng nhập 10 số"
      );
      checkPhone = false;
    }

    e.preventDefault();
    if (checkPhone) {
      try {
        switch (props.roleLogin) {
          case ROLE.supplier:
            const supplierRegister: RegisterSupplierPayload = {
              email: username,
              name: name,
              address: address,
              contactEmail: contactEmail,
              contactPersonName: contactPersonName,
              contactPhone: contactPhone,
              password: password,
              phoneNumber: phoneNumber,
              supplierAddress: supplierAddress,
              supplierName: supplierName,
            };
            await registerSupplier(supplierRegister, dispatch, navigate);
            props.setMessageStatus("green");
            props.setMessage(
              "Đăng ký thành công, VUI LÒNG CHECK EMAIL ĐỂ XÁC NHẬN"
            );
            navigate('/login');
            break;

          default:
            const coupleRegister: RegisterCouplePayload = {
              address: address,
              email: username,
              name: partnerName1,
              partnerName1: partnerName1,
              partnerName2: partnerName2,
              password: password,
              phoneNumber: phoneNumber,
            };
            await registerCouple(coupleRegister, dispatch, navigate);
            props.setMessageStatus("green");
            props.setMessage(
              "Đăng ký thành công, VUI LÒNG CHECK EMAIL ĐỂ XÁC NHẬN"
            );
            navigate('/login');
            break;
        }
      } catch (error) {
        console.log(error);
      }
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

  const handleRegisterByRole = () => {
    switch (props.roleLogin) {
      case ROLE.supplier:
        return (
          <form onSubmit={registerHandler} className="col-right">
            <div className="item">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="icon-back"
                onClick={() => {
                  setIsInput(false);
                }}
              />
              <div className="login-header">Nhập thông tin</div>
            </div>
            <div className="item">
              <input
                className="input"
                placeholder="Email liên lạc"
                onChange={(e) => {
                  setContactEmail(e.target.value);
                }}
              />
              <input
                className="input"
                placeholder="Tên người phụ trách"
                onChange={(e) => {
                  setContactPersonName(e.target.value);
                }}
              />
              <input
                className="input"
                placeholder="Địa chỉ người phụ trách"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
              <input
                className="input"
                placeholder="Số điện thoại"
                onChange={(e) => {
                  setContactPhone(e.target.value);
                }}
              />
              <input
                className="input"
                placeholder="Tên hiển thị"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <input
                className="input"
                placeholder="Số điện thoại công ty"
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
              />
              <input
                className="input"
                placeholder="Địa chỉ công ty"
                onChange={(e) => {
                  setSupplierAddress(e.target.value);
                }}
              />
              <input
                className="input"
                placeholder="Tên công ty"
                onChange={(e) => {
                  setSupplierName(e.target.value);
                }}
              />

              {/* {CustomDropdown()} */}
            </div>
            <div className="item">
              <Button type="submit" className="btn-login" variant="contained">
                Đăng ký
              </Button>
            </div>
          </form>
        );

      default:
        return (
          <form onSubmit={registerHandler} className="col-right">
            <div className="item">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="icon-back"
                onClick={() => {
                  setIsInput(false);
                }}
              />
              <div className="login-header">Nhập thông tin</div>
            </div>
            <div className="item">
              <input
                className="input"
                placeholder="Tên của bạn"
                onChange={(e) => {
                  setPartnerName1(e.target.value);
                }}
              />
              <input
                className="input"
                placeholder="Tên bạn đời"
                onChange={(e) => {
                  setPartnerName2(e.target.value);
                }}
              />
              <input
                className="input"
                placeholder="Số điện thoại"
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
              />
              <input
                className="input"
                placeholder="Địa chỉ"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </div>
            <div className="item">
              <Button type="submit" className="btn-login" variant="contained">
                Đăng ký
              </Button>
            </div>
          </form>
        );
    }
  };

  return (
    <div id="Authentication">
      <div className="login-cover">
        <div
          className="col-left"
          style={{
            backgroundImage:
              'url(https://cdn1.weddingwire.com/assets/img/layer-alta/default_en-US.jpg)',
          }}
        ></div>
        {!isInput ? (
          <div className="col-right">
            <img className="icon" src={LOGO} alt="" />
            <div className="item">
              <div className="login-header">Đăng ký</div>
            </div>
            <div className="item">
              <div className="already-register">
                Đã có tài khoản?{' '}
                <strong
                  className="register hover-primary"
                  onClick={() => {
                    navigate('/login');
                  }}
                >
                  Đăng nhập ngay
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
              <input
                className="input"
                placeholder="Nhập lại mật khẩu"
                type="password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
            <div className="item">
              <Button
                type="submit"
                className="btn-login"
                variant="contained"
                onClick={() => {
                  handlePasswordConfirmation();
                }}
              >
                Tiếp tục
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
          </div>
        ) : (
          handleRegisterByRole()
        )}
      </div>
    </div>
  );
};

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontSize: '1.3rem',
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        popper: {
          '& .MuiAutocomplete-listbox': {
            fontSize: '1.3rem',
          },
        },
      },
    },
  },
});

export default Register;
