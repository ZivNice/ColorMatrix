// utils/imageOptimization.js
export const optimizeImage = async (imagePath) => {
  // 1. 压缩图片
  const compressed = await compressImage(imagePath)
  
  // 2. 调整分辨率
  const resized = await resizeImage(compressed)
  
  return resized
}
