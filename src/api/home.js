import request from '@/utils/request'


// 预警列表
export const getList = params => {
  return request({
    url: `/earlyWarning/findAppEarlyWarn`,
    method: 'get',
    responseType: 'json',
    params
  });
}


// 误报
export const distort = params => {
  return request({
    url: `/blbWarnCarRelation/distort/${params.id}`,
    method: 'post',
    responseType: 'json',
    data:params
  });
}


// 签收
export const receipt = params => { 
  return request({
    url: `/blbWarnCarRelation/receipt/${params.id}`,
    method: 'get',
    responseType: 'json',
    params:{}
  });
}
