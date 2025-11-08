<template>
  <div style="overflow: hidden">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import OnEvent from '../common/OnEvent'

export default {
  extends: OnEvent,
  props: {
    // { url, flip:{ horizontal, vertical } }
    propValue: { type: Object, required: true, default: () => ({}) },
    element: { type: Object, default: () => ({ style: { width: 0, height: 0 } }) },
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      img: null,
      imgDataURL: null,
      dpr: window.devicePixelRatio || 1,
      loadingToken: 0,
    }
  },
  watch: {
    'element.style.width'() { this.redraw() },
    'element.style.height'() { this.redraw() },
    'propValue.flip.vertical'() { this.redraw() },
    'propValue.flip.horizontal'() { this.redraw() },
    // 注意：不再 immediate，避免在 mounted 前触发
    'propValue.url': {
      handler() { this.loadAndDraw() },
      immediate: false,
    },
  },
  mounted() {
    this.canvas = this.$refs.canvas
    this.ctx = this.canvas && this.canvas.getContext ? this.canvas.getContext('2d') : null
    // 首次进入时尝试加载一次
    this.$nextTick(() => {
      this.redraw()
      if (this.propValue && this.propValue.url) this.loadAndDraw()
    })
  },
  beforeDestroy() {
    this.disposeImage()
  },
  methods: {
    // 任何绘制前都要有空值保护
    resizeCanvas() {
      if (!this.canvas || !this.ctx) return
      const style = (this.element && this.element.style) || {}
      const w = Number(style.width) || 0
      const h = Number(style.height) || 0
      const dpr = this.dpr

      this.canvas.width = Math.max(1, Math.floor(w * dpr))
      this.canvas.height = Math.max(1, Math.floor(h * dpr))
      this.canvas.style.width = `${w}px`
      this.canvas.style.height = `${h}px`
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    },

    redraw() {
      if (!this.canvas || !this.ctx) return
      if (this.img && this.img.complete) {
        this.drawImageToCanvas()
      } else {
        this.resizeCanvas()
        const style = (this.element && this.element.style) || {}
        const w = Number(style.width) || 0
        const h = Number(style.height) || 0
        this.ctx.clearRect(0, 0, w, h)
      }
    },

    async loadAndDraw() {
      if (!this.canvas || !this.ctx) return
      const url = this.propValue && this.propValue.url
      const token = ++this.loadingToken

      this.disposeImage()
      this.resizeCanvas()
      const style = (this.element && this.element.style) || {}
      const w = Number(style.width) || 0
      const h = Number(style.height) || 0
      this.ctx.clearRect(0, 0, w, h)

      if (!url) return

      try {
        const img = await this.loadImageSmart(url)
        if (token !== this.loadingToken) return
        this.img = img
        this.drawImageToCanvas()
      } catch (e) {
        try {
          const dataUrl = await this.urlToDataURL(url)
          if (token !== this.loadingToken) return
          this.imgDataURL = dataUrl
          const img = await this.loadImageSmart(dataUrl)
          if (token !== this.loadingToken) return
          this.img = img
          this.drawImageToCanvas()
        } catch (e2) {
          // 这里可用全局消息提示
          // console.error('图片加载失败', e2)
        }
      }
    },

    loadImageSmart(src) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
    },

    async urlToDataURL(url, timeout = 15000) {
      const ctrl = new AbortController()
      const to = setTimeout(() => ctrl.abort(), timeout)
      const res = await fetch(url, { mode: 'cors', signal: ctrl.signal })
      clearTimeout(to)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      return await new Promise((resolve, reject) => {
        const fr = new FileReader()
        fr.onload = () => resolve(fr.result)
        fr.onerror = reject
        fr.readAsDataURL(blob)
      })
    },

    drawImageToCanvas() {
      if (!this.canvas || !this.ctx || !this.img) return
      this.resizeCanvas()

      const style = (this.element && this.element.style) || {}
      const w = Number(style.width) || 0
      const h = Number(style.height) || 0

      this.ctx.clearRect(0, 0, w, h)

      const flip = this.propValue && this.propValue.flip ? this.propValue.flip : {}
      const hValue = flip.horizontal ? -1 : 1
      const vValue = flip.vertical ? -1 : 1

      this.ctx.translate(w / 2 - (w * hValue) / 2, h / 2 - (h * vValue) / 2)
      this.ctx.scale(hValue, vValue)
      this.ctx.drawImage(this.img, 0, 0, w, h)

      // 恢复到 dpr 的矩阵（不要恢复到 1，否则后续再画会糊）
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    },

    disposeImage() {
      this.img = null
      this.imgDataURL = null
    },
  },
}
</script>

