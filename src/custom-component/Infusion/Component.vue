<template>
  <div class="infusion-card" v-if="propValue.infusion">
    <div class="infusion-main">
      <img src="@/assets/infusion.png" alt="输液图标" class="infusion-icon" />
      <div class="infusion-data">
        <div class="time">{{ classtime }}</div>
        <!-- 确保 propValue.volume 等属性存在 -->
        <div class="volume">{{ propValue.volume }}</div>
        <div class="rate">{{ propValue.infusionSetSpeed }}</div>
      </div>
    </div>
    <div class="infusion-status">
      <span>
        状态
        <span :style="{color: element.style.color}">
          {{ propValue.infusionStatusName }}
        </span>
      </span>
      <span>
        阀锁
        <span :style="{color: element.style.color}">
          {{ propValue.valveLock }}
        </span>
      </span>
      <span>
        电量
        <span :style="{color: element.style.color}">
          {{ propValue.batteryRate }}
        </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfusionCard',
  props: {
    propValue: {
      type: Object,
      default: () => ({})
    },
    element: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 储存计时器 ID
      timer: null,
      // 存储计算后的经过时间 HH:MM:SS
      classtime: '00:00:00',
      // 存储从创建时间到现在的秒数
      elapsedSeconds: 0,
    }
  },
  // 在组件创建时初始化时间并启动计时器
  created() {
    this.initTimeAndStartTimer()
  },
  // 在组件销毁前清理计时器
  beforeDestroy() {
    this.stopTimer()
  },
  watch: {
    // 监听 propValue 中的时间变化，如果外部更新了 infusionCreatedAt，则重置计时器
    'propValue.infusionCreatedAt': {
      handler() {
        this.initTimeAndStartTimer()
      },
      // 立即执行一次以确保初始值正确设置
      immediate: true
    }
  },
  methods: {
    // 将 HH:MM:SS 或 yyyy-mm-dd hh:mm:ss 格式的时间差转为秒数
    timeToSeconds(time) {
      if (!time) return 0

      // 尝试按 yyyy-mm-dd hh:mm:ss 解析
      const dts = time.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/)
      if (dts) {
        const [, Y, M, D, h, m, s] = dts.map(Number)
        // 注意：月份是 0-indexed，所以 M - 1
        const created = new Date(Y, M - 1, D, h, m, s)

        if (!isNaN(created.getTime())) {
          // 计算当前时间与创建时间的秒数差
          const diff = Math.floor((Date.now() - created.getTime()) / 1000)
          return diff > 0 ? diff : 0
        }
      }
      return 0
    },

    // 将秒数转回 HH:MM:SS 格式
    secondsToTime(seconds) {
      const h = Math.floor(seconds / 3600)
      const m = Math.floor((seconds % 3600) / 60)
      const s = seconds % 60
      return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
    },

    // 启动或重置计时器
    initTimeAndStartTimer() {
      // 1. 先停止旧的计时器（如果存在）
      this.stopTimer()

      // 2. 计算初始的已逝秒数
      this.elapsedSeconds = this.timeToSeconds(this.propValue.infusionCreatedAt)
      this.classtime = this.secondsToTime(this.elapsedSeconds)

      // 3. 启动新的计时器
      this.timer = window.setInterval(() => {
        this.elapsedSeconds += 1
        this.classtime = this.secondsToTime(this.elapsedSeconds)
      }, 1000)
    },

    // 清理计时器
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.infusion-card {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}

.infusion-main {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.infusion-icon {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.infusion-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.infusion-status {
  width: 100%;
  display: flex;
  justify-content: space-around;
  color: #9d9d9d;
}
</style>
