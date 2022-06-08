import request from '@/utils/request'

// 获取登录接口
export const loginList = params => {
    return request({
        url: `login?${params}`,
        method: 'post',
        responseType: 'json',
        data: params
    });
}

// 执行路由规则
export const executeList = params => {
    return request({
        url: `/init/executeRules`,
        method: 'post',
        responseType: 'json',
        data: params
    });
}

// 删除路由规则
export const deleteList = params => {
    return request({
        url: `/init/deleteRules`,
        method: 'post',
        responseType: 'json',
        data: params
    });
}

// 获取验证码
export const getCaptacha = params => {
  return request({
      url: `captcha`,
      method: 'get',
      responseType: 'json',
      params
  });
}

// 获取用户信息
export const getUserInfo = params => {
  return request({
      url: `userInfo`,
      method: 'get',
      responseType: 'json',
      params
  });
}

// 退出登录
export const logOut = params => {
  return request({
      url: `logout`,
      method: 'get',
      responseType: 'json',
      params
    });
}
