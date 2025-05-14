Page({
  data: {
    historyRecords: []
  },

  onLoad() {
    this.loadHistory()
  },

  onShow() {
    this.loadHistory()
  },

  loadHistory() {
    try {
      const history = wx.getStorageSync('scan_history') || []
      this.setData({
        historyRecords: history
      })
    } catch (e) {
      console.error('加载历史记录失败:', e)
      wx.showToast({
        title: '加载历史记录失败',
        icon: 'none'
      })
    }
  },

  deleteRecord(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '是否删除这条记录？',
      success: (res) => {
        if (res.confirm) {
          try {
            let history = wx.getStorageSync('scan_history') || []
            history = history.filter(item => item.id !== id)
            wx.setStorageSync('scan_history', history)
            this.loadHistory()
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
          } catch (e) {
            console.error('删除记录失败:', e)
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            })
          }
        }
      }
    })
  }
})
