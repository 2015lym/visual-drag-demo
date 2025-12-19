<template>
  <div ref="container" class="bg">
    <div class="canvas-container"
      :style="{
        ...getCanvasStyle(canvasStyleData),
        width: changeStyleWithScale(canvasStyleData.width) + 'px',
        height: changeStyleWithScale(canvasStyleData.height) + 'px',
      }">
      <ComponentWrapper v-for="(item, index) in componentData" :key="index" :config="item" />
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
      // copyData: [],
      componentData: [],
      canvasStyleData: {},
      timer: null, // 保存定时器
    }
  },
  mounted() {
    // this.fetchData().then(() => {
    // })
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

    // async fetchData() {
    //   try {
    //     const res = await fetch('http://localhost:3001/styleData')
    //     const data = await res.json()

    //     this.componentData = data.componentData || []
    //     this.canvasStyleData = data.styleData || {}

    //     // 深拷贝一份用于展示
    //     this.copyData = deepCopy(this.componentData)
    //   } catch (err) {
    //     console.error('获取数据失败:', err)
    //   }
    // },
    handleMessage(event) {
      console.log('[子页面收到消息]', event.data)
      if (event.data?.type === 'jsonContent') {
        let jsonContent = this.parseData(event.data.data, {})
        this.componentData = jsonContent.componentData || [];
        this.canvasStyleData = jsonContent.styleData || {};
        console.log('数据:', jsonContent);
        console.log('组件数据:', this.componentData);
        console.log('画布样式数据:', this.canvasStyleData);
      } else if (event.data?.type === 'dataBind') {
        this.componentData.forEach(item => {
          // 不用一一对应
          if (event.data?.component && item.dataBind === event.data.component) {
            item.propValue = event.data.data
          }
        })
      }
    },
    parseData(val, defaultValue) {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch (e) {
          console.error('JSON 解析失败，返回默认值:', e);
          return defaultValue;
        }
      }
      return val || defaultValue;
    },

  },
}
</script>
