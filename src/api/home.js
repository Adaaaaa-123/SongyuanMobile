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

// 采纳修改
export const disposeEarly = params => {
  return request({
    url: `/earlyWarning/disposeEarly/${params.id}`,
    method: 'get',
    responseType: 'json',
    params
  });
}
