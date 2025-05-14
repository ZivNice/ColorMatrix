// utils/errorHandler.js
export const ErrorHandler = {
  handle(error, type) {
    console.error(`${type} 错误:`, error)
    
    wx.showToast({
      title: this.getErrorMessage(type),
      icon: 'none'
    })
  },

  getErrorMessage(type) {
    const messages = {
      CAMERA_ERROR: '相机调用失败',
      PROCESS_ERROR: '图像处理失败',
      NETWORK_ERROR: '网络连接失败',
      AUTH_ERROR: '授权失败'
    }
    return messages[type] || '未知错误'
  }
}
