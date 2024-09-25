import axios from './axios';

export const getAllCategory = async (): Promise<any[]> => {
  try {
    const response = await axios.get('/category/getAllCategory');
    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error('API call was not successful');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getAllServices = async (): Promise<any[]> => {
  try {
    const response = await axios.get('/service/getAllActiveServices');
    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error('API call was not successful');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getServiceByCategory = async (
  category: string,
  minPrice?: number,
  maxPrice?: number,
  type?: string,
  serviceId?: string,
  status?: string
): Promise<any[]> => {
  try {
    const response = await axios.get('/service-supplier/filter', {
      params: {
        categoryId: category,
        minPrice: minPrice,
        maxPrice: maxPrice,
        type: type,
        serviceId: serviceId,
        status: status,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getServicesByCategory = async (
  categoryId: string
): Promise<any> => {
  try {
    const response = await axios.get(`/service/getByCategory`, {
      params: {
        categoryId: categoryId,
      },
    });

    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error('API call was not successful');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getServiceById = async (serviceID: string): Promise<any> => {
  try {
    const response = await axios.get('/service/getById/{id}', {
      params: {
        id: serviceID,
      },
    });

    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error('API call was not successful');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getBlogById = async (blogID: string): Promise<any> => {
  try {
    const response = await axios.get('/blog/getBlogPostById/' + blogID);

    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error('API call was not successful');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getBlogsList = async ({
  pageNo,
  pageSize,
}: {
  pageNo: number;
  pageSize: number;
}): Promise<any[]> => {
  try {
    const response = await axios.get('/blog/getAllActiveBlogPosts/', {
      params: {
        pageNo: pageNo,
        pageSize: pageSize,
      },
    });

    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error('API call was not successful');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getAllRatingsByServiceId = async (
  pageNo: number,
  pageSize: number,
  serviceId: string
): Promise<any[]> => {
  try {
    const response = await axios.get('/rating/getAllRating', {
      params: {
        pageNo: pageNo,
        pageSize: pageSize,
        serviceId: serviceId,
      },
    });

    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error('API call was not successful');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const createRating = async (
  ratingValue: number,
  description: string,
  serviceId: string
): Promise<any[]> => {
  try {
    const response = await axios.post('/rating/create', {
      coupleId: '',
      dateCreated: '',
      description: description,
      ratingValue: ratingValue,
      serviceId: serviceId,
    });

    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error('API call was not successful');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const createQuotation = async (
  coupleId: string,
  evenDate: string,
  message: string,
  suplierId: string,
  serviceId: string
): Promise<any[]> => {
  try {
    const response = await axios.post('/quote-request/create', {
      coupleId: coupleId,
      eventDate: evenDate,
      message: message,
      supplierId: suplierId,
      serviceId: serviceId,
    });

    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error('API call was not successful');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getListQuotation = async (
  coupleId: string,
  token: string
  // pageNo: number,
  // pageSize: number,
): Promise<any[]> => {
  try {
    const response = await axios.get('/quote-request/getQuoteRequestByCouple', {
      params: {
        coupleId: coupleId,
        // pageNo: pageNo,
        // pageSize: pageSize
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error('API call was not successful');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getListCombo = async (
  pageNo: number,
  pageSize: number
): Promise<any[]> => {
  try {
    const response = await axios.get('/combo/getActiveCombo', {
      params: {
        pageNo: pageNo,
        pageSize: pageSize,
      },
    });

    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error('API call was not successful');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getServiceSupplierByComboId = async (
  id: string
): Promise<any[]> => {
  try {
    const response = await axios.get(
      `/combo/getServiceSupplierByCombo?comboId=${id} `
    );

    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error('API call was not successful');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
export const getListBooking = async (
  pageNo: number,
  pageSize: number
): Promise<any[]> => {
  try {
    const response = await axios.get('/booking/getByCouple', {
      params: {
        coupleId: '',
        pageNo: pageNo,
        pageSize: pageSize,
      },
    });

    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error('API call was not successful');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
