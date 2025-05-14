// utils/matrixProcessor.js
const ColorCode = {
  PURPLE: 1,
  BLUE: 2,
  GREEN: 3,
  YELLOW: 4,
  ORANGE: 5,
  RED: 6
};

// RGB颜色范围定义
const ColorRanges = {
  [ColorCode.PURPLE]: {
    r: { min: 128, max: 170 },
    g: { min: 0, max: 130 },
    b: { min: 128, max: 170 }
  },
  [ColorCode.BLUE]: {
    r: { min: 0, max: 100 },
    g: { min: 0, max: 100 },
    b: { min: 170, max: 255 }
  },
  [ColorCode.GREEN]: {
    r: { min: 0, max: 100 },
    g: { min: 170, max: 255 },
    b: { min: 0, max: 100 }
  },
  [ColorCode.YELLOW]: {
    r: { min: 200, max: 255 },
    g: { min: 200, max: 255 },
    b: { min: 0, max: 100 }
  },
  [ColorCode.ORANGE]: {
    r: { min: 200, max: 255 },
    g: { min: 100, max: 170 },
    b: { min: 0, max: 100 }
  },
  [ColorCode.RED]: {
    r: { min: 200, max: 255 },
    g: { min: 0, max: 100 },
    b: { min: 0, max: 100 }
  }
};

class MatrixProcessor {
  constructor() {
    this.matrixSize = 3;
  }

  // 识别单个像素的颜色
  identifyColor(r, g, b) {
    for (const [code, range] of Object.entries(ColorRanges)) {
      if (r >= range.r.min && r <= range.r.max &&
          g >= range.g.min && g <= range.g.max &&
          b >= range.b.min && b <= range.b.max) {
        return parseInt(code);
      }
    }
    return null;
  }

  // 处理图像数据并生成矩阵E
  processImageData(imageData, width, height) {
    const matrixE = Array(this.matrixSize).fill().map(() => Array(this.matrixSize).fill(0));
    const blockWidth = width / this.matrixSize;
    const blockHeight = height / this.matrixSize;

    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        const centerX = Math.floor((j + 0.5) * blockWidth);
        const centerY = Math.floor((i + 0.5) * blockHeight);
        const index = (centerY * width + centerX) * 4;
        
        const r = imageData[index];
        const g = imageData[index + 1];
        const b = imageData[index + 2];
        
        matrixE[i][j] = this.identifyColor(r, g, b);
      }
    }

    return matrixE;
  }

  // 生成Matrix A (UV响应矩阵)
  generateMatrixA(matrixE) {
    return matrixE.map(row => 
      row.map(color => {
        // 在UV光下显示特殊荧光效果的逻辑
        if (color === ColorCode.BLUE || color === ColorCode.RED) {
          return 1; // 有荧光反应
        }
        return 0; // 无荧光反应
      })
    );
  }

  // 生成Matrix B (PL响应矩阵)
  generateMatrixB(matrixE) {
    return matrixE.map(row =>
      row.map(color => {
        // PL效应下的响应逻辑
        if (color === ColorCode.BLUE || color === ColorCode.RED) {
          return 1;
        }
        return 0;
      })
    );
  }

  // 生成Matrix C (TPNB处理)
  generateMatrixC(matrixA, matrixB) {
    const matrixC = Array(this.matrixSize).fill().map(() => Array(this.matrixSize).fill(0));
    
    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        matrixC[i][j] = (matrixA[i][j] + matrixB[i][j]) % 2;
      }
    }
    
    return matrixC;
  }

  // 生成Matrix D (Angel矩阵)
  generateMatrixD(matrixC) {
    // 这里可以根据具体的转换规则实现
    // 示例实现：将matrixC中的1转换为特定的验证码
    return matrixC.map(row =>
      row.map(val => val === 1 ? Math.floor(Math.random() * 9) + 1 : 0)
    );
  }

  // 验证矩阵是否匹配预设标准
  validateMatrix(matrixD, standardMatrix) {
    if (!standardMatrix) return false;
    
    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        if (matrixD[i][j] !== standardMatrix[i][j]) {
          return false;
        }
      }
    }
    
    return true;
  }
}

module.exports = {
  MatrixProcessor,
  ColorCode
};
