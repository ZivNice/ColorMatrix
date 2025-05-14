<div align="right">
  <a href="javascript:void(0)" onclick="switchLanguage('zh')" id="zh-link">中文</a> | 
  <a href="javascript:void(0)" onclick="switchLanguage('en')" id="en-link">English</a>
</div>

<div id="zh-content" style="display: block;">

# ColorMatrix 微信小程序

## 项目简介

ColorMatrix 是一个基于微信小程序平台开发的颜色矩阵识别工具。该应用可以通过相机拍照或从相册选择图片，自动分析图像中的颜色信息，并将其转换为标准化的3x3颜色矩阵。此外，应用还支持模拟紫外线(UV)照射下的颜色变化，并可以保存历史记录以供后续分析和比对。

## 功能特点

- **颜色矩阵识别**：将图像自动分割为3x3网格，精确分析每个区域的主要颜色
- **多种图像输入**：支持实时相机拍照和相册图片选择
- **UV响应模拟**：模拟紫外线照射下颜色的变化规则
- **历史记录**：自动保存扫描结果，方便查看和比对历史数据
- **多步骤处理**：支持多个步骤(E, A, B, C, D)的处理流程
- **高精度颜色分析**：采用HSV颜色空间进行更准确的颜色识别

## 应用场景

- 化学试纸快速分析
- 颜色卡识别与匹配
- 材料颜色变化监测
- 教育实验数据采集
- 质量控制颜色检测

## 技术实现

- 基于微信小程序原生框架开发
- 使用Canvas API进行图像处理
- 采用HSV颜色空间进行颜色识别
- 异步处理图像数据
- 本地存储保存历史记录

## 颜色编码系统

应用使用以下数字代码表示不同颜色：

| 代码 | 颜色 |
|-----|-----|
| 2 | 蓝色 |
| 3 | 绿色 |
| 4 | 黄色 |
| 5 | 橙色 |
| 6 | 红色 |
| 7 | 白色 |

## UV响应规则

当模拟UV响应时，颜色按以下规则转换：

| 原始颜色 | UV响应后 |
|---------|---------|
| 蓝色(2) | 绿色(3) |
| 绿色(3) | 黄色(4) |
| 黄色(4) | 橙色(5) |
| 橙色(5) | 红色(6) |
| 红色(6) | 蓝色(2) |
| 白色(7) | 白色(7) |

## 使用指南

1. **拍照识别**：
   - 点击相机按钮进行拍照
   - 系统自动分析图像并生成颜色矩阵

2. **从相册选择**：
   - 点击相册按钮选择已有图片
   - 系统自动分析图像并生成颜色矩阵

3. **UV响应验证**：
   - 获取颜色矩阵后，点击"UV响应"按钮
   - 系统自动模拟UV照射下的颜色变化
   - 验证结果是否符合预期

4. **查看历史记录**：
   - 点击"历史记录"按钮查看之前的扫描结果
   - 可以比对不同时间的扫描数据

## 项目结构

```
miniprogram/
├── pages/
│   ├── scan/                # 扫描页面
│   │   ├── scan.js          # 扫描页面逻辑
│   │   ├── scan.wxml        # 扫描页面结构
│   │   └── scan.wxss        # 扫描页面样式
│   ├── history/             # 历史记录页面
│   │   ├── history.js
│   │   ├── history.wxml
│   │   └── history.wxss
│   └── ...
├── app.js                   # 应用入口
├── app.json                 # 应用配置
└── app.wxss                 # 应用全局样式
```

## 安装与使用

1. 克隆仓库到本地
   ```
   git clone https://github.com/ZivNice/ColorMatrix.git
   ```

2. 使用微信开发者工具打开项目目录

3. 编译并预览小程序

## 开发与贡献

欢迎贡献代码或提出改进建议！请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 未来计划

- [ ] 增强颜色识别算法，提高识别准确率
- [ ] 添加更多颜色分析模式
- [ ] 支持自定义颜色矩阵规则
- [ ] 优化用户界面，提升用户体验
- [ ] 添加数据导出功能

## 许可证

[MIT License](LICENSE)

## 联系方式

项目维护者：[ZivNice](https://github.com/ZivNice)

---


---

*This README document is provided by the project developer, last updated on May 14, 2025*
</div>

<div id="en-content" style="display: none;">


# ColorMatrix WeChat Mini Program

## Project Introduction

ColorMatrix is a color matrix recognition tool developed on the WeChat Mini Program platform. This application can automatically analyze color information in images through camera photos or album selections, and convert them into standardized 3x3 color matrices. Additionally, the application supports simulating color changes under ultraviolet (UV) light and saves historical records for subsequent analysis and comparison.

## Features

- **Color Matrix Recognition**: Automatically divides images into 3x3 grids and accurately analyzes the main color of each area
- **Multiple Image Inputs**: Supports real-time camera photos and album image selection
- **UV Response Simulation**: Simulates color change rules under ultraviolet light
- **History Records**: Automatically saves scanning results for easy viewing and comparison of historical data
- **Multi-step Processing**: Supports multiple processing steps (E, A, B, C, D)
- **High-precision Color Analysis**: Uses HSV color space for more accurate color recognition

## Application Scenarios

- Rapid analysis of chemical test papers
- Color card recognition and matching
- Material color change monitoring
- Educational experiment data collection
- Quality control color detection

## Technical Implementation

- Developed based on WeChat Mini Program native framework
- Uses Canvas API for image processing
- Adopts HSV color space for color recognition
- Asynchronous processing of image data
- Local storage for saving historical records

## Color Coding System

The application uses the following numeric codes to represent different colors:

| Code | Color |
|------|-------|
| 2 | Blue |
| 3 | Green |
| 4 | Yellow |
| 5 | Orange |
| 6 | Red |
| 7 | White |

## UV Response Rules

When simulating UV response, colors are converted according to the following rules:

| Original Color | After UV Response |
|---------------|-------------------|
| Blue (2) | Green (3) |
| Green (3) | Yellow (4) |
| Yellow (4) | Orange (5) |
| Orange (5) | Red (6) |
| Red (6) | Blue (2) |
| White (7) | White (7) |

## User Guide

1. **Photo Recognition**:
   - Click the camera button to take a photo
   - The system automatically analyzes the image and generates a color matrix

2. **Select from Album**:
   - Click the album button to select an existing image
   - The system automatically analyzes the image and generates a color matrix

3. **UV Response Verification**:
   - After obtaining the color matrix, click the "UV Response" button
   - The system automatically simulates color changes under UV irradiation
   - Verify whether the results meet expectations

4. **View History Records**:
   - Click the "History" button to view previous scan results
   - Compare scan data from different times

## Project Structure

```
miniprogram/
├── pages/
│   ├── scan/                # Scan page
│   │   ├── scan.js          # Scan page logic
│   │   ├── scan.wxml        # Scan page structure
│   │   └── scan.wxss        # Scan page style
│   ├── history/             # History page
│   │   ├── history.js
│   │   ├── history.wxml
│   │   └── history.wxss
│   └── ...
├── app.js                   # Application entry
├── app.json                 # Application configuration
└── app.wxss                 # Application global style
```

## Installation and Usage

1. Clone the repository to local
   ```
   git clone https://github.com/ZivNice/ColorMatrix.git
   ```

2. Open the project directory with WeChat Developer Tools

3. Compile and preview the mini program

## Development and Contribution

Contributions of code or suggestions for improvement are welcome! Please follow these steps:

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Plans

- [ ] Enhance color recognition algorithms to improve recognition accuracy
- [ ] Add more color analysis modes
- [ ] Support custom color matrix rules
- [ ] Optimize user interface to enhance user experience
- [ ] Add data export functionality

## License

[MIT License](LICENSE)

## Contact

Project Maintainer: [ZivNice](https://github.com/ZivNice)
</div>

<script>
function switchLanguage(lang) {
  if (lang === 'zh') {
    document.getElementById('zh-content').style.display = 'block';
    document.getElementById('en-content').style.display = 'none';
    document.getElementById('zh-link').style.fontWeight = 'bold';
    document.getElementById('en-link').style.fontWeight = 'normal';
  } else {
    document.getElementById('zh-content').style.display = 'none';
    document.getElementById('en-content').style.display = 'block';
    document.getElementById('zh-link').style.fontWeight = 'normal';
    document.getElementById('en-link').style.fontWeight = 'bold';
  }
}

// 根据浏览器语言自动选择默认语言
(function() {
  const userLang = navigator.language || navigator.userLanguage;
  if (userLang.startsWith('zh')) {
    switchLanguage('zh');
  } else {
    switchLanguage('en');
  }
})();
</script>
