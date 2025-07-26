import axios from 'axios';

// Create a new Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Request Interceptor: Attach the access token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- NEW REFRESH LOGIC ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response Interceptor: Handle token expiration and auto-refresh
api.interceptors.response.use(
    (response) => {
        // If the request succeeds, return the response
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is 401 (Unauthorized) and it's not a retry request
        if (error.response.status === 401 && !originalRequest._retry) {

            // If we are already refreshing the token, queue this request
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                });
            }

            // Mark that we are refreshing the token
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call the refresh endpoint.
                // We use a new axios instance to avoid an interceptor loop.
                // The browser will automatically send the HttpOnly refresh token cookie.
                const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });

                // Update the token in local storage
                localStorage.setItem('token', data.accessToken);

                // Update the header of the original failed request
                api.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
                originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;

                // Process the queue of failed requests with the new token
                processQueue(null, data.accessToken);

                // Retry the original request
                return api(originalRequest);

            } catch (refreshError) {
                // If the refresh token is invalid, logout the user
                processQueue(refreshError, null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Redirect to login page
                window.location.replace('/login');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // For all other errors, just reject the promise
        return Promise.reject(error);
    }
);


export default api;
