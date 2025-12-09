<template>
  <div class="func-btn-container">
    <div class="func-btn-collection" :style="{ padding: element.style.padding + 'px' }">
      <div class="func-btn-item" v-for="(item, index) in propValue" :key="index + 'bed'" @click="handleItemClick(item)"
        :style="{
          'margin-bottom': element.style.itemGap + 'px',
          height: (element.buttonStyles && element.buttonStyles.height ? element.buttonStyles.height : 190) + 'px'
        }">
        <div class="func-btn-item-box" :class="{
          'is-timer-active': clockDown && item.componentName === 'foodClock'
        }" :style="{
            'border-radius': (element.buttonStyles && element.buttonStyles.borderRadius ? element.buttonStyles.borderRadius : 10) + 'px',
            'background-color': element.buttonStyles && element.buttonStyles.backgroundColor
          }">

          <template v-if="clockDown && item.componentName === 'foodClock'">
            <div class="timer-display-area" :style="{ color: element.buttonStyles }">
              <span class="timer-time">{{ clockDownTiem }}</span>
            </div>
          </template>

          <template v-else>
            <div class="func-btn-normal-content">
              <div class="func-btn-item-img">
                <img class="func-btn-menu-img" :src="getModuleIcon(item)" :alt="item.name" :style="{
                  width: (element.buttonStyles && element.buttonStyles.iconWidth ? element.buttonStyles.iconWidth : 80) + 'px',
                  height: (element.buttonStyles && element.buttonStyles.iconHeight ? element.buttonStyles.iconHeight : 80) + 'px'
                }" />
              </div>
              <div class="func-btn-item-name" :style="{ color: element.buttonStyles && element.buttonStyles.color }">
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
      default: () => {},
    },
  },

  data() {
    return {
      clockDownTiem: '00:00:00',
      clockDown: false, // 是否正在倒计时

      currentType: 'blood_sugar',

      timerInterval: null,
      endTime: null, // 倒计时结束的 UNIX 时间戳 (毫秒)
    }
  },

  mounted() {
    this.checkLocalTimer();
  },

  beforeDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  methods: {
    formatTime(totalSeconds) {
      if (totalSeconds < 0) totalSeconds = 0;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (n) => String(n).padStart(2, '0');
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    },

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

    checkLocalTimer() {
      const storedEndTime = localStorage.getItem(TIMER_END_KEY);

      if (storedEndTime) {
        this.endTime = parseInt(storedEndTime, 10);
        if (this.endTime > Date.now()) {
          this.clockDown = true;
          this.startCountdown();
        } else {
          this.stopTimerAndCleanUp();
        }
      }
    },

    startCountdown() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }

      this.timerInterval = setInterval(() => {
        const now = Date.now();
        const timeLeftMs = this.endTime - now;

        if (timeLeftMs <= 0) {
          this.stopTimerAndCleanUp();
          return;
        }

        const timeLeftSeconds = Math.round(timeLeftMs / 1000);
        this.clockDownTiem = this.formatTime(timeLeftSeconds);

      }, 1000);
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

    handleItemClick(item) {
      if (item.componentName === 'foodClock') {
        if (!this.clockDown) {
          const durationMs = this.foodClockPresetTime * 1000;
          this.endTime = Date.now() + durationMs;
          localStorage.setItem(TIMER_END_KEY, this.endTime.toString());
          this.clockDown = true;
          this.startCountdown();
        }
        return;
      }
      console.log('goPage:', item.componentName);
      window.parent.postMessage({ type: 'goPage', data: item.componentName }, '*')
      // 阻止非计时按钮在计时期间被点击
      if (this.clockDown) {
        return;
      }
    },
  }
}
</script>

<style scoped>
.func-btn-container {
  overflow: hidden;
}

.func-btn-collection {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.func-btn-item {
  box-sizing: border-box;
  overflow: hidden;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.func-btn-item:has(.is-timer-active) {
  cursor: default;
}

.func-btn-item-box {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 10px 20px;
  box-sizing: border-box;
  align-items: center;
}

/* 计时器激活时的特殊颜色覆盖 */
.func-btn-item-box.is-timer-active {
  background: #ffd5ac !important;
  color: #3f4756 !important;
  justify-content: center;
}

/* 选中状态 */
.func-btn-item-box-checked {
  background: #00bcd4 !important;
}


.timer-display-area {
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

/* img 的尺寸已通过行内样式绑定 */
.func-btn-item-img {
  display: flex;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

/* func-btn-item-name 的 color 已通过行内样式绑定 */
.func-btn-item-name {
  text-align: left;
  flex-grow: 1;
}
</style>
