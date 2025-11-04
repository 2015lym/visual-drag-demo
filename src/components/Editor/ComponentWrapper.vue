<template>
  <div @click="onClick" @mouseenter="onMouseEnter">
    <component
      :is="config.component"
      v-if="config.component.startsWith('SVG')"
      ref="component"
      class="component"
      :style="getSVGStyle(config.style)"
      :prop-value="config.propValue"
      :element="config"
      :request="config.request"
      :linkage="config.linkage"
    />

    <component
      :is="config.component"
      v-else
      ref="component"
      class="component"
      :style="getStyle(config.style)"
      :prop-value="config.propValue"
      :element="config"
      :request="config.request"
      :linkage="config.linkage"
    />
  </div>
</template>

<script>
import { getStyle, getSVGStyle } from '@/utils/style'
import runAnimation from '@/utils/runAnimation'
import { mixins } from '@/utils/events'
import eventBus from '@/utils/eventBus'

export default {
  mixins: [mixins],
  props: {
    config: {
      type: Object,
      required: true,
      default: () => { },
    },
  },
  mounted() {
    this.$nextTick(() => {
      runAnimation(this.$el, this.config.animations)
    })
    // 旧的方式先注释，经常无法找到对象
    // 先让动画直接作用在子组件本身，样式略有不同。
    // this.$nextTick(() => {
    //   const target = this.$refs.component?.$el || this.$refs.component
    //   if (target) {
    //     runAnimation(target, this.config.animations)
    //   }
    // })
  },
  methods: {
    getStyle,
    getSVGStyle,

    onClick() {
      const events = this.config.events
      Object.keys(events).forEach((event) => {
        this[event](events[event])
      })

      eventBus.$emit('v-click', this.config.id)
    },

    onMouseEnter() {
      eventBus.$emit('v-hover', this.config.id)
    },
  },
}
</script>

<style lang="scss" scoped>
.component {
  position: absolute;
}
</style>
