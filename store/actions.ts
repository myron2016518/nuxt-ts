import request from '@/service'
const qs = require('qs');

// 登录
export const dologin = async (store: any, params: any) => {
  return await request.post('/tcjxs/api/login', qs.stringify(params))
}
// 退出
export const unLogigToken = async (store: any, params: any) => {
  return await request.post('/tcjxs/Api/Login/unLogigToken', qs.stringify(params))
}
// 修改密码
export const updateMerchantPassword = async (store: any, params: any) => {
  return await request.post('/tcjxs/Api/APP/updateMerchantPassword', qs.stringify(params))
}
// 七牛token
export const qiniuToken = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/qiniu/token', { params: params })
}
// { params: params,headers :{}  }
// 广告列表
export const getPosterList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/poster', { params: params })
}
// 广告添加
export const addPosterList = async (store: any, params: any) => {
  return await request.post('/tcjxs/api/poster', qs.stringify(params))
}
// 广告修改
export const editPosterList = async (store: any, params: any) => {
  return await request.put('/tcjxs/api/poster/' + params.sId, qs.stringify(params))
}
// 广告单个查询
export const getPosterById = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/poster/' + params.sId, { params: params })
}

// 运营视频列表
export const getCourseList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/course', { params: params })
}
// 运营视频上传
export const addCourseList = async (store: any, params: any) => {
  return await request.post('/tcjxs/api/course', qs.stringify(params))
}
// 运营视频上传修改
export const editCourse = async (store: any, params: any) => {
  return await request.put('/tcjxs/api/course/' + params.sId, qs.stringify(params))
}
// 运营视频上传删除 by  id 
export const deleteCourse = async (store: any, params: any) => {
  return await request.delete('/tcjxs/api/course/' + params.sId, { params: params })
}
//  运营视频单个查询
export const getCourseById = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/course/' + params.sId, { params: params })
}


// 平台广告
export const getPlatformList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/platform', { params: params })
}
// 平台广告添加
export const addpPlatform = async (store: any, params: any) => {
  return await request.post('/tcjxs/api/platform', qs.stringify(params))
}
// 平台广告单个查询
export const getPlatformById = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/platform/' + params.sId, { params: params })
}
// 平台广告修改
export const editPlatform = async (store: any, params: any) => {
  return await request.put('/tcjxs/api/platform/' + params.sId, qs.stringify(params))
}
// 平台广告删除 by  id 
export const deletePlatform = async (store: any, params: any) => {
  return await request.delete('/tcjxs/api/platform/' + params.sId, { params: params })
}


// 广告类型列表
export const getPosterTypeList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/poster-type', { params: params })
}
// 广告类型添加
export const addPosterType = async (store: any, params: any) => {
  return await request.post('/tcjxs/api/poster-type', qs.stringify(params))
}
// 广告类型单个查询
export const getPosterTypeById = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/poster-type/' + params.sId, { params: params })
}
// 广告类型修改
export const editPosterType = async (store: any, params: any) => {
  return await request.put('/tcjxs/api/poster-type/' + params.sId, qs.stringify(params))
}
// 广告类型删除 by  id 
export const deletePosterType = async (store: any, params: any) => {
  return await request.delete('/tcjxs/api/poster-type/' + params.sId, { params: params })
}



// 用户积分列表
export const getUserCreditList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/user/credit', { params: params })
}
// 用户积分操作
export const editUserCreditSum = async (store: any, params: any) => {
  return await request.put('/tcjxs/api/user/credit/' + params.sId, qs.stringify(params))
}
// 用户积分流水
export const getUserCreditRecordList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/user/credit-record', { params: params })
}

// 话题列表
export const getTopicList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/topic', { params: params })
}
// 话题添加
export const addTopic = async (store: any, params: any) => {
  return await request.post('/tcjxs/api/topic', qs.stringify(params))
}
// 话题单个查询
export const getTopicById = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/topic/' + params.sId, { params: params })
}
// 话题修改
export const editTopic = async (store: any, params: any) => {
  return await request.put('/tcjxs/api/topic/' + params.sId, qs.stringify(params))
}
// 话题删除 by  id 
export const deleteTopic = async (store: any, params: any) => {
  return await request.delete('/tcjxs/api/topic/' + params.sId, { params: params })
}

// 评论列表
export const getCommentList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/comment', { params: params })
}
// 评论删除 by  id 
export const deleteComment = async (store: any, params: any) => {
  return await request.delete('/tcjxs/api/comment/' + params.sId, { params: params })
}


// 数据统计-app端列表
export const getDataManageAppList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/data-manage/app', { params: params })
}
// 数据统计-设备激活数量列表
export const getDataManageDeviceList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/data-manage/device', { params: params })
}
// 数据统计-微信-公众号数据统计
export const getDMOfficialAccountList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/data-manage/officialAccount', { params: params })
}
// 数据统计-官网PV
export const getOfficialPvList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/data-manage/officialPv', { params: params })
}
// 数据统计-官网硬件销售数量
export const getOfficialSaleList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/data-manage/officialSale', { params: params })
}


// 用户管理-用户列表
export const getUserList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/user', { params: params })
}
// 用户管理-用户上报记录
export const getUserReportList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/user/' + params.sId + '/report', { params: params })
}

// 推送消息列表
export const getMessageList = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/message', { params: params })
}
// 推送消息添加
export const addMessage = async (store: any, params: any) => {
  return await request.post('/tcjxs/api/message', qs.stringify(params))
}
// 推送消息单个查询
export const getMessageById = async (store: any, params: any) => {
  return await request.get('/tcjxs/api/message/' + params.sId, { params: params })
}
// 推送消息修改
export const editMessage = async (store: any, params: any) => {
  return await request.put('/tcjxs/api/message/' + params.sId, qs.stringify(params))
}
// 推送消息删除 by  id 
export const deletMmessage = async (store: any, params: any) => {
  return await request.delete('/tcjxs/api/message/' + params.sId, { params: params })
}
// 消息推送
export const pushMessage = async (store: any, params: any) => {
  return await request.post('/tcjxs/api/push/message/' + params.sId, qs.stringify(params))
}



// 获取留言列表
export const getFeedBackApp = async (store: any, params: any) => {
  return await request.get('/tcapp/AdPush/Api/getFeedBackApp', { params: params })
}
// app反馈回复接口
export const ajaxAppReply = async (store: any, params: any) => {
  return await request.get('/tcapp/AdPush/Api/ajaxAppReply', { params: params })
}
