<template>
  <div ref="container" class="bg">
    <div class="canvas-container" :style="getCanvasStyle(canvasStyleData)">
      <ComponentWrapper v-for="(item, index) in copyData" :key="index" :config="item" />
    </div>
  </div>
</template>

<script>
import { getStyle, getCanvasStyle } from '@/utils/style'
import ComponentWrapper from '@/components/Editor/ComponentWrapper'
import { changeStyleWithScale } from '@/utils/translate'
import { toPng } from 'html-to-image'
import { deepCopy } from '@/utils/utils'

export default {
  components: { ComponentWrapper },
  props: {
    isScreenshot: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      copyData: [],
      componentData: [],
      canvasStyleData: {},
      timer: null, // 保存定时器
    }
  },
  mounted() {
    this.fetchData().then(() => {
    })
    window.addEventListener('message', this.handleMessage)
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    getStyle,
    getCanvasStyle,
    changeStyleWithScale,

    async fetchData() {
      try {
        const res = await fetch('http://localhost:3001/styleData')
        const data = await res.json()

        this.componentData = data.componentData || []
        this.canvasStyleData = data.styleData || {}

        // 深拷贝一份用于展示
        this.copyData = deepCopy(this.componentData)
      } catch (err) {
        console.error('获取数据失败:', err)
      }
    },
    handleMessage(event) {
      console.log('[子页面收到消息]', event.data)
      if (event.data?.type === 'dataBind') {
        this.copyData.forEach(item => {
          if (event.data?.component === 'QrCode' && item.dataBind === 'QrCode') {
            item.propValue = event.data?.data
          } else if (event.data?.component === 'VText' && item.dataBind === 'VText') {
            item.propValue = event.data?.data
          }
        })
      }
    },
    // 每 2 秒更新随机数
    startRandomUpdate() {
      this.timer = setInterval(() => {
        this.copyData.forEach(item => {
          // 这里假设每个 item 都有 propValue 属性
          item.propValue = Math.floor(Math.random() * 100) // 0~99 随机数
        })
      }, 2000)
    },
  },
}
</script>
