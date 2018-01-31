//app.js
const reLogin = require('utils/login.js');
const apiUrl = require('utils/constant.js');

App({
  onLaunch: function (msg) {
    wx.setEnableDebug({
      enableDebug: true
    })

    let that = this;
    that.globalData.shareTicket = msg.shareTicket;
    if (msg.query.shareId) {
      that.globalData.shareId = msg.query.shareId;
      console.log('分享人ID:', msg.query.shareId);
    }

    wx.showShareMenu({
      withShareTicket: true
    })


    wx.checkSession({
      success: function () {
        wx.getStorage({
          key: 'sessionKey',
          success: function (res) {
            that.globalData.sessionKey = res.data
          }
        })
        wx.showLoading({
          title: "登录中..."
        });

        wx.login({
          success: function (loginData) {
            wx.getUserInfo({
              data: { lang: 'zh_CN' },
              success: res => {
                wx.hideLoading();
                console.log('微信后台拉取用户信息', res)
                // 可以将 res 发送给后台解码出 unionId
                that.globalData.userInfo = res.userInfo

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
              }
            })

          },
          fail: function () {
            wx.hideLoading();
            wx.showToast({
              title: '登录失败',
              duration: 1500,
              image: 'images/caution.png'
            })
          }
        })
      },
      fail: function (err) {
        console.log('checkSession失败fail', err);
      }
    })
  },



  globalData: {
    shareId: 0,
    shareTicket: "",
    userInfo: null,
    sessionKey: "",
    pointInfo: ""
  }
})