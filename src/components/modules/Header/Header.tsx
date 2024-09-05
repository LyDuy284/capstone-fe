import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import NavSearching from '../../pages/NavSearching/NavSearching';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressCard,
  faRightFromBracket,
  faCreditCard,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { getBalanceWallet, logoutUser } from '../../../redux/apiRequest';
import { LOGO, ROLE } from '../../../constants/consts';
import { HeaderNav } from './HeaderNav';
import { Badge, Fade, IconButton, Snackbar } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { addToCart, getCart } from '../../../utils/CartStorage';
import { TransitionProps } from '@mui/material/transitions';

interface HeaderProps {
  isModalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isModalVisible, setModalVisible }) => {
  const [state, setState] = React.useState<{
    open: boolean;
    Transition: React.ComponentType<
      TransitionProps & {
        children: React.ReactElement<any, any>;
      }
    >;
    vertical: 'bottom';
    horizontal: 'right';
  }>({
    open: false,
    Transition: Fade,
    vertical: 'bottom',
    horizontal: 'right',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [services, setServices] = useState(getCart());
  const [isDisplayBalance, setIsDisplayBalance] = useState<boolean>(false);
  const location = useLocation();
  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };
  useEffect(() => {
    const handleCartUpdate = () => {
      setServices(getCart());
      setState({
        ...state,
        open: true,
      });
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const [show, setShow] = useState<string>('display-none');
  const [balance, setBalance] = useState<string>('0');
  const user = useSelector((state: any) => state.auth.login.currentUser);

  const navItemRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBalanceWallet();
    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        navItemRef.current?.contains(target) ||
        modalRef.current?.contains(target)
      ) {
        setModalVisible(true);
      } else {
        setModalVisible(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [setModalVisible]);

  async function fetchBalanceWallet() {
    const response = await getBalanceWallet(user?.accountId, user?.token);
    setBalance(response?.balance);
  }

  const handleNav = () => {
    if (user && user.roleName !== ROLE.couple) {
      const navItems = HeaderNav.find((e) => e.user === user?.roleName)?.items;

      return (
        <ul className="nav-list">
          {navItems?.map((item, index) => {
            return (
              <li
                className={
                  `nav-item` +
                  `${item.navigate == location.pathname
                    ? ' nav-item-selected'
                    : ''
                  }`
                }
                onClick={() => {
                  navigate(`${item.navigate}`);
                }}
                key={index}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      );
    } else {
      const navItems = HeaderNav.find((e) => e.user === ROLE.couple)?.items;
      return (
        <ul className="nav-list">
          <li className="nav-item">
            <div id="IsSearch" ref={navItemRef}>
              dịch vụ
            </div>
          </li>
          {navItems?.map((item, index) => {
            return (
              <li
                className="nav-item"
                onClick={() => {
                  navigate(`${item.navigate}`);
                }}
                key={index}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      );
    }
  };

  const logoutHandler = () => {
    logoutUser(dispatch, navigate);
  };
  const { vertical, horizontal } = state;

  return (
    <>
      <div id="Header">
        <Snackbar
          open={state.open}
          TransitionComponent={state.Transition}
          message="Cập nhật giỏ hàng thành công"
          key={state.Transition.name}
          autoHideDuration={2000}
          onClose={handleClose}
          anchorOrigin={{ vertical, horizontal }}
          ContentProps={{
            sx: {
              background: 'green',
            },
          }}
        />
        ;
        <div className="header-left">
          <div
            className="header-icon cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src={LOGO} alt="" />
          </div>
          <nav className="nav-bar">{handleNav()}</nav>
        </div>
        {user == null ? (
          <div className="header-right">
            <nav className="nav-auth">
              <ul className="nav-auth-list">
                <li
                  className="nav-auth-item"
                  onClick={() => {
                    navigate('/login');
                  }}
                >
                  Đăng nhập
                </li>
                <li
                  className="nav-auth-item"
                  onClick={() => {
                    navigate('/register');
                  }}
                >
                  Đăng ký
                </li>
              </ul>
            </nav>
          </div>
        ) : (
          <div className="header-right">
            {isDisplayBalance ? (
              <>
                <RemoveRedEyeIcon
                  className="hover-primary"
                  style={{ color: 'var(--black-color)' }}
                  onClick={() => setIsDisplayBalance(false)}
                ></RemoveRedEyeIcon>
                <span className="balance">{balance?.toLocaleString()} VNĐ</span>
              </>
            ) : (
              <>
                <VisibilityOffIcon
                  className="hover-primary"
                  style={{ color: 'var(--black-color)' }}
                  onClick={() => setIsDisplayBalance(true)}
                ></VisibilityOffIcon>
                <span className="balance">******* VNĐ</span>
              </>
            )}

            <IconButton onClick={() => navigate('/wallet-history')}>
              <AccountBalanceWalletIcon
                sx={{ fontSize: 30, color: 'var(--black-color)' }}
              />
            </IconButton>
            {user?.roleName != ROLE.supplier ? (
              <>
                <IconButton
                  onClick={() => {
                    navigate('/booking-history');
                  }}
                >
                  <ReceiptLongIcon
                    sx={{ fontSize: 30, color: 'var(--black-color)' }}
                  />
                </IconButton>
                <IconButton
                  onClick={() => {
                    navigate('/quotation');
                  }}
                >
                  <Badge badgeContent={services.length} color="error">
                    <ShoppingCartIcon
                      sx={{ fontSize: 30, color: 'var(--black-color)' }}
                    />{' '}
                  </Badge>
                </IconButton>
              </>
            ) : null}

            <div
              className="navlink user-wrap"
              onClick={(e) => {
                e.stopPropagation();
                show == '' ? setShow('display-none') : setShow('');
              }}
            >
              <div className="flex-css relative hover-primary">
                <div className="user-name">{user?.name}</div>
                <img
                  className="avt"
                  src="https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                  alt=""
                />
              </div>
              <div className={`user-option ${show}`}>
                <div className="user-info">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                    alt="user-avt"
                    className="user-info-avt"
                  />
                  <div className="block">
                    <span className="user-info-name">{user?.name}</span>
                    <span className="user-info-email">{user?.email}</span>
                  </div>
                </div>
                <div
                  className="dropdown-option"
                  onClick={() => {
                    navigate('/profile');
                  }}
                  style={{ color: 'var(--black-color)' }}
                >
                  <FontAwesomeIcon icon={faAddressCard} />
                  <span className="profile-select">Thông tin</span>
                </div>
                {
                  user?.roleName == ROLE.couple && (
                    <>
                      <div
                        className="dropdown-option"
                        onClick={() => navigate('/transaction-history')}
                      >
                        <FontAwesomeIcon icon={faCreditCard} />
                        <span className="profile-select">Lịch sử thanh toán</span>
                      </div>
                      <div
                        className="dropdown-option"
                        onClick={() => navigate('/wallet-history')}
                      >
                        <FontAwesomeIcon icon={faWallet} />
                        <span className="profile-select">Lịch sử ví</span>
                      </div>
                    </>
                  )
                }
                <div className="dropdown-option" onClick={logoutHandler}>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  <span className="profile-select">Đăng xuất</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {isModalVisible && (
          <div id="Modal" ref={modalRef} style={{ position: 'absolute' }}>
            <NavSearching />
          </div>
        )}
      </div>
      <Outlet />
    </>
  );
};

export default Header;
