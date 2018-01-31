const reLogin = require('login.js');
// const app = getApp();
// const apiAdmin = "http://www.jianbid.com:8080/red-api"; //prod
const apiAdmin = "https://www.mysum.cn/red-api"; //prod
// const apiAdmin = "";  //prod

//appid = wx4e1d36acf776dd37  神马说说
//appid = wxb3c0d9567950b78a  神马口令

const apiUrl = {
  ADMIN: apiAdmin,
  UPLOAD_FILE: apiAdmin + "/util/uploadFile.jhtml",  //上传文件

  LOGIN: apiAdmin + "/user/wxlogin.jhtml",  //微信登录***
  REGISTER: apiAdmin + "/user/wxRegister.jhtml",  //微信注册***
  ADD_ALIPAY: apiAdmin + "/user/addAlipay.jhtml",  //绑定支付宝***
  DRAW_ALIPAY: apiAdmin + "/user/drawAlipay.jhtml",  //提现到支付宝***
  DRAW_WECHAT: apiAdmin + "/user/drawWx.jhtml",  //提现到微信***

  ADD_TXT_RED: apiAdmin + "/red/addRed.jhtml",  //添加红包***
  GET_SELF_VOICE_RED: apiAdmin + "/red/getSelfRed.jhtml",  //获取自己发出的语音红包***
  GET_SELF_SEND_TOTAL: apiAdmin + "/user/getUserSendRedTotal.jhtml",  //获取用户发送红包数据统计***
  GET_WIN_VOICE_RED: apiAdmin + "/red/getWinRed.jhtml",  //用户获取抽到的语音红包***
  GET_WIN_TOTAL: apiAdmin + "/user/getUserGetRedTotal.jhtml",  //获取用户抢到红包数据统计***
  
  GET_VOICE_RED_DETAIL: apiAdmin + "/red/getRedDetail.jhtml",  //获取语音红包详情***
  GET_VOICE_WIN_RECORD: apiAdmin + "/red/getWinRecord.jhtml",  //获取语音红包领取记录***
  GET_PUBLIC_VOICE_RED: apiAdmin + "/red/getPublicRed.jhtml",  //获取广场语音红包***
  // GET_TODAY_VOICE_RED: apiAdmin + "/red/getTodayRedData.jhtml",  //获取今日语音红包统计数据
  WIN_RED_PACKET: apiAdmin + "/red/winRed.jhtml",  //抢红包***
  GET_TODAY_LIST: apiAdmin + "/red/getTodaylist.jhtml",  //获取今日土豪/最佳榜***
  GET_MY_RANKING: apiAdmin + "/user/getMyRanking.jhtml",  //获取自己今日土豪/最佳榜 排名***
  GET_USER_INFO: apiAdmin + "/user/getUserInfo.jhtml",  //获取用户信息***

  GET_WX_CODE: apiAdmin + "/util/getWxjsCode.jhtml",  //获取小程序二维码***
  GET_ADVER: apiAdmin + "/util/getAvder.jhtml",  //获取广告链接
  GET_FORM_ID: apiAdmin + "/util/getFormId.jhtml",  //获取微信formId

  EDIT_USER_INFO: apiAdmin + "/user/editUserInfo.jhtml",  //编辑用户信息***
  ADD_PLAN: apiAdmin + "/adverPlan/addPlan.jhtml",  //添加推广计划
  DEL_PLAN: apiAdmin + "/adverPlan/delPlan.jhtml",  //删除推广计划***
  EDIT_PLAN: apiAdmin + "/adverPlan/editPlan.jhtml",  //修改推广计划
  GET_PLAN_LIST: apiAdmin + "/adverPlan/getPlanList.jhtml",  //获取用户推广计划列表***
  GET_PLAN_DETAIL: apiAdmin + "/adverPlan/getPlanDetail.jhtml",  //获取用户推广计划详情***
  GET_USER_CARD: apiAdmin + "/red/getRedUserCard.jhtml",  //获取红包用户名片***

  responseCodeCallback: function (responseCode, responseDesc, data, that){
    // console.log('错误码', responseCode, responseDesc, data)
    switch(responseCode){
      case "2000":
        break;
      case "4000":
        //登录
        // if(that)
        reLogin(null,apiUrl,that);
        break;
      case "4001":
        wx.showModal({
          title: '提示',
          content: responseDesc,
          showCancel: false
        })
        break;
      case "4002":
        register(null, apiUrl,that)
        // wx.showToast({
        //   title: responseDesc,
        //   icon: 'loading',
        //   duration: 1500
        // })
        break;
      case "4003":
        wx.showModal({
          title: '提示',
          content: responseDesc,
          showCancel: false
        })
        break;
      case "4004":
        wx.showModal({
          title: '提示',
          content: responseDesc,
          showCancel: false
        })
        break;
      case "4005":
        wx.showModal({
          title: '提示',
          content: responseDesc,
          showCancel: false
        })
        break;
      case "5000":
        wx.showModal({
          title: '提示',
          content: responseDesc,
          showCancel: false
        })
        break;
      case "5001":
        wx.showModal({
          title: '提示',
          content: responseDesc,
          showCancel: false
        })
        break;
      // default:
      //   wx.showModal({
      //     title: '提示',
      //     content: '错误：'+ responseCode,
      //     showCancel: false
      //   })

    }
  }
}

function register(app, apiUrl, that){
  wx.showLoading({
    title: "登录中..."
  });

  let _app = app;
  if (!app) {
    _app = getApp();
  }

  console.log('准备注册');
  // wx.getSetting({
  //   success: res => {
  //     if (!res.authSetting['scope.userInfo']) {
  //       wx.showModal({
  //         title: '提示',
  //         content: '小程序需要获取用户信息权限才能正常使用',
  //         showCancel: false,
  //         success: function (res) {
  //           if (res.confirm) {
  //             wx.openSetting({
  //               success: function (data) {
  //                 if (data) {
  //                   if (data.authSetting["scope.userInfo"] == true) {
  //                     wx.getUserInfo({
  //                       data: { lang: 'zh_CN' },
  //                       success: res => {
  //                         console.log('微信后台拉取用户信息', res)
  //                         that.globalData.userInfo = res.userInfo
  //                       }
  //                     })
  //                     wx.request({
  //                       url: apiUrl.GET_USER_INFO,
  //                       method: "GET",
  //                       header: {
  //                         'content-type': 'application/x-www-form-urlencoded',
  //                         'sessionKey': that.globalData.sessionKey
  //                       },
  //                       success: function (res) {
  //                         apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
  //                         if (res.data.responseCode == 2000) {
  //                           console.log('自己后台拉取用户信息pointInfo', res);
  //                           that.globalData.pointInfo = {
  //                             aliAccount: res.data.data.aliAccount,
  //                             point: res.data.data.userPoint,
  //                             money: res.data.data.userMoney,
  //                             id: res.data.data.id
  //                           }
  //                         }
  //                       }
  //                     })
  //                   }
  //                 }
  //               },
  //               fail: function () {
  //                 console.info("设置失败返回数据");
  //               }
  //             });
  //           }
  //         }
  //       })
  //     }else {
        wx.getUserInfo({
          data: {
            lang: 'zh_CN',
            withCredentials: true
          },
          success: function (userMsg) {
            _app.globalData.userInfo = userMsg.userInfo
            wx.request({
              url: apiUrl.REGISTER,
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'sessionKey': _app.globalData.sessionKey
              },
              data: {
                encryptedData: userMsg.encryptedData,
                iv: userMsg.iv,
                shareUserId: _app.globalData.shareId
              },
              success: function (regData) {
                wx.hideLoading();
                console.log(regData, _app.globalData.sessionKey)
                apiUrl.responseCodeCallback(regData.data.responseCode, regData.data.responseDesc, regData.data.data);
                if (regData.data.responseCode == 2000) {
                  wx.request({
                    url: apiUrl.GET_USER_INFO,
                    method: "GET",
                    header: {
                      'content-type': 'application/x-www-form-urlencoded',
                      'sessionKey': _app.globalData.sessionKey
                    },
                    success: function (res) {
                      apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
                      if (res.data.responseCode == 2000) {
                        console.log('constant页面pointInfo', res, 'that', that);
                        _app.globalData.pointInfo = res.data.data
                        if (that && that.onShow) that.onShow();
                      }
                    }
                  })
                }
              },
              fail: function (err) {
                wx.hideLoading();
                wx.showToast({
                  title: '登录失败',
                  duration: 1500,
                  image: '../images/caution.png'
                })
                console.log('apiUrl.REGISTER fail ', err);
              }
            })
          },
          fail: function (err) {
            wx.hideLoading();
            console.log('getuserinfo错误信息', err);
            wx.showModal({
              title: '提示',
              content: '小程序需要获取用户信息权限才能正常使用',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: function (data) {
                      if (data) {
                        if (data.authSetting["scope.userInfo"] == true) {
                          // wx.showModal({
                          //   title: '友情提示',
                          //   showCancel: false,
                          //   confirmText: '知道了',
                          //   content: '神马口令仅用于娱乐休闲使用，严禁发布包含污秽、色情、违禁、谣言等不良信息，一经发现永久封号，系统将自动屏蔽删除不良信息。'
                          // })
                          wx.getUserInfo({
                            data: { lang: 'zh_CN' },
                            success: res => {
                              console.log('微信后台拉取用户信息', res)
                              that.globalData.userInfo = res.userInfo
                            }
                          })
                          wx.request({
                            url: apiUrl.GET_USER_INFO,
                            method: "GET",
                            header: {
                              'content-type': 'application/x-www-form-urlencoded',
                              'sessionKey': that.globalData.sessionKey
                            },
                            success: function (res) {
                              apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
                              if (res.data.responseCode == 2000) {
                                console.log('自己后台拉取用户信息pointInfo', res);
                                that.globalData.pointInfo = res.data.data
                              }
                            }
                          })
                        }
                      }
                    },
                    fail: function () {
                      console.info("设置失败返回数据");
                    }
                  });
                }
              }
            })

            // wx.showToast({
            //   title: '登录失败',
            //   duration: 1500,
            //   image: '../images/caution.png'
            // })
            // console.log(err)
          }
        })
  //     }
  //   }
  // })
}

module.exports = apiUrl;