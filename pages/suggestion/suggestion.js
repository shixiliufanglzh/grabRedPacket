// pages/suggestion/suggestion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        val:'色情',
        id: 1,
        selected: false
      },
      {
        val: '诱导',
        id: 2,
        selected: false
      },
      {
        val: '骚扰',
        id: 3,
        selected: false
      },
      {
        val: '欺诈',
        id: 4,
        selected: false
      },
      {
        val: '恶意营销',
        id: 5,
        selected: false
      },
      {
        val: '与服务类目不符',
        id: 6,
        selected: false
      },
      {
        val: '违法犯罪',
        id: 7,
        selected: false
      },
      {
        val: '侵权（冒名、诽谤、抄袭）',
        id: 8,
        selected: false
      },
      {
        val: '不实信息',
        id: 9,
        selected: false
      },
      {
        val: '隐私信息收集',
        id: 10,
        selected: false
      },
      {
        val: '其他',
        id: 11,
        selected: false
      }
    ]
  },

  selectedReason: function(e){
    console.log(e.currentTarget.dataset.id)
    const newList = this.data.list.map(item => {
      if (item.id == e.currentTarget.dataset.id){
        return {
          ...item,
          selected: !item.selected
        }
      }else {
        return item
      }
    })

    this.setData({
      list: newList
    })
  },

  submitSugst: function(){
    let selectedIds = [];
    const list = this.data.list
    for(let i=0; i<list.length; i++){
      if (list[i].selected){
        selectedIds.push(list[i].id)
      }
    }
    if (selectedIds.length > 0){
      wx.showLoading({
        title: '提交中',
      })

      setTimeout(function () {
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1500,
          complete: function(){
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }, 1000)
    }else {
      wx.showModal({
        title: '提示',
        content: '请选择投诉信息',
        showCancel: false
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  }
})