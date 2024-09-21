import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/modules/Header/Header';
import Landing from './components/pages/Landing/Landing';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import Photographer from './components/pages/Photographer/Photographer';
import MessageBox from './components/pages/Popup/MessageBox/MessageBox';
import Register from './components/pages/Authentication/Register';
import Login from './components/pages/Authentication/Login';
import StaffManageServices from './components/pages/StaffManager/StaffManageServices';
import StaffLayout from './components/modules/StaffLayout/StaffLayout';
import { useSelector } from 'react-redux';
import Dashboard from './components/pages/ServiceSupplier/Dashboard';
import { UserProvider } from './constants/UserContex';
import ProtectedRoute from './constants/ProtectedRole';
import StaffList from './components/pages/Admin/StaffList';
import { ROLE } from './constants/consts';
import './constants/styles/Filter.css';
import StaffManageBlogs from './components/pages/StaffManager/StaffManageBlogs';
import StaffManageCategories from './components/pages/StaffManager/StaffManageCategories';
import Services from './components/pages/ServiceSupplier/Services';
import ServiceDetail from './components/pages/ServiceSupplier/ServiceDetail';
import SupplierBookingList from './components/pages/ServiceSupplier/BookingList';
import Promotions from './components/pages/ServiceSupplier/Promotions';
import HomePage from './components/pages/HomePage/HomePage';
import UpdateProfile from './components/pages/CoupleProfile/UpdateProfile';
import StepByStep from './components/pages/StepByStep/StepByStep';
import CoupleQuotation from './components/pages/CoupleQuotation/CoupleQuotation';
import BookingDetails from './components/pages/BookingDetails/BookingDetails';
import BookingHistory from './components/pages/BookingHistory/BookingHistory';
import BlogDetails from './components/pages/CoupleBlogs/BlogDetail';
import BlogList from './components/pages/CoupleBlogs/BlogList';
import CoupleServiceListImage from './components/pages/CoupleServiceDetail/CoupleServiceListImage';
import CoupleServiceDetail from './components/pages/CoupleServiceDetail/CoupleServiceDetail';
import CoupleService from './components/pages/CoupleService/CoupleService';
import ComboServiceDetail from './components/pages/ComboService/ComboServiceDetail';
import Transactions from './components/pages/ServiceSupplier/Transactions';
import Footer from './components/modules/Footer/Footer';
import BookingHistoryDetail from './components/pages/BookingHistory/BookingHistoryDetail';
import TransactionHistory from './components/pages/TransactionHistory/TransactionHistory';
import WalletHistory from './components/pages/WalletHistory/WalletHistory';
import ComboDetail from './components/pages/ComboDetail.tsx/ComboDetail';
import AdminDashboard from './components/pages/Admin/AdminDashboard';
import Deposit from './components/pages/Admin/Deposit';
import AdminTransaction from './components/pages/Admin/AdminTransaction';
import StaffManageComboServices from './components/pages/StaffManager/StaffManageComboServices';
import Profile from './components/pages/ServiceSupplier/Profile';
// import { listStaffRoute, listSupplierRoute } from "./constants/route";

function App() {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const [isDisplayHeader, setIsDisplayHeader] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageStatus, setMessageStatus] = useState('');
  const [roleLogin, setRoleLogin] = useState<string>(ROLE.couple);
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === '/login' ||
      location.pathname === '/register' ||
      (user && user.roleName === ROLE.staff)
    ) {
      setIsDisplayHeader(false);
    } else {
      setIsDisplayHeader(true);
    }
  }, [location.pathname, user]);
  return (
    <div className="App">
      <MessageBox
        status={messageStatus}
        message={message}
        setMessage={setMessage}
        title="inasd"
      ></MessageBox>
      <UserProvider>
        {isDisplayHeader && (
          <Header
            isModalVisible={isModalVisible}
            setModalVisible={setModalVisible}
          />
        )}
        <Routes>
          {/* <Route path="/*" element={<MessageBoxContainer />} /> */}
          {/* Staff */}
          {/* Will be refactored after completion of Dashboard */}
          {user && user?.roleName === ROLE.staff ? (
            <Route path="/" element={<StaffLayout />}>
              <Route
                path="/staff/combo-services"
                element={
                  <StaffManageComboServices
                    setMessage={setMessage}
                    setMessageStatus={setMessageStatus}
                  />
                }
              />
              <Route
                path="/staff/services"
                element={
                  <StaffManageServices
                    setMessage={setMessage}
                    setMessageStatus={setMessageStatus}
                  />
                }
              />
              <Route
                path="/staff/blogs"
                element={
                  <StaffManageBlogs
                    setMessage={setMessage}
                    setMessageStatus={setMessageStatus}
                  />
                }
              />
              <Route
                path="/staff/categories"
                element={<StaffManageCategories />}
              />
              <Route
                path="/service-suppliers-dashboard"
                element={<Dashboard />}
              />
            </Route>
          ) : (
            <Route
              path="/"
              element={
                user?.roleName === ROLE.supplier ? (
                  <Services
                    setMessage={setMessage}
                    setMessageStatus={setMessageStatus}
                  />
                ) : user?.roleName === ROLE.admin ? (
                  <AdminDashboard />
                ) : (
                  <HomePage />
                )
              }
            />
          )}

          {/* Authenticate */}
          <Route
            path="/login"
            element={
              <Login
                setRoleLogin={setRoleLogin}
                setMessageStatus={setMessageStatus}
                setMessage={setMessage}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                roleLogin={roleLogin}
                setMessageStatus={setMessageStatus}
                setMessage={setMessage}
              />
            }
          />

          {/* Admin */}
          <Route element={<ProtectedRoute requiredRole={ROLE.admin} />}>
            <Route
              path="/accounts"
              element={
                <StaffList
                  setMessage={setMessage}
                  setMessageStatus={setMessageStatus}
                />
              }
            />
            <Route path="/" element={<AdminDashboard />} />
            <Route
              path="/deposit"
              element={
                <Deposit
                  setMessage={setMessage}
                  setMessageStatus={setMessageStatus}
                />
              }
            />
            <Route
              path="/transactions"
              element={
                <AdminTransaction
                  setMessage={setMessage}
                  setMessageStatus={setMessageStatus}
                />
              }
            />
          </Route>

          {/* Supplier */}
          <Route element={<ProtectedRoute requiredRole={ROLE.supplier} />}>
            <Route
              path="/profile-supplier"
              element={
                <Profile
                  setMessage={setMessage}
                  setMessageStatus={setMessageStatus}
                />
              }
            />
            <Route
              path="/services"
              element={
                <Services
                  setMessage={setMessage}
                  setMessageStatus={setMessageStatus}
                />
              }
            />
            <Route
              path="/service-detail/:id"
              element={
                <ServiceDetail
                  setMessage={setMessage}
                  setMessageStatus={setMessageStatus}
                />
              }
            />
            <Route
              path="/booking-list"
              element={
                <SupplierBookingList
                  setMessage={setMessage}
                  setMessageStatus={setMessageStatus}
                />
              }
            />
            <Route
              path="/promotions"
              element={
                <Promotions
                  setMessage={setMessage}
                  setMessageStatus={setMessageStatus}
                />
              }
            />
            <Route
              path="/transaction"
              element={
                <Transactions
                  setMessage={setMessage}
                  setMessageStatus={setMessageStatus}
                />
              }
            />
          </Route>

          {/* Test View */}
          <Route element={<ProtectedRoute requiredRole={ROLE.couple} />}>
            <Route
              path="/profile"
              element={
                <UpdateProfile
                  setMessage={setMessage}
                  setMessageStatus={setMessageStatus}
                />
              }
            />
          </Route>

          {/* Guest */}
          <Route path="/photographer" element={<Photographer />} />
          <Route path="/step-by-step" element={<StepByStep />} />
          <Route path="/quotation" element={<CoupleQuotation />} />
          <Route path="/booking-details/:id" element={<BookingDetails />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/wallet-history" element={<WalletHistory />} />
          <Route path="/combo-services/:id" element={<ComboDetail />} />

          <Route
            path="/booking-history/:id"
            element={<BookingHistoryDetail />}
          />

          <Route
            path="/combo-service/details/:id"
            element={<ComboServiceDetail />}
          />
          <Route path="/blogs/details/:id" element={<BlogDetails />} />
          <Route path="/blogs-couple" element={<BlogList />} />

          <Route
            path="/services/details/:id/img"
            element={<CoupleServiceListImage />}
          />
          <Route
            path="/services/details/:id"
            element={<CoupleServiceDetail />}
          />

          <Route path="/services/:categoryID" element={<CoupleService />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {isDisplayHeader && <Footer />}
      </UserProvider>
    </div>
  );
}

export default App;
