// pages/redPacketDetail/redPacketDetail.js
const app = getApp();
const apiUrl = require('../../utils/constant.js');
const getUserInfo = require('../../utils/getUserInfo.js');
const pageSize = 20;
let timer = null;
let socketOpen = false;
let socketMsgQueue = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    redId: 0,
    sign: '',
    userId: 0,
    redPacketDetail: {},
    pointInfo: {},
    grabList: [],
    grabResult: { code: 'end', money: 0, getNum: 0},
    shareMsg: '',

    isGrabing: false,
    hasResult: false,

    count: 30,
    redList: [],
    currentTime: 0
  },

  sendSocketMessage: function (msg) {
    console.log(JSON.stringify(msg))
    if(socketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify(msg)
      })
    } 
    // else {
    //   socketMsgQueue.push(JSON.stringify(msg))
    // }
  },

  startGrabRed: function(){
    let that = this;
    console.log('kaishi')

    //websocket
    wx.connectSocket({
      url: 'wss://www.mysum.cn:8081/ws'
    })

    wx.onSocketOpen(function (res) {
      console.log('ws连接成功',res);
      socketOpen = true;
      // for (var i = 0; i < socketMsgQueue.length; i++) {
      //   sendSocketMessage(socketMsgQueue[i])
      // }
      // socketMsgQueue = []
    })
    wx.onSocketError(function (err) {
      console.log('WebSocket连接打开失败，请检查！', err)
    })

    wx.onSocketMessage(function (res) {
      
      const resData = JSON.parse(res.data);
      console.log('收到服务器内容：' + res.data + '  parse后：' + resData);
      apiUrl.responseCodeCallback(resData.responseCode, resData.responseDesc, resData.data, that);
      if (resData.responseCode == 4006){
        wx.closeSocket(function (res) {
          socketOpen = false;
          console.log('WebSocket 已关闭！');
        })

        console.log('结束')
        if (resData.data.money > 0 && resData.data.getNum > 0 ){
          that.setData({
            grabResult: { 
              code: resData.data.code,
              money: resData.data.money,
              getNum: resData.data.getNum,
            }
          })
        }

        clearInterval(timer);
        that.setData({
          isGrabing: false,
          hasResult: true
        })
      } else if (resData.responseCode == 2000){
        that.setData({
          grabResult: {
            money: resData.data.money,
            getNum: resData.data.getNum
          }
        })
      }
    })

    this.setData({
      currentTime: new Date().getTime(),
      isGrabing: true
    })
    let redList = [];
    for (let i = 0; i < this.data.count; i++) {
      const top = -Math.floor(1600 * Math.random() + 200);
      const left = Math.floor(650 * Math.random());
      const rotate = Math.floor(60 * Math.random());
      redList.push({
        top,
        left,
        rotate,
        open: false
      })
    }
    this.setData({
      redList
    })

    timer = setInterval(function () {
      const currentTime = new Date().getTime();
      if (currentTime > that.data.currentTime + 16) {
        const redList = that.data.redList.map(item => {
          if (item.top <= 1800) {
            return {
              ...item,
              top: item.top + 8
            }
          } else {
            return {
              ...item,
              top: -Math.floor(1600 * Math.random() + 200),
              left: Math.floor(650 * Math.random()),
              rotate: Math.floor(60 * Math.random()),
              open: false
            }
          }
        })
        that.setData({ redList, currentTime })
      }
    }, 16)
  },

  stopGrabRed: function(){
    let that = this;
    wx.showModal({
      title: '提示',
      content: '如果现在停止抢红包，将会直接结算您的红包金额，不能再次参与本轮红包雨活动，确定结束吗？',
      cancelText: '继续抢',
      confirmText: '抢够了',
      success: function(res) {
        if(res.confirm){
          
          const msg = {
            path: '/end',
            redId: that.data.redId.toString(),
            userId: that.data.userId.toString(),
            sign: that.data.sign.toString(),
          }
          that.sendSocketMessage(msg)

        }
      }
    })
  },

  getRed: function (e) {
    if (socketOpen){
      console.log(this.data.redId, this.data.sign, this.data.userId);
      const redId = this.data.redId.toString();
      const sign = this.data.sign.toString();
      const userId = this.data.userId.toString();

      const msg = {
        path: '/winRed',
        redId: redId,
        userId: userId,
        sign: sign,
      }
      this.sendSocketMessage(msg)

      const idx = e.currentTarget.dataset.idx;
      const redList = this.data.redList.map((item, index) => {
        if (index == idx) {
          return {
            ...item,
            open: true
          }
        } else {
          return item
        }
      })
      this.setData({
        redList
      })
    }
  },

  closeResult: function(){
    this.setData({
      hasResult: false,
      pageNum: 1
    })
    this.onShow();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.sign){
      this.setData({
        sign: options.sign
      })
    }
    this.setData({
      userId: app.globalData.pointInfo.id,
      redId: options.redId
    })
    
  },
  

  //获取领取人列表
  getGrabList: function (pageSize, pageNum){
    let that = this;
    wx.request({
      url: apiUrl.GET_VOICE_WIN_RECORD,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      data: {
        pageSize: pageSize,
        pageNum: pageNum,
        redId: that.data.redId
      },
      success: function (res) {
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data);
        if (res.data.responseCode == 2000) {
          const resData = res.data.data;
          that.setData({
            grabList: resData
          })
        }
      }
    })
  },

  goToEnchash: function(){
    wx.navigateTo({
      url: '../enchashment/enchashment'
    })
  },

  goToCreate: function () {
    wx.reLaunch({
      url: '../createRedPacket/createRedPacket'
    })
  },

  goToShare: function () {
    console.log('share')
    this.onShareAppMessage()
  },
  goSuggest: function(){
    wx.navigateTo({
      url: '/pages/suggestion/suggestion'
    })
  },

  viewAvatar: function (e) {
    const redId = this.data.redId;

    if (!!e.currentTarget.dataset.avatar) {
      wx.previewImage({
        current: e.currentTarget.dataset.avatar, // 当前显示图片的http链接
        urls: [e.currentTarget.dataset.avatar] // 需要预览的图片http链接列表
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let that = this;
    getUserInfo(app, that, null);

    wx.request({
      url: apiUrl.GET_VOICE_RED_DETAIL,
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey': app.globalData.sessionKey
      },
      data: {
        redId: that.data.redId
      },
      success: function (res) {
        apiUrl.responseCodeCallback(res.data.responseCode, res.data.responseDesc, res.data.data, that);
        if (res.data.responseCode == 2000) {
          const resData = res.data.data;
          console.log(res);
          that.setData({
            redPacketDetail: resData,
            sign: that.data.sign ? that.data.sign : resData.redSign,
            shareMsg: resData.leaveMsg
          })
        }
      }
    })

    this.getGrabList(pageSize, this.data.pageNum)
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
    if (socketOpen){
      wx.closeSocket(function (res) {
        socketOpen = false;
        console.log('WebSocket 已关闭！');
      })
    }
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
          pageNum: 1
        })
        that.onShow();

        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if ((this.data.grabList.length % pageSize) == 0) {
      const addPageNum = this.data.pageNum + 1;
      this.setData({
        pageNum: addPageNum
      })
      this.getGrabList(pageSize, this.data.pageNum);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.shareMsg ? this.data.shareMsg : '红包雨来了，不拼运气拼手速！',
      path: '/pages/redPacketDetail/redPacketDetail?redId=' + this.data.redId + '&sign=' + this.data.sign,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          mask: true,
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享失败',
          mask: true,
          image: '../../images/caution.png',
          duration: 2000
        })
      }
    }
  }
})