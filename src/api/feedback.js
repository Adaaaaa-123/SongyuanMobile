import request from '@/utils/request'
 
// 预警处置
export const conduct = params => { 
  return request({
    url: `/blbAlarmImg/conduct`,
    method: 'post',
    responseType: 'json',
    data:params
  });
}
