<template>
  <div ref="container" class="bg">
    <div class="canvas-container" :style="getCanvasStyle(canvasStyleData)">
      <ComponentWrapper
        v-for="(item, index) in copyData"
        :key="index"
        :config="item"
      />
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
      this.startRandomUpdate()
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

    // 每 2 秒更新随机数
    startRandomUpdate() {
      this.timer = setInterval(() => {
        this.copyData.forEach(item => {
          // 这里假设每个 item 都有 propValue 属性
          item.propValue = Math.floor(Math.random() * 100) // 0~99 随机数
        })
      }, 2000)
    },

    close() {
      this.$emit('close')
    },

    htmlToImage() {
      toPng(this.$refs.container.querySelector('.canvas'))
        .then((dataUrl) => {
          const a = document.createElement('a')
          a.setAttribute('download', 'screenshot')
          a.href = dataUrl
          a.click()
        })
        .catch((error) => {
          console.error('oops, something went wrong!', error)
        })
        .finally(this.close)
    },
  },
}
</script>
