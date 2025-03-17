class WatermarkProcessor extends VideoProcessor {
  constructor(port, options) {
    super()
    this.context = null
    this.watermarkImage = null
    port.addEventListener('message', (e) => {
      if (e.data.cmd === 'update_watermark_image') {
        this._updateWatermarkImage(e.data.data)
      }
    })
  }

  async processFrame(input, output) {
    this._renderFrame(input, output)
    return true
  }

  onInit() {
    const canvas = this.getOutput()
    if (canvas) {
      this.context = canvas.getContext('2d')
      if (!this.context) {
        console.error('2D context could not be initialized.')
      }
    }
  }

  onUninit() {
    this.context = null
    this.watermarkImage = null
  }

  _updateWatermarkImage(image) {
    this.watermarkImage = image
  }

  _renderFrame(input, output) {
    if (!this.context) return

    // Draw the video frame onto the canvas
    this.context.drawImage(input, 0, 0, output.width, output.height)

    // Overlay the watermark if available
    if (this.watermarkImage) {
      const watermarkWidth = this.watermarkImage.width
      const watermarkHeight = this.watermarkImage.height
      this.context.globalAlpha = 0.5
      this.context.drawImage(this.watermarkImage, 0, 0, watermarkWidth, watermarkHeight)
    }
  }
}

registerProcessor('watermark-processor', WatermarkProcessor)