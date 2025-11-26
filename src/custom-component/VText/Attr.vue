<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <el-form>
      <el-form-item label="文字类型">
        <el-select v-model="curComponent.textType" placeholder="请选择文字类型" @change="handleChange">
          <el-option :value="1" label="自动换行">
          </el-option>
          <el-option :value="2" label="超出隐藏">
          </el-option>
          <el-option :value="3" label="超出滚动">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="curComponent.propValue" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CommonAttr from '@/custom-component/common/CommonAttr.vue'

export default {
  components: { CommonAttr },
  computed: {
    curComponent() {
      return this.$store.state.curComponent
    },
  },
  methods: {
    handleChange(value) {
      let displayValue, overflowValue;
      if (value === 1) { // 自动换行
        displayValue = 'table-cell';
        overflowValue = 'visible';
      } else if (value === 2) { // 超出隐藏
        displayValue = 'block';
        overflowValue = 'hidden';
      } else if (value === 3) { // 超出滚动
        displayValue = 'block';
        overflowValue = 'auto';
      }
      // 使用 Vuex Mutation 修改样式，确保只修改当前选中组件
      this.$store.commit('setShapeSingleStyle', {
          key: 'display',
          value: displayValue
      });
      this.$store.commit('setShapeSingleStyle', {
          key: 'overflow',
          value: overflowValue
      });

      this.$store.commit('recordSnapshot');
    },
  },
}
</script>
