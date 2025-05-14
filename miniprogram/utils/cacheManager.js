// utils/cacheManager.js
export const CacheManager = {
  // 设置缓存
  set(key, data) {
    try {
      wx.setStorageSync(key, data)
    } catch (e) {
      console.error('缓存设置失败：', e)
    }
  },

  // 获取缓存
  get(key) {
    try {
      return wx.getStorageSync(key)
    } catch (e) {
      console.error('缓存获取失败：', e)
      return null
    }
  }
}
