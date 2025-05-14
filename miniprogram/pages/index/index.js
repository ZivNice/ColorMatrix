// pages/index/index.js
Page({
  data: {
    userInfo: null,
    hasCamera: false  // 添加相机权限状态
  },
  
  onLoad() {
    this.checkAuth()
  },

  // 检查授权
  async checkAuth() {
    try {
      const auth = await wx.getSetting()
      
      // 更新相机权限状态
      this.setData({
        hasCamera: auth.authSetting['scope.camera'] || false
      })

      // 如果没有相机权限，主动请求
      if (!auth.authSetting['scope.camera']) {
        await wx.authorize({
          scope: 'scope.camera'
        })
        this.setData({
          hasCamera: true
        })
      }
    } catch (error) {
      console.error('相机授权错误：', error)
      this.setData({
        hasCamera: false
      })
      
      // 显示授权提示对话框
      wx.showModal({
        title: '提示',
        content: '需要相机权限才能进行扫描，是否前往设置？',
        success: (res) => {
          if (res.confirm) {
            // 打开设置页面
            wx.openSetting({
              success: (settingRes) => {
                this.setData({
                  hasCamera: settingRes.authSetting['scope.camera'] || false
                })
              }
            })
          }
        }
      })
    }
  },

  // 跳转到扫描页面
  goToScan() {
    // 检查是否有相机权限
    if (!this.data.hasCamera) {
      wx.showModal({
        title: '提示',
        content: '需要相机权限才能进行扫描，是否重新授权？',
        success: (res) => {
          if (res.confirm) {
            this.checkAuth()
          }
        }
      })
      return
    }

    // 有权限则跳转
    wx.navigateTo({
      url: '/pages/scan/scan',
      fail: (err) => {
        console.error('页面跳转失败：', err)
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        })
      }
    })
  },
  goToHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    })
  }

}
)
