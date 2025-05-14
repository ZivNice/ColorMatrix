export async function processImage(imagePath) {
  // 1. 加载图片
  const imageInfo = await wx.getImageInfo({
    src: imagePath
  })

  // 2. 创建画布上下文
  const ctx = wx.createCanvasContext('processCanvas')
  
  // 3. 绘制图片到画布
  ctx.drawImage(imagePath, 0, 0, 300, 300)
  
  // 4. 获取画布数据
  const imageData = ctx.getImageData(0, 0, 300, 300)
  
  // 5. 分析图像，识别颜色
  const matrix = analyzeColors(imageData)
  
  return matrix
}

function analyzeColors(imageData) {
  const matrix = []
  const cellSize = 100 // 假设图像被等分为3x3的网格
  
  for (let i = 0; i < 3; i++) {
    const row = []
    for (let j = 0; j < 3; j++) {
      const color = getAverageColor(imageData, i, j, cellSize)
      const colorCode = mapColorToCode(color)
      row.push(colorCode)
    }
    matrix.push(row)
  }
  
  return matrix
}

function getAverageColor(imageData, row, col, cellSize) {
  // 计算区域平均颜色
  let r = 0, g = 0, b = 0
  const startX = col * cellSize
  const startY = row * cellSize
  
  for (let y = startY; y < startY + cellSize; y++) {
    for (let x = startX; x < startX + cellSize; x++) {
      const idx = (y * imageData.width + x) * 4
      r += imageData.data[idx]
      g += imageData.data[idx + 1]
      b += imageData.data[idx + 2]
    }
  }
  
  const pixels = cellSize * cellSize
  return {
    r: Math.round(r / pixels),
    g: Math.round(g / pixels),
    b: Math.round(b / pixels)
  }
}

function mapColorToCode(color) {
  const { r, g, b } = color
  
  // 转换为HSV颜色空间以提高识别准确度
  const hsv = rgbToHsv(r, g, b)
  const { h, s, v } = hsv

  // 白色判断（低饱和度，高亮度）
  if (s < 0.15 && v > 0.9) return 7 // 白色

  // 提高颜色识别的敏感度
  if (h >= 270 && h <= 330 && s > 0.3) return 1 // 紫色
  if (h >= 180 && h < 270 && s > 0.3) return 2  // 蓝色
  if (h >= 90 && h < 180 && s > 0.3) return 3   // 绿色
  if (h >= 45 && h < 90 && s > 0.3) return 4    // 黄色
  if (h >= 20 && h < 45 && s > 0.3) return 5    // 橙色
  if ((h >= 330 || h < 20) && s > 0.3) return 6 // 红色
  
  return 0 // 未识别
}
