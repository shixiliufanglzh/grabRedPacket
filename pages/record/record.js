// pages/record/record.js

const app = getApp();
const getUserInfo = require('../../utils/getUserInfo.js');
const apiUrl = require('../../utils/constant.js');
const pageSize = 20;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    sendPageNum: 1,
    receivePageNum: 1,
    navTab: ["我发出的", "我收到的"],
    currentNavtab: "0",
    userSend: {
      name: "",
      avatar: "",
      money: "",
      count: ""
    },
    userReceive: {
      name: "",
      avatar: "",
      money: "",
      count: ""
    },
    sendRecord: [],
    receiveRecord: []
  },

  switchTab: function (e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
    const curIndex = e.currentTarget.dataset.idx;
    this.setData({
      currentNavtab: curIndex,
      // sendPageNum: 1,
      // receivePageNum: 1,
      // sendRecord: [],
      // receiveRecord: []
    });
    // if (curIndex == 0){
    //   this.getSendList(pageSize, this.data.sendPageNum);
    // } else if (curIndex == 1) {
    //   this.getReceiveList(pageSize, this.data.receivePageNum);
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  getSendList: function(pageSize, pageNum) {
    let that = this;
    wx.request({
      url: apiUrl.GET_SELF_VOICE_RED,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      data: {
        pageSize: pageSize,
        pageNum: pageNum
      },
      success: function (res) {
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
        if (res.data.responseCode == 2000) {
          const resData = res.data.data;
          console.log(resData);        
          const sendList = resData.map(item => {
            return {
              id: item.id,
              token: item.content,
              name: item.userName,
              money: item.money,
              time: item.createDate,
              totalCount: item.amount,
              leftCount: item.leftAmount,
              redType: item.redType
            }
          })
          if (that.data.sendPageNum == 1){
            that.setData({
              sendRecord: sendList
            })
          }else {
            that.setData({
              sendRecord: [...that.data.sendRecord, ...sendList]
            })
          }
        }
        
      }
    })
  },

  getReceiveList: function (pageSize, pageNum) {
    let that = this;
    wx.request({
      url: apiUrl.GET_WIN_VOICE_RED,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      data: {
        pageSize: pageSize,
        pageNum: pageNum
      },
      success: function (res) {
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
        if (res.data.responseCode == 2000) {
          const resData = res.data.data;
          console.log(resData);        
          const receiveList = resData.map(item => {
            return {
              id: item.redId,
              name: item.userName,
              token: item.content,
              avatar: item.userPortrait,
              money: item.money,
              time: item.createDate
            }
          })
          if (that.data.receivePageNum == 1) {
            that.setData({
              receiveRecord: receiveList
            })
          } else {
            that.setData({
              receiveRecord: [...that.data.receiveRecord, ...receiveList]
            })
          }
        }
      }
    })
  },

  goToDetail: function(e){
    wx.navigateTo({
      url: '/pages/redPacketDetail/redPacketDetail?redId=' + e.currentTarget.dataset.redId
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
      sendPageNum: 1,
      receivePageNum: 1
    })
    
    wx.request({
      url: apiUrl.GET_SELF_SEND_TOTAL,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      success: function (res) {
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
        if (res.data.responseCode == 2000) {
          console.log('统计', res)
          that.setData({
            userSend: {
              name: app.globalData.userInfo.nickName,
              avatar: app.globalData.userInfo.avatarUrl,
              money: res.data.data.sendTotalMoney,
              count: res.data.data.sendTimes
            }
          })

          that.getSendList(pageSize, that.data.sendPageNum);
          that.getReceiveList(pageSize, that.data.receivePageNum);

          wx.request({
            url: apiUrl.GET_WIN_TOTAL,
            method: "GET",
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'sessionKey': app.globalData.sessionKey
            },
            success: function (res) {
              apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
              if (res.data.responseCode == 2000) {
                console.log('统计', res)
                that.setData({
                  userReceive: {
                    name: app.globalData.userInfo.nickName,
                    avatar: app.globalData.userInfo.avatarUrl,
                    money: res.data.data.getTotalMoney,
                    count: res.data.data.getTimes
                  }
                })
              }
            }
          })
        }
      }
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
    let that = this;
    wx.showLoading({
      title: "加载中...",
      mask: true,
      success: function () {
        that.setData({
          sendPageNum: 1,
          receivePageNum: 1
        })
        that.onLoad();
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.currentNavtab == 0 && (this.data.sendRecord.length % pageSize) == 0){
      const addPageNum = this.data.sendPageNum + 1;
      this.setData({
        sendPageNum: addPageNum
      })
      this.getSendList(pageSize, this.data.sendPageNum);
    } else if (this.data.currentNavtab == 1 && (this.data.receiveRecord.length % pageSize) == 0) {
      const addPageNum = this.data.receivePageNum + 1;
      this.setData({
        receivePageNum: addPageNum
      })
      this.getReceiveList(pageSize, this.data.receivePageNum);
    }
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