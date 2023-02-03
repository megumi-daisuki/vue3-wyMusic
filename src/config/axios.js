import axios from "axios";
import env from './env'


const instance = axios.create({
    baseURL: env.baseUrl,
    timeout: 30000,
    withCredentials: true
})
// 拦截器
instance.interceptors.request.use(config => {
    // console.log('请求拦截器', config);
    return config
}, (error) => {
    return Promise.reject(error)
});

instance.interceptors.response.use((res) => {
    return res.data
}, (error) => {
    return Promise.reject(error)
})

instance.defaults.withCredentials = true;

export default instance
