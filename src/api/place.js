import request from '@/utils/request'
 
// 查看坐标
export const coord = params => { 
    return request({
      url: `/blbWarnCarRelation/coord/${params.id}`,
      method: 'get',
      responseType: 'json',
      params:{}
    });
  }