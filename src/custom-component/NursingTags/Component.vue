<template>
  <div class="nursing-lowcode" :style="{ width: width + 'px', height: height + 'px' }">
    <div class="nursing-lowcode__list">
      <div
        class="nursing-lowcode__item"
        v-for="(tag, idx) in propValue"
        :key="`tag-${idx}`"
        :style="getItemInlineStyle(tag)"
      >
          <!-- splitString 的每个 segment 渲染为真实元素并带唯一 key -->
          <template v-for="(seg, sidx) in splitString(tag.itemName)">
            <div
              v-if="isHorizontalSegment(seg)"
              :key="`h-${idx}-${sidx}`"
              class="nursing-lowcode__seg nursing-lowcode__seg--horizontal"
            >{{ seg }}</div>

            <div
              v-else
              :key="`v-${idx}-${sidx}`"
              class="nursing-lowcode__seg nursing-lowcode__seg--vertical"
            >{{ seg }}</div>
          </template>
      </div>

      <!-- add 按钮（仅 emit 事件，由外部处理） -->
      <div
        class="nursing-lowcode__item nursing-lowcode__item--add"
        @click="onAddClick"
        :key="'add-button'"
      >
        <div class="nursing-lowcode__add">
          <svg viewBox="0 0 24 24" width="50" height="50" focusable="false" aria-hidden="true">
            <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NursingTags",
  props: {
    propValue: {
      type: Array,
      required: true,
      default: () => ([])
    },
    element: { type: Object, default: () => ({ style: { width: 0, height: 0 } }) },

  },
  computed: {
    // 画布尺寸（像 QR 组件那样）
    width() {
      return Number(this.element?.style?.width) || 700;
    },
    height() {
      return Number(this.element?.style?.height) || 300;
    },
    // 优先使用 propValue.tags，否则用默认数据
    // nursingTags() {
    //   const tags = this.propValue && Array.isArray(this.propValue.tags) ? this.propValue.tags : [];
    //   return tags.length ? tags : this.defaultTags;
    // }
  },
  methods: {
    // 保留 splitString：连续英数字/罗马数字/某些符号 为一段；单个中文字符为一段
    splitString(str = "") {
      const regExp = /([A-Za-z0-9\u2160-\u216B:：\/.<>₂₀₁₂₃₄₅₆₇₈₉\-\+\(\)]+)|([\u4E00-\u9FA5])/g;
      const matches = (str || "").match(regExp);
      return matches || [];
    },
    // 判断是否为横排段（英数字、连续符号）
    isHorizontalSegment(seg = "") {
      const reg = /^[A-Za-z0-9\u2160-\u216B:：\/.<>₂₀₁₂₃₄₅₆₇₈₉\-\+\(\)]+$/;
      return reg.test(seg);
    },
    onAddClick() {
      console.log('addTags button clicked');
      window.parent.postMessage({ type: 'goPage', data: 'addTags' }, '*')
    },
    // 如果标签对象包含样式字段（backgroundColor/fontColor/width），则应用内联样式
    getItemInlineStyle(tag = {}) {
      const style = {};
      if (tag.backgroundColor) style.backgroundColor = tag.backgroundColor;
      if (tag.fontColor) style.color = tag.fontColor;

      // 处理 width：如果是数字则加 px；如果是字符串则直接使用；若为空则可不指定（浏览器使用 CSS 默认）
      if (tag.width !== undefined && tag.width !== null && tag.width !== '') {
        // if (typeof tag.width === 'number') {
        //   style.width = tag.width + 'px';
        // } else {
        //   style.width = String(tag.width);
        // }
      }
      return style;
    }
  }
};
</script>

<style scoped>
.nursing-lowcode {
  box-sizing: border-box;
  overflow: hidden;
  background: #f7f9fc;
  border-radius: 6px;
  padding: 8px;
  border: 1px solid #e6eaf0;
}

/* 列表纵向排列，竖向滚动 */
.nursing-lowcode__list {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  overflow-x: scroll;
}

/* 单个 tag 项 */
.nursing-lowcode__item {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  padding: 16px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #e9eef5;
  user-select: none;
  writing-mode: vertical-lr;
  flex-wrap: wrap;
}

/* add 按钮外观（无具体实现，只发事件） */
.nursing-lowcode__item--add {
  background: #eef3fb;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* add 图标颜色 */
.nursing-lowcode__add path {
  fill: black;
}

/* 段落样式 */
.nursing-lowcode__seg {
  display: inline-block;
  margin: 0 2px;
  line-height: 1;
  color: inherit;
}

/* 横排段：英数字等保持横排方向 */
.nursing-lowcode__seg--horizontal {
  text-combine-upright: all;
  white-space: nowrap;
}

/* 竖排段：中文单字竖向显示 */
.nursing-lowcode__seg--vertical {
  writing-mode: vertical-rl;
  text-orientation: upright;
  padding: 0 1px;
}
</style>
