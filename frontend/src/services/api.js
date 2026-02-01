import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const authService = {
    adminLogin: (credentials) => api.post('/admin/login', credentials),
    buyerLogin: (credentials) => api.post('/buyer/login', credentials),
};

export const productService = {
    getAll: () => api.get('/product/all'),
    getActive: () => api.get('/product/active'),
    getById: (id) => api.get(`/product/${id}`),
    add: (product) => api.post('/product/add', product),
    update: (id, product) => api.post(`/product/update/${id}`, product),
    delete: (id) => api.delete(`/product/delete/${id}`),
    getWinners: () => api.get('/product/winners'),
};

export const buyerService = {
    getAll: () => api.get('/buyer/all'),
    add: (buyer) => api.post('/buyer/add', buyer),
    update: (id, buyer) => api.post(`/buyer/update/${id}`, buyer),
    delete: (id) => api.delete(`/buyer/delete/${id}`),
};

export const bidService = {
    place: (productId, buyerId, amount) => 
        api.post(`/bid/place?productId=${productId}&buyerId=${buyerId}&amount=${amount}`),
    getByProduct: (productId) => api.get(`/bid/product/${productId}`),
};

export default api;
