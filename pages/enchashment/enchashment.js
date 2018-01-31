// pages/enchashment/enchashment.js
const app = getApp();
const apiUrl = require('../../utils/constant.js');
const getUserInfo = require('../../utils/getUserInfo.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pointInfo: {},
    enchashCount: null,
    curInputAliAcc: '',
    curInputCash: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  drawAll: function(){
    this.setData({
      enchashCount: app.globalData.pointInfo.userMoney,
      curInputCash: app.globalData.pointInfo.userMoney
    })
    
  },
  inputAliAccount: function(e){
    const value = e.detail.value.replace(/[^\x00-\xff]/g, '').replace(/(^\s*)|(\s*$)/g, "");
    this.setData({
      curInputAliAcc: value
    })
    return value
  },
  inputCash: function(e){
    let value = e.detail.value;
    if (value.toString().split(".")[1] && value.toString().split(".")[1].length > 2) {
      value =  Number(value).toFixed(2);
    }
    this.setData({
      curInputCash: value
    })
    return value
  },
  //添加支付宝账号
  addAliAccount: function(){
    let that = this;
    console.log(that.data.curInputAliAcc)
    if (!!that.data.curInputAliAcc){
      wx.request({
        url: apiUrl.ADD_ALIPAY,
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'sessionKey': app.globalData.sessionKey
        },
        data: {
          aliAccount: that.data.curInputAliAcc
        },
        success: function (res) {
          apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
          if (res.data.responseCode == 2000) {
            console.log('alpay account', res);
            app.globalData.pointInfo.aliAccount = that.data.curInputAliAcc
            that.setData({
              pointInfo: app.globalData.pointInfo
            })
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1500
            })
          }
        }
      })
    }else {
      wx.showModal({
        title: '提示',
        content: '账号不能为空',
        showCancel: false
      })
    }
  },

  changeAliAccount: function(){
    let that = this;
    app.globalData.pointInfo.aliAccount = ''
    this.setData({
      pointInfo: app.globalData.pointInfo,
      curInputAliAcc: ''
    })
  },

  //提现
  enchashSubmit: function(){
    let that = this;
    //提现到支付宝
    // if (that.data.curInputCash > 0 && app.globalData.pointInfo.aliAccount.length > 0){
    //   wx.showModal({
    //     title: '提示',
    //     content: '确认提现 ' + that.data.curInputCash + '元 到账户' + app.globalData.pointInfo.aliAccount +'吗？',
    //     showCancel: true,
    //     success: function (res){
    //       if (res.confirm) {
    //         wx.request({
    //           url: apiUrl.DRAW_ALIPAY,
    //           method: "POST",
    //           header: {
    //             'content-type': 'application/x-www-form-urlencoded',
    //             'sessionKey': app.globalData.sessionKey
    //           },
    //           data: {
    //             money: that.data.curInputCash
    //           },
    //           success: function (res) {
    //             apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
    //             if (res.data.responseCode == 2000) {
    //               console.log('提现成功', res);
    //               wx.showToast({
    //                 title: '提现成功',
    //                 icon: 'success',
    //                 duration: 1500,
    //                 mask: true
    //               })
    //               wx.request({
    //                 url: apiUrl.GET_USER_INFO,
    //                 method: "GET",
    //                 header: {
    //                   'content-type': 'application/x-www-form-urlencoded',
    //                   'sessionKey': app.globalData.sessionKey
    //                 },
    //                 success: function (res) {
    //                   apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
    //                   if (res.data.responseCode == 2000) {
    //                     app.globalData.pointInfo = res.data.data;
    //                     that.setData({
    //                       pointInfo: app.globalData.pointInfo,
    //                     })
    //                   }

    //                 }
    //               })
    //             }
    //           }
    //         })
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    // } else if (app.globalData.pointInfo.aliAccount.length <= 0){
    //   wx.showModal({
    //     title: '提示',
    //     content: '请先添加提现账号',
    //     showCancel: false
    //   })
    // }else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请输入提现金额',
    //     showCancel: false
    //   })
    // }

    //提现到微信
    if (that.data.curInputCash && that.data.curInputCash >= 2 ){
      wx.showModal({
        title: '提示',
        content: '确认提现 ' + that.data.curInputCash + '元 到微信零钱吗？',
        showCancel: true,
        success: function (res){
          if (res.confirm) {
            wx.showLoading({
              title: '提现中...',
              mask: true
            });
            wx.request({
              url: apiUrl.DRAW_WECHAT,
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'sessionKey': app.globalData.sessionKey
              },
              data: {
                money: that.data.curInputCash
              },
              success: function (res) {
                wx.hideLoading();
                apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
                if (res.data.responseCode == 2000) {
                  console.log('提现成功', res);
                  wx.showToast({
                    title: '提现成功',
                    icon: 'success',
                    duration: 1500,
                    mask: true
                  })
                  wx.request({
                    url: apiUrl.GET_USER_INFO,
                    method: "GET",
                    header: {
                      'content-type': 'application/x-www-form-urlencoded',
                      'sessionKey': app.globalData.sessionKey
                    },
                    success: function (res) {
                      apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
                      if (res.data.responseCode == 2000) {
                        app.globalData.pointInfo = res.data.data
                        that.setData({
                          pointInfo: app.globalData.pointInfo,
                        })
                      }

                    }
                  })
                }
              },
              fail: function(err){
                wx.hideLoading();
                console.log(err)
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (that.data.curInputCash && that.data.curInputCash < 2){
      wx.showModal({
        title: '提示',
        content: '提现金额至少2元',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请输入提现金额',
        showCancel: false
      })
    }
    
  },

  goSuggest: function () {
    wx.navigateTo({
      url: '/pages/suggestion/suggestion'
    })
  },
  goQA: function () {
    wx.navigateTo({
      url: '/pages/QA/QA'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    getUserInfo(app, that, null);

    this.setData({
      curInputAliAcc: app.globalData.pointInfo.aliAccount
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
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
  }
})