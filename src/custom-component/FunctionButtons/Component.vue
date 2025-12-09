<template>
  <div class="func-btn-container">
    <div class="func-btn-collection" :style="{ padding: element.style.padding + 'px'}">
      <!-- 核心功能按钮列表 -->
      <div
        class="func-btn-item"
        v-for="(item, index) in propValue"
        :key="index + 'bed'"
        @click="handleItemClick(item)"
        :style="{ 'margin-bottom': element.style.itemGap + 'px'}"
      >
        <!-- 主按钮容器：根据状态应用样式 -->
        <div class="func-btn-item-box" :class="{
          'func-btn-item-box-checked': isSelected(item),
          'is-timer-active': clockDown && item.componentName === 'foodClock'}">
          <template v-if="clockDown && item.componentName === 'foodClock'">
            <div class="timer-display-area">
              <span class="timer-time">{{ clockDownTiem }}</span>
            </div>
          </template>

          <!-- 区域 B: 默认按钮内容 (在其他所有情况下显示) -->
          <template v-else>
            <div class="func-btn-normal-content">
              <div class="func-btn-item-img">
                <img
                  class="func-btn-menu-img"
                  :src="getModuleIcon(item)"
                  :alt="item.name"
                  style="width: 80px; height: 80px;"
                />
              </div>
              <div class="func-btn-item-name">
                {{ item.name }}
              </div>
            </div>
          </template>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
const mockIcons = {
  positionhome: require('@/assets/icons/positionhome.png'),
  callhome: require('@/assets/icons/callhome.png'),
  instructionhome: require('@/assets/icons/instructionhome.png'),
  foodclock: require('@/assets/icons/foodclock.png'),
};

// 定义 localStorage key
const TIMER_END_KEY = 'foodClockEndTime';

export default {
  name: 'FuncButtonCollection',
  props: {
    propValue: {
      type: Array,
      default: () => ([]),
    },
    // foodClockPresetTime 默认 7200 秒 (2小时)
    foodClockPresetTime: {
      type: Number,
      default: 7200,
    },
    element: {
      type: Object,
      default: () => { },
    },
  },

  data() {
    return {
      clockDownTiem: '00:00:00',
      clockDown: false, // 是否正在倒计时
      mybar: {},
      currentType: 'blood_sugar',

      timerInterval: null,
      endTime: null, // 倒计时结束的 UNIX 时间戳 (毫秒)
    }
  },

  mounted() {
    // 页面加载时，检查本地是否存在未完成的倒计时
    this.checkLocalTimer();
  },

  beforeDestroy() {
    // 销毁组件前，清除计时器
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  methods: {
    // 辅助函数：格式化秒数为 HH:MM:SS
    formatTime(totalSeconds) {
      if (totalSeconds < 0) totalSeconds = 0;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (n) => String(n).padStart(2, '0');
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    },

    // *** 停止/清理逻辑块 (用于内部调用) ***
    // 仅供计时器自然结束或页面加载检查时调用
    stopTimerAndCleanUp() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.clockDown = false;
        this.clockDownTiem = '00:00:00';
        this.endTime = null;
        localStorage.removeItem(TIMER_END_KEY);
    },
    // **********************************

    // 检查 localStorage，恢复倒计时状态
    checkLocalTimer() {
      const storedEndTime = localStorage.getItem(TIMER_END_KEY);

      if (storedEndTime) {
        this.endTime = parseInt(storedEndTime, 10);
        // 检查计时器是否已过期
        if (this.endTime > Date.now()) {
          this.clockDown = true;
          this.startCountdown();
        } else {
          // 计时器已过期，清理本地存储
          this.stopTimerAndCleanUp();
        }
      }
    },

    // 启动本地倒计时显示逻辑
    startCountdown() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }

      this.timerInterval = setInterval(() => {
        const now = Date.now();
        const timeLeftMs = this.endTime - now;

        if (timeLeftMs <= 0) {
          // 计时结束，执行重置
          this.stopTimerAndCleanUp();
          return;
        }

        const timeLeftSeconds = Math.round(timeLeftMs / 1000);
        this.clockDownTiem = this.formatTime(timeLeftSeconds);

      }, 1000);
    },

    isSelected(item) {
      return item.componentName === this.mybar.componentName
    },

    getModuleIcon(item) {
      const { positionhome, callhome, foodclock, instructionhome } = mockIcons;

      switch (item.componentName) {
        case 'foodClock':
          return foodclock;
        case 'moviecall':
          return callhome;
        case 'position':
          return positionhome;
        default:
          return instructionhome;
      }
    },

    // 整合后的点击处理逻辑
    handleItemClick(item) {
      if (item.componentName === 'foodClock') {
        if (!this.clockDown) {
          const durationMs = this.foodClockPresetTime * 1000;
          this.endTime = Date.now() + durationMs;

          // 存储结束时间到本地
          localStorage.setItem(TIMER_END_KEY, this.endTime.toString());

          // 更新状态并启动计时器
          this.clockDown = true;
          this.startCountdown();
        }
        return;
      }
      console.log('Function button clicked:', item);
    },
  }
}
</script>

<style scoped>
/* CSS样式调整区域 */

.func-btn-container {
  overflow: hidden;
}

.func-btn-collection {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.func-btn-item {
  height: 190px;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.func-btn-item-box {
  width: 100%;
  height: 100%;
  display: flex;
  background: #4caf50;
  padding: 10px 20px;
  box-sizing: border-box;
  border-radius: 10px;
  align-items: center;
}

.func-btn-item-box.is-timer-active {
  background: #ff5722;
  justify-content: center;
}

.timer-display-area {
  color: #ffffff;
  text-align: center;
  width: 100%;
}

.timer-time {
  font-weight: bold;
  display: block;
}

.func-btn-normal-content {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.func-btn-item-box.is-timer-active {
    background: #ffd5ac !important;
    color: #3f4756 !important;
    opacity: 1;
}

.func-btn-item-img {
  display: flex;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.func-btn-item-name {
  text-align: left;
  color: #ffffff;
  flex-grow: 1;
  white-space: nowrap;
}
</style>
