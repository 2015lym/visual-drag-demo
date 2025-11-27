<template>
  <!-- 外层容器始终跟随画布的组件宽高 -->
  <div class="qr-wrap">
    <qrcode-vue
      :value="propValue.url || ''"
      :size="qrSize"
      level="M"
      render-as="canvas"
      foreground="#000"
      background="#fff"
      :key="qrSize"
    />
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'QrCodeComponent',
  components: { QrcodeVue },
  props: {
    // 建议 propValue 至少包含 text；其他都是可选项
    propValue: { type: Object, required: true, default: () => ({ text: '' }) },
    // 低代码里一贯传入 element，里面有 style.width/height
    element: { type: Object, required: true, default: () => ({ style: { width: 100, height: 100 } }) },
  },
  computed: {
    width() {
      return Number(this.element?.style?.width) || 200
    },
    height() {
      return Number(this.element?.style?.height) || 200
    },
    // qrcode-vue 只能生成正方形，用最短边；并给个最小值避免过小
    qrSize() {
      return Math.max(16, Math.floor(Math.min(this.width, this.height)))
    },
  },
}
</script>

<style scoped>
.qr-wrap {
width: 100%;
height: 100%;
}
</style>
