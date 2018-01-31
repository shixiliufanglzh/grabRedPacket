// pages/createRedPacket/createRedPacket.js
const app = getApp();
const apiUrl = require('../../utils/constant.js');
const getUserInfo = require('../../utils/getUserInfo.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    formId: 0,
    pointInfo: {},
    fee: '0.00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    getUserInfo(app, that, null);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '红包雨来了，不拼运气拼手速！',
      path: '/pages/square/square?shareId=' + app.globalData.pointInfo.id,
      // imageUrl: '../../images/share_cut.jpg',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享失败',
          image: '../../images/caution.png',
          duration: 2000
        })
      }
    }
  },

  //金额的输入限制
  limitInput: function(e) {
    const value = e.detail.value;
    this.setData({
      fee: (value * 0.02).toFixed(2)
    })
    if (value.toString().split(".")[1] && value.toString().split(".")[1].length > 2 ){
      return Number(value).toFixed(2);
    }
  },

  /**
   * 表单提交
   */
  formSubmit: function (e) {
    let that = this;
    console.log('form发生了submit事件：', e.detail);
    this.setData({
      formId: e.detail.formId
    })
    // let useCash = 2;
    // if (e.detail.value.cashCheck.indexOf('cash') != -1) { useCash = 1 }

    if (!e.detail.value.money) {
      wx.showModal({
        title: '提示',
        content: '请输入红包金额',
        showCancel: false
      })
    } else if (!e.detail.value.count) {
      wx.showModal({
        title: '提示',
        content: '请输入红包数量',
        showCancel: false
      })
    } else if (e.detail.value.count > 20000 || e.detail.value.count < 100) {
      wx.showModal({
        title: '提示',
        content: '红包数量超过范围',
        showCancel: false
      })
    } else if (e.detail.value.money < 1 || (e.detail.value.money / e.detail.value.count) < 0.01) {
      wx.showModal({
        title: '提示',
        content: '红包总金额不少于1元且单个红包不少于0.01元',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确认支付' + (Number(e.detail.value.money)*1.02).toFixed(2) + '元',
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '支付中...',
              mask: true
            });
            
            const submitMsg = {
              money: e.detail.value.money,
              amount: e.detail.value.count,
              leaveMsg: e.detail.value.msg ? e.detail.value.msg : '',
              payType: 1,
              prepayId: e.detail.formId
            }

            console.log('发红包参数', submitMsg);

            wx.request({
              url: apiUrl.ADD_TXT_RED,
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded', // 默认值
                'sessionKey': app.globalData.sessionKey
              },
              data: submitMsg,
              success: function (res) {
                wx.hideLoading();
                apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
                if (res.data.responseCode == 2000) {
                  console.log(res);
                  const payMsg = res.data.data.payResult;
                  const payType = res.data.data.payType;
                  const redId = res.data.data.redId;
                  if (payType == 1) {
                    wx.requestPayment({
                      'timeStamp': payMsg.timeStamp,
                      'nonceStr': payMsg.nonceStr,
                      'package': payMsg.package,
                      'signType': 'MD5',
                      'paySign': payMsg.paySign,
                      'success': function (res) {
                        //微信支付成功
                        wx.showToast({
                          title: '支付成功',
                          icon: 'success',
                          duration: 1500,
                          complete: function () {
                            that.init(e);
                            wx.navigateTo({
                              url: '/pages/redPacketDetail/redPacketDetail?redId=' + redId
                            })
                          }
                        })
                      },
                      'fail': function (res) {

                      }
                    })
                  } else if (payType == 3) {
                    //余额支付完成
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 1500,
                      mask: true,
                      complete: function () {
                        that.init(e);
                        wx.navigateTo({
                          url: '/pages/redPacketDetail/redPacketDetail?redId=' + redId
                        })
                      }
                    })
                  }
                } else {
                  wx.showToast({
                    title: '支付失败',
                    image: '../../images/caution.png',
                    duration: 2000
                  })
                }
              },
              fail: function () {
                wx.hideLoading();
                wx.showToast({
                  title: '支付失败',
                  image: '../../images/caution.png',
                  duration: 2000
                })
              }
            })
          }
        },
      }) 
    }
  },

  init: function(e){
    console.log(e.detail.value)
    e.detail.value = {
      cashCheck:[],
      count: "",
      money: ""
    }
    
    this.setData({
      pointInfo: {}
    })
  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  }
})