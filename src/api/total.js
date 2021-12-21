import request from '@/utils/request'
 
// 预警统计
export const getAlarmTrend = params => { 
  return request({
    url: `/bus/carAlarm/getAlarmTrend`,
    method: 'get',
    responseType: 'json',
    params
  });
}
