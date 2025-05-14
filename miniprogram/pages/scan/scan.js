Page({
  data: {
    processing: false,
    showResult: false,
    resultMatrix: [],
    currentStep: 'E', 
  },

  async onReady() {
    // 获取canvas上下文
    const query = wx.createSelectorQuery()
    query.select('#processCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        this.canvas = canvas
        const ctx = canvas.getContext('2d')
        this.ctx = ctx
        
        // 设置canvas大小
        canvas.width = 300
        canvas.height = 300
      })
  },

  async takePhoto() {
    if (this.data.processing) return
    
    this.setData({ 
      processing: true,
      showResult: false 
    })

    try {
      const camera = wx.createCameraContext()
      
      // 拍照
      const photoRes = await new Promise((resolve, reject) => {
        camera.takePhoto({
          quality: 'high',
          success: resolve,
          fail: reject
        })
      })

      // 处理图片
      const matrix = await this.processImage(photoRes.tempImagePath)
      // 直接保存扫描结果到历史记录
      // this.saveToHistory(matrix)      
      this.setData({
        resultMatrix: matrix,
        showResult: true,
        currentStep: 'E'
      })

    } catch (error) {
      wx.showToast({
        title: '处理失败：' + error.message,
        icon: 'none'
      })
    } finally {
      this.setData({ processing: false })
    }
  },

  // 处理导入的图片
  async processImage(imagePath) {
    this.setData({ processing: true })
    
    try {
      // 获取 canvas 上下文
      const canvas = await new Promise(resolve => {
        const query = wx.createSelectorQuery()
        query.select('#processCanvas')
          .fields({ node: true, size: true })
          .exec((res) => resolve(res[0].node))
      })
      
      const ctx = canvas.getContext('2d')
      
      // 创建图片对象
      const image = canvas.createImage()
      await new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = reject
        image.src = imagePath
      })

      // 设置 canvas 尺寸
      const size = 300  // 处理图像的大小
      canvas.width = size
      canvas.height = size
      
      // 绘制图像并居中裁剪
      const scale = Math.max(size / image.width, size / image.height)
      const x = (size - image.width * scale) / 2
      const y = (size - image.height * scale) / 2
      
      ctx.drawImage(image, x, y, image.width * scale, image.height * scale)
      
      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, size, size)
      
      // 使用现有的颜色识别逻辑处理图像
      const matrix = await this.processImageData(imageData)
      
      // 显示结果
      this.setData({
        resultMatrix: matrix,
        showResult: true,
        processing: false
      })
          // 保存到历史记录
    await this.saveToHistory(matrix)
      
    } catch (error) {
      console.error('处理图片失败:', error)
      wx.showToast({
        title: '处理图片失败',
        icon: 'none'
      })
      this.setData({ processing: false })
    }
  },

  // 处理图像数据的方法
  async processImageData(imageData) {
    const cellSize = Math.floor(imageData.width / 3)
    const margin = Math.floor(cellSize * 0.2)  // 20% 的边距
    const matrix = []
    
    // 遍历 3x3 网格
    for (let row = 0; row < 3; row++) {
      const matrixRow = []
      for (let col = 0; col < 3; col++) {
        // 计算当前格子的中心区域
        const startX = col * cellSize + margin
        const startY = row * cellSize + margin
        const sampleWidth = cellSize - 2 * margin
        const sampleHeight = cellSize - 2 * margin
        
        // 采样区域的颜色
        const color = this.sampleAreaColor(
          imageData,
          startX,
          startY,
          sampleWidth,
          sampleHeight
        )
        
        // 将颜色映射为数字代码
        const colorCode = this.mapColorToCode(color)
        matrixRow.push(colorCode)
      }
      matrix.push(matrixRow)
    }
    
    return matrix
  },

  // 采样区域颜色的辅助方法
  sampleAreaColor(imageData, startX, startY, width, height) {
    let totalR = 0, totalG = 0, totalB = 0
    let count = 0
    
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) {
        const i = (y * imageData.width + x) * 4
        totalR += imageData.data[i]
        totalG += imageData.data[i + 1]
        totalB += imageData.data[i + 2]
        count++
      }
    }
    
    return {
      r: Math.round(totalR / count),
      g: Math.round(totalG / count),
      b: Math.round(totalB / count)
    }
  },

  
  analyzeColors(imageData, totalSize) {
    const matrix = []
    const cellSize = Math.floor(totalSize / 3) // 将区域平均分成3x3
    
    for (let i = 0; i < 3; i++) {
      const row = []
      for (let j = 0; j < 3; j++) {
        const color = this.getAverageColor(imageData, i, j, cellSize, totalSize)
        const colorCode = this.mapColorToCode(color)
        row.push(colorCode)
      }
      matrix.push(row)
    }
    
    return matrix
  },
  
// 优化的颜色分析函数
getAverageColor(imageData, row, col, cellSize) {
  let r = 0, g = 0, b = 0
  let count = 0
  const startX = col * cellSize
  const startY = row * cellSize
  
  // 只取中心区域的颜色样本，避免边界干扰
  const margin = Math.floor(cellSize * 0.2) // 增加边距到20%
  
  for (let y = startY + margin; y < startY + cellSize - margin; y++) {
    for (let x = startX + margin; x < startX + cellSize - margin; x++) {
      const idx = (y * imageData.width + x) * 4
      // 忽略过暗的像素点
      if (imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2] > 150) {
        r += imageData.data[idx]
        g += imageData.data[idx + 1]
        b += imageData.data[idx + 2]
        count++
      }
    }
  }
  
  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count)
  }
},

mapColorToCode(color) {
  const { r, g, b } = color

  // 转换为HSV颜色空间
  const hsv = this.rgbToHsv(r, g, b)
  const { h, s, v } = hsv

  // 白色、黑色和灰色的判断
  if (s < 0.3 || v < 0.2) {
      return 7  // 低饱和度或低亮度的颜色返回白色(7)
  }

  // 要求一定的饱和度和亮度
  if (s > 0.3) {
      // 红色: 330-360° 或 0-10°
      if (h >= 330 || h < 10) {
          return 6  // 红色
      }
      
      // 橙色: 10-45°
      if (h >= 10 && h < 45) {
          return 5  // 橙色（新增）
      }
      
      // 黄色: 45-70°
      if (h >= 45 && h < 70) {
          return 4  // 黄色
      }
      
      // 绿色: 70-180°
      if (h >= 70 && h < 180) {
          return 3  // 绿色
      }
      
      // 蓝色: 180-270°
      if (h >= 180 && h < 270) {
          return 2  // 蓝色
      }
  }
  
  // 默认返回白色
  return 7
},


// 优化的HSV转换函数
rgbToHsv(r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min
  
  let h = 0
  const s = max === 0 ? 0 : diff / max
  const v = max

  if (diff === 0) {
    h = 0
  } else if (max === r) {
    h = 60 * ((g - b) / diff % 6)
  } else if (max === g) {
    h = 60 * ((b - r) / diff + 2)
  } else if (max === b) {
    h = 60 * ((r - g) / diff + 4)
  }

  if (h < 0) h += 360

  return { h, s, v }
},

    
  getNextStep(currentStep) {
    const steps = ['E', 'A', 'B', 'C', 'D']
    const currentIndex = steps.indexOf(currentStep)
    return steps[currentIndex + 1] || 'D'
  },

// UV响应的转换规则
transformMatrix(matrix) {
  const newMatrix = matrix.map(row => [...row])
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const currentValue = matrix[i][j]
      // 更新的UV响应规则，区分橙色和红色
      switch (currentValue) {
        case 2: // 蓝色
          newMatrix[i][j] = 3  // 蓝色 -> 绿色
          break
        case 3: // 绿色
          newMatrix[i][j] = 4  // 绿色 -> 黄色
          break
        case 4: // 黄色
          newMatrix[i][j] = 5  // 黄色 -> 橙色
          break
        case 5: // 橙色
          newMatrix[i][j] = 6  // 橙色 -> 红色
          break
        case 6: // 红色
          newMatrix[i][j] = 2  // 红色 -> 蓝色
          break
        case 7: // 白色
          newMatrix[i][j] = 7  // 白色保持不变
          break
        default:
          // 保持原值
          break
      }
    }
  }
  return newMatrix
},
  // 保存扫描结果到历史记录
  // 保存扫描结果到历史记录
  saveToHistory(matrix) {
    try {
      // 获取现有历史记录
      let history = wx.getStorageSync('scan_history') || []
      
      // 创建新的记录
      const newRecord = {
        id: Date.now(),
        matrix: matrix,
        timestamp: new Date().toLocaleString(),
        step: this.data.currentStep // 记录当前步骤
      }
      
      // 将新记录添加到历史记录开头
      history.unshift(newRecord)
      
      // 限制历史记录数量，比如最多保存50条
      if (history.length > 50) {
        history = history.slice(0, 50)
      }
      
      // 保存到本地存储
      wx.setStorageSync('scan_history', history)
      
      // 显示提示（可选）
      wx.showToast({
        title: '已保存记录',
        icon: 'success',
        duration: 1000
      })
    } catch (e) {
      console.error('保存历史记录失败:', e)
    }
  },
  // 修改 verify 方法，在验证成功后保存记录
  verify() {
    const { resultMatrix } = this.data
    
    try {
      const transformedMatrix = this.transformMatrix(resultMatrix)
      
      wx.showToast({
        title: 'UV响应处理中...',
        icon: 'none',
        duration: 1500
      })

      this.setData({
        resultMatrix: transformedMatrix
      })

      const isValid = this.validateMatrix(transformedMatrix)
      
      if (isValid) {
        // 保存到历史记录
        this.saveToHistory(transformedMatrix)
      }

      setTimeout(() => {
        wx.showModal({
          title: isValid ? '验证成功' : '验证失败',
          content: isValid ? 'UV响应符合预期' : 'UV响应不符合预期',
          showCancel: false
        })
      }, 1500)

    } catch (error) {
      wx.showToast({
        title: '验证失败：' + error.message,
        icon: 'none'
      })
    }
  },
    // 跳转到历史记录页面
  goToHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    })
  },
  // 选择图片
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.processImage(tempFilePath)
      },
      fail: (err) => {
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        })
      }
    })
  },

  validateMatrix(matrix) {
    // 添加您的验证逻辑
    // 例如：检查特定位置的颜色是否符合预期
    return true // 返回验证结果
  }
})