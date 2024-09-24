import axios from '../api/axios';
import {
  ACCOUNT_LOGIN,
  ACCOUNT_LOGIN_GOOGLE,
  ACCOUNT_REGISTER_COUPLE,
  ACCOUNT_REGISTER_STAFF,
  ACCOUNT_REGISTER_SUPPLIER,
  ACTIVATE_COMBO,
  ACTIVATED_BY_ADMIN,
  CANCEL_BOOKING,
  CHECK_EXIST_EMAIL,
  CREATE_CATEGORY,
  CREATE_COMBO,
  CREATE_POST,
  CREATE_PROMOTION,
  CREATE_SERVICE,
  CREATE_SERVICE_SUPPLIER,
  CREATE_SERVICES,
  DELETE_BLOG,
  DISABLE_COMBO,
  DISABLED_BY_ADMIN,
  GET_ACTIVE_BLOGS,
  GET_ALL_ACCOUNT_BY_ADMIN,
  GET_ALL_ACCOUNT_BY_ROLE,
  GET_ALL_BLOGS,
  GET_ALL_CATEGORIES,
  GET_ALL_COMBO,
  GET_ALL_COMBO_BY_ID,
  GET_ALL_COUPLE_BY_ADMIN,
  GET_ALL_SERVICES,
  GET_ALL_SERVICES_SUPPLIER,
  GET_BALANCE_WALLET,
  GET_BLOG_BY_ID,
  GET_BOOKING_BY_COUPLE,
  GET_BOOKING_BY_ID,
  GET_BOOKING_BY_SUPPLIER,
  GET_BOOKING_DETAIL_BY_SUPPLIER_ID,
  GET_BY_ADMIN,
  GET_COMBO_BY_FILTER,
  GET_COUPLE_BY_ID,
  GET_PENDING_BLOGS,
  GET_PROMOTION_BY_SUPPLIER,
  GET_REJECTED_BLOGS,
  GET_SERVICE_BY_CATEGORY_ID,
  GET_SERVICE_BY_ID,
  GET_SERVICE_SUPPLIER_BY_ID,
  GET_SERVICE_SUPPLIER_BY_SUPPLIER_ID,
  GET_SERVICE_SUPPLIER_FILTER,
  GET_SUPPLIER_PROFILE,
  GET_SUPPLIERS_BLOGS,
  GET_TRANSACTION_BY_COUPLE,
  GET_TRANSACTION_SUMMARY_DETAIL,
  GET_TRANSACTION_SUMMARY_STATISTIC,
  GET_WALLET_HISTORY,
  GET_WALLET_HISTORY_BY_COUPLE,
  POST_BOOKING,
  RATING_BOOKING,
  REQUEST_PAYMENT,
  TOP_UP_BY_STAFF,
  UPDATE_COMBO,
  UPDATE_CONFIRM_BOOKING_STATUS,
  UPDATE_CONFIRM_DONE_STATUS,
  UPDATE_CONFIRM_PROCESSING_STATUS,
  UPDATE_COUPLE_PROFILE,
  UPDATE_POST,
  UPDATE_REJECT_BOOKING_STATUS,
  UPDATE_SERVICE,
  UPDATE_SERVICE_SUPPLIER,
  UPDATE_SUPPLIER_PROFILE,
} from '../constants/API_URLS';
import { PROCESS_STATUS, ROLE, STATUS } from '../constants/consts';
import { LOGIN_SUCCESS } from '../message/authen/Login';
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutFailed,
  logoutStart,
  logoutSuccess,
} from './authSlice';

//Authentication
export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post('/auth/login', user);
    if (res.data.message != LOGIN_SUCCESS) {
      return res.message;
    } else {
      if (res.data && res.data.data.status == STATUS.active) {
        switch (res.data.data.roleName) {
          case ROLE.couple:
            dispatch(loginSuccess(res.data.data));
            navigate('/');
            return res.data.status;
          case ROLE.admin:
            dispatch(loginSuccess(res.data.data));
            navigate('/');
            return res.data.status;
          case ROLE.staff:
            dispatch(loginSuccess(res.data.data));
            navigate('/staff/combo-services');
            return res.data.status;
          case ROLE.supplier:
            dispatch(loginSuccess(res.data.data));
            navigate('/service-suppliers-dashboard');
            return res.data.status;
          default:
            return res.data.message;
        }
      } else if (res.data.data.status == STATUS.disabled) {
        dispatch(loginSuccess(res.data.data));
        navigate('/');
        return res.data.status;
      } else {
        return res.data.message;
      }
    }
  } catch (err) {
    return err.response.data.message;
    dispatch(loginFailed());
  }
};

export const loginUserByGoogle = async (
  result,
  dispatch,
  navigate,
  isRegister
) => {
  dispatch(logoutStart());
  console.log(result.user.accessToken);
  try {
    const res = await axios.post(ACCOUNT_LOGIN_GOOGLE, {
      token: result.user.accessToken,
    });
    await console.log(res);
    await dispatch(loginSuccess(res.data.data));
    if (isRegister) {
      navigate('/update-candidate');
    } else {
      navigate('/');
    }
  } catch (err) {
    dispatch(loginFailed());
  }
};

export const logoutUser = async (dispatch, navigate) => {
  dispatch(logoutStart());
  try {
    dispatch(logoutSuccess(null));
    navigate('/');
  } catch (err) {
    dispatch(logoutFailed());
  }
};

// Couple
export const checkEmailExist = async (email) => {
  try {
    let url = `${CHECK_EXIST_EMAIL}?email=${email}`;
    const res = await axios.post(url);
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const registerCouple = async (newUser, navigate, dispatch) => {
  try {
    console.log(newUser);
    const res = await axios.post(ACCOUNT_REGISTER_COUPLE, newUser);
    console.log(res);
    // loginUser(newUser, dispatch, navigate, true);
  } catch (error) {
    return error;
  }
};

export const registerSupplier = async (newUser, navigate, dispatch) => {
  try {
    const res = await axios.post(ACCOUNT_REGISTER_SUPPLIER, newUser);
  } catch (error) {
    return error;
  }
};

export const getAllCoupleByAdmin = async (token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.get(
      GET_ALL_COUPLE_BY_ADMIN +
        '?isAscending=true&pageNo=0&pageSize=100&sortBy=id',
      {
        headers: headers,
      }
    );
    return res.data.data;
  } catch (error) {
    return error;
  }
};

// Staff

export const registerStaff = async (
  newUser,
  token,
  navigate,
  dispatch
): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.post(ACCOUNT_REGISTER_STAFF, newUser, {
      headers: headers,
    });
    return res.data.status;
  } catch (error) {
    return error.response.data.message;
  }
};

export const createPost = async (
  newPost,
  token,
  navigate,
  dispatch
): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.post(CREATE_POST, newPost, {
      headers: headers,
    });
    return res.data.status;
  } catch (error) {
    return error.response.data.message;
  }
};

export const getAllBlogPosts = async (page, size) => {
  try {
    let url = `${GET_ALL_BLOGS}?pageNo=${page}&pageSize=${size}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const getBlogById = async (blogId) => {
  try {
    const res = await axios.get(GET_BLOG_BY_ID + `${blogId}`);
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const updatePost = async (
  editPost,
  token,
  id,
  navigate,
  dispatch
): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    let url = `${UPDATE_POST}/${id}`;
    const res = await axios.put(url, editPost, {
      headers: headers,
    });
    return res.data.status;
  } catch (error) {
    return error.response.data.message;
  }
};

export const createCombo = async (
  newCombo,
  token,
  navigate,
  dispatch
): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.post(CREATE_COMBO, newCombo, {
      headers: headers,
    });
    return res.data.status;
  } catch (error) {
    return error.response.data.message;
  }
};

export const getAllComboById = async (comboId) => {
  try {
    const res = await axios.get(GET_ALL_COMBO_BY_ID + `/${comboId}`);
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const getComboFilters = async (page, size, isAscending) => {
  try {
    let url = `${GET_COMBO_BY_FILTER}?isAscending=${isAscending}&pageNo=${page}&pageSize=${size}&softBy=id`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const getListCombo = async (page, size, isAscending) => {
  try {
    let url = `${GET_ALL_COMBO}?isAscending=${isAscending}&pageNo=${page}&pageSize=${size}&softBy=id`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const getServiceById = async (serviceId) => {
  try {
    const res = await axios.get(GET_SERVICE_BY_ID + `?id=${serviceId}`);
    return res.data.data;
  } catch (error) {
    return error;
  }
};
export const getServicesSupplierFilters = async (maxPrice, minPrice) => {
  try {
    let url = `${GET_ALL_SERVICES_SUPPLIER}?&maxPrice=${maxPrice}&minPrice=${minPrice}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const updateCombo = async (
  updateCombo,
  token,
  navigate,
  dispatch
): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.put(UPDATE_COMBO, updateCombo, {
      headers: headers,
    });
    // const res = await axios.put(`${UPDATE_COMBO}/${updatedCombo.id}`, updatedCombo, {
    //   headers: headers,
    // });

    return res.data.status;
  } catch (error) {
    return error.response.data.message;
  }
};
export const createServices = async (
  newServices,
  token,
  navigate,
  dispatch
): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.post(CREATE_SERVICES, newServices, {
      headers: headers,
    });
    return res.data.status;
  } catch (error) {
    return error.response.data.message;
  }
};
export const getAllListServices = async (page, size) => {
  try {
    let url = `${GET_ALL_SERVICES}?pageNo=${page}&pageSize=${size}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const updateServices = async (
  updateService,
  token,
  navigate,
  dispatch
): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.put(UPDATE_SERVICE, updateService, {
      headers: headers,
    });
    return res.data.status;
  } catch (error) {
    return error.response.data.message;
  }
};
export const getListBlogs = async (page, size, status, supplier_id) => {
  try {
    let url = `${GET_ALL_BLOGS}?pageNo=${page}&pageSize=${size}`;

    if (supplier_id) {
      url = `${GET_SUPPLIERS_BLOGS}?pageNo=${page}&pageSize=${size}&serviceSupplierId=${supplier_id}`;
    } else if (status === PROCESS_STATUS.pending) {
      url = `${GET_PENDING_BLOGS}?pageNo=${page}&pageSize=${size}`;
    } else if (status === PROCESS_STATUS.active) {
      url = `${GET_ACTIVE_BLOGS}?pageNo=${page}&pageSize=${size}`;
    } else if (status === PROCESS_STATUS.rejected) {
      url = `${GET_REJECTED_BLOGS}?pageNo=${page}&pageSize=${size}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const getListCategories = async (page, size) => {
  try {
    let url = `${GET_ALL_CATEGORIES}?pageNo=${page}&pageSize=${size}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
};
export const createCategory = async (name, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    let url = `${CREATE_CATEGORY}`;

    const response = await axios.post(
      url,
      {
        categoryName: name,
      },
      { headers: headers }
    );
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
};

// Service Supplier
export const createServiceSupplier = async (
  newService,
  token,
  navigate,
  dispatch
): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.post(CREATE_SERVICE_SUPPLIER, newService, {
      headers: headers,
    });
    return res.data.status;
  } catch (error) {
    return error.response.data.message;
  }
};

export const updateServiceSupplier = async (
  newService,
  token,
  navigate,
  dispatch
): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.put(UPDATE_SERVICE_SUPPLIER, newService, {
      headers: headers,
    });
    return res.data.status;
  } catch (error) {
    return error.response.data.message;
  }
};

export const getServicesSupplierFilter = async (
  supplierId = '',
  categoryId = '',
  serviceId = '',
  segmentId = ''
) => {
  try {
    const res = await axios.get(
      GET_SERVICE_SUPPLIER_FILTER +
        `?categoryId=${categoryId}&maxPrice=0&minPrice=0&serviceId=${serviceId}&supplierId=${supplierId}&type=${segmentId}`
    );
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const getServiceSupplierById = async (supplierId) => {
  try {
    const res = await axios.get(
      GET_SERVICE_SUPPLIER_BY_ID + `?id=${supplierId}`
    );
    return res.data.data;
  } catch (error) {
    return error;
  }
};

// Service

export const getServicesByCategoryId = async (categoryId) => {
  try {
    const res = await axios.get(
      GET_SERVICE_BY_CATEGORY_ID + `?categoryId=${categoryId}`
    );
    console.log(res.data.data);
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const createService = async (
  newService,
  token,
  navigate,
  dispatch
): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.post(CREATE_SERVICE, newService, {
      headers: headers,
    });
    return res.data.status;
  } catch (error) {
    return error.response.data.message;
  }
};

// Promotion

export const createPromotion = async (promotion, token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.post(CREATE_PROMOTION, promotion, {
      headers: headers,
    });
    return res.data.status;
  } catch (error) {
    return error;
  }
};

export const getPromotionBySupplier = async (supplierId) => {
  try {
    const res = await axios.get(
      GET_PROMOTION_BY_SUPPLIER + `?supplierId=${supplierId}`
    );

    return res.data.data;
  } catch (error) {
    return error;
  }
};

// Booking

export const getBookingBySupplierId = async (id, token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.get(GET_BOOKING_BY_SUPPLIER + `?supplierId=${id}`, {
      headers: headers,
    });
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const getBookingByAdmin = async (token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.get(
      GET_BY_ADMIN + '?isAscending=true&pageNo=0&pageSize=100&sortBy=id',
      {
        headers: headers,
      }
    );
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const createBooking = async (createBookingArgs, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.post(POST_BOOKING, createBookingArgs, {
      headers: headers,
    });
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const getBookingById = async (id, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.get(
        GET_BOOKING_BY_ID + `?id=${id}`,
      {
        headers: headers,
      }
    );
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const getUserById = async (id, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.get(GET_COUPLE_BY_ID + `?id=${id}`, {
      headers: headers,
    });
    return res.data.data;
  } catch (error) {
    return error;
  }
};
export const requestPayment = async (data, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.post(REQUEST_PAYMENT, data, {
      headers: headers,
    });
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const getBookingHistoryByCoupleId = async (id, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.get(GET_BOOKING_BY_COUPLE + `?coupleId=${id}`, {
      headers: headers,
    });
    return res.data.data;
  } catch (error) {
    return error;
  }
};
export const getTransactionHistoryByCoupleId = async (id, token, from, to) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.get(
      GET_TRANSACTION_BY_COUPLE +
        `?coupleId=${id}&timeFrom=${from}&timeTo=${to}&pageNo=0&pageSize=1000`,
      {
        headers: headers,
      }
    );
    return res.data.data;
  } catch (error) {
    return error;
  }
};
export const getWalletByAccountId = async (id, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.get(GET_TRANSACTION_BY_COUPLE + `/${id}`, {
      headers: headers,
    });
    return res.data.data;
  } catch (error) {
    return error;
  }
};
export const cancelBooking = async (id, reason, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.put(
      CANCEL_BOOKING,
      {
        bookingDetailId: id,
        reason: reason,
      },
      {
        headers: headers,
      }
    );
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const ratingBooking = async (
  id,
  rating,
  coupldId,
  description,
  token
) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.post(
      RATING_BOOKING,
      {
        bookingDetailId: id,
        coupleId: coupldId,
        ratingValue: rating,
        description: description,
      },
      {
        headers: headers,
      }
    );
    return res.data.data;
  } catch (error) {
    return error;
  }
};
// Booking Detail

export const getBookingDetailBySupplierId = async (
  supplierId,
  bookingId,
  token
) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.get(
      GET_BOOKING_DETAIL_BY_SUPPLIER_ID +
        `?bookingId=${bookingId}&supplierId=${supplierId}`,
      {
        headers: headers,
      }
    );
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const processingBookingDetail = async (id, token) => {
  const data = {
    key: 'value',
  };
  fetch(
    'https://thedaywedding-hkaybdgafndhecbn.southeastasia-01.azurewebsites.net' +
      UPDATE_CONFIRM_PROCESSING_STATUS +
      `?id=${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
  return data.status;
};
export const doneBookingDetail = async (id, token) => {
  const data = {
    key: 'value',
  };
  fetch(
    'https://thedaywedding-hkaybdgafndhecbn.southeastasia-01.azurewebsites.net' +
      UPDATE_CONFIRM_DONE_STATUS +
      `?id=${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
  return data.status;
};

export const confirmBookingDetail = async (id, token) => {
  const data = {
    key: 'value',
  };
  fetch(
    'https://thedaywedding-hkaybdgafndhecbn.southeastasia-01.azurewebsites.net' +
      UPDATE_CONFIRM_BOOKING_STATUS +
      `?id=${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
  return data.status;
};

export const rejectBookingDetail = async (data, token) => {
  fetch(
    'https://thedaywedding-hkaybdgafndhecbn.southeastasia-01.azurewebsites.net' +
      UPDATE_REJECT_BOOKING_STATUS,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
  return data.status;
};

// Wallet
export const getBalanceWallet = async (id, token) => {
  try {
    if (id) {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      const res = await axios.get(GET_BALANCE_WALLET + `/${id}`, {
        headers: headers,
      });
      return res.data.data;
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
};

// Wallet history
export const getWalletHistory = async (id, token, from, to) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.get(
      GET_WALLET_HISTORY +
        `?isAscending=true&pageNo=0&pageSize=100&sortBy=id&timeFrom=${from}&timeTo=${to}&walletId=${id}`,
      {
        headers: headers,
      }
    );
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const topupWallet = async (data, token) => {
  fetch(
    'https://thedaywedding-hkaybdgafndhecbn.southeastasia-01.azurewebsites.net' +
      TOP_UP_BY_STAFF,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
  return data.status;
};

// Account

export const getSupplierProfile = async (id, token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.get(GET_SUPPLIER_PROFILE + `?id=${id}`, {
      headers,
    });
    return res.data.data;
  } catch (error) {
    return error;
  }
};

// export const updateCoupleProfile = async (couple, token) => {
//   const data = {
//     key: 'value',
//   };
//   fetch(
//     'https://thedaywedding-hkaybdgafndhecbn.southeastasia-01.azurewebsites.net' +
//       UPDATE_COUPLE_PROFILE,
//     couple,
//     {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     }
//   )
//     .then((response) => response.json())
//     .then((data) => console.log(data.status))
//     .catch((error) => console.error('Error:', error));
//   return data.status;
// };

export const updateSupplierProfile = async (supplier, token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.put(UPDATE_SUPPLIER_PROFILE, supplier, { headers });
    return res.data.data;
  } catch (error) {
    return error;
  }
};
export const updateCoupleProfile = async (couple, token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.put(UPDATE_COUPLE_PROFILE, couple, { headers });
    return res.data.data;
  } catch (error) {
    return error;
  }
};
export const activatedByAdmin = async (id, token) => {
  const data = {
    key: 'value',
  };
  fetch(
    'https://thedaywedding-hkaybdgafndhecbn.southeastasia-01.azurewebsites.net' +
      ACTIVATED_BY_ADMIN +
      `?id=${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((data) => console.log(data.status))
    .catch((error) => console.error('Error:', error));
  return data.status;
};

export const deleteBlog = async (id, token) => {
  const data = {
    key: 'value',
  };
  fetch(
    'https://thedaywedding-hkaybdgafndhecbn.southeastasia-01.azurewebsites.net' +
      DELETE_BLOG +
      `?id=${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((data) => console.log(data.status))
    .catch((error) => console.error('Error:', error));
  return data.status;
};

export const disabledByAdmin = async (id, token): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await axios.delete(DISABLED_BY_ADMIN + `?id=${id}`, {
      headers: headers,
    });
    return res.data.status;
  } catch (error) {
    return error.response.data.message;
  }
};

export const activatedCombo = async (id, token) => {
  const data = {
    key: 'value',
  };
  fetch(
    'https://thedaywedding-hkaybdgafndhecbn.southeastasia-01.azurewebsites.net' +
      ACTIVATE_COMBO +
      `?id=${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((data) => console.log(data.status))
    .catch((error) => console.error('Error:', error));
  return data.status;
};

export const disabledCombo = async (id, token): Promise<string> => {
  const data = {
    key: 'value',
  };
  fetch(
    'https://thedaywedding-hkaybdgafndhecbn.southeastasia-01.azurewebsites.net' +
      DISABLE_COMBO +
      `?id=${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((data) => console.log(data.status))
    .catch((error) => console.error('Error:', error));
  return data.status;
};

export const getAllAccountByRole = async (role, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.get(
      GET_ALL_ACCOUNT_BY_ROLE + `?pageNo=0&pageSize=100&role=${role}`,
      {
        headers: headers,
      }
    );
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const getAllAccountByAdmin = async (token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.get(
      GET_ALL_ACCOUNT_BY_ADMIN + `?pageNo=0&pageSize=100`,
      {
        headers: headers,
      }
    );
    return res.data.data;
  } catch (error) {
    return error;
  }
};

// Transaction
export const getTransactionSummaryDetail = async (id, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.get(
      GET_TRANSACTION_SUMMARY_DETAIL + `?bookingId=${id}`,
      {
        headers: headers,
      }
    );
    console.log(res.data.data.supplierAmountDetails);
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const getTransactionSummaryStatistic = async (year, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await axios.get(
      GET_TRANSACTION_SUMMARY_STATISTIC + `?year=${year}`,
      {
        headers: headers,
      }
    );
    return res.data.data;
  } catch (error) {
    return error;
  }

};
