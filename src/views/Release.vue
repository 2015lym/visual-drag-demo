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
    window.addEventListener('load', () => {
      parent.postMessage({ type: 'iframeReady' }, '*')
    })
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
          // 不用一一对应
          if (event.data?.component && item.dataBind === event.data.component) {
            item.propValue = event.data.data
          }
        })
      }
    },

  },
}
</script>
