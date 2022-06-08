import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { getToken,setToken,removeToken } from '@/utils/auth'
import { Dialog } from 'vant'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 80000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // config.data = JSON.stringify(config.data);
    // do something before request is sent
    if (config.url != "captcha" && getToken()) {
      config.headers = {
        authorization: getToken(),
        'Content-Type': "application/json" //配置请求头
      }
    } else {
      config.headers = {
        'Content-Type': "application/json" //配置请求头
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (response.headers.authorization) {
      if (getToken() != undefined || !getToken())
        setToken(response.headers.authorization)
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      Dialog.alert({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 100
      }).then(()=>{
        location.reload()
      })
      if (res.code == 2001) {
        removeToken()
        router.app.$router.push('/login').then(()=>{
          location.reload()
        })  
      }
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        Dialog.alert({
          title: '提示',
          message: "您已退出登录请重新登录！",
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Dialog.alert({
      title: '提示',
      message: error.message,
    }).then(() => {
      return Promise.reject(error)
    });
  }
)

export default service
