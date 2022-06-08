import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(val) {
  return localStorage.setItem('token',val)
}

export function removeToken() {
  localStorage.removeItem('token')
  localStorage.removeItem("data");
  localStorage.removeItem("userInfo");

}

