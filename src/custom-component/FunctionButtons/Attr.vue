<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="按钮样式" name="buttonStyle">
        <el-form>
          <div v-if="curComponent && curComponent.buttonStyles">
            <el-form-item label="高">
              <el-input
                v-model.number="curComponent.buttonStyles.height"
                type="number"
                @change="recordStyleChange"
              />
            </el-form-item>

            <el-form-item label="边框半径（圆角）">
              <el-input
                v-model.number="curComponent.buttonStyles.borderRadius"
                type="number"
                @change="recordStyleChange"
              />
            </el-form-item>

            <el-form-item label="图标宽">
              <el-input
                v-model.number="curComponent.buttonStyles.iconWidth"
                type="number"
                @change="recordStyleChange"
              />
            </el-form-item>

            <el-form-item label="图标高">
              <el-input
                v-model.number="curComponent.buttonStyles.iconHeight"
                type="number"
                @change="recordStyleChange"
              />
            </el-form-item>

            <el-form-item label="颜色">
              <el-color-picker
                v-model="curComponent.buttonStyles.color"
                show-alpha
                :predefine="predefineColors"
                @change="recordStyleChange"
              ></el-color-picker>
            </el-form-item>

            <el-form-item label="背景色">
              <el-color-picker
                v-model="curComponent.buttonStyles.backgroundColor"
                show-alpha
                :predefine="predefineColors"
                @change="recordStyleChange"
              ></el-color-picker>
            </el-form-item>

          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import CommonAttr from '@/custom-component/common/CommonAttr.vue'
import { predefineColors } from '@/utils/style'

export default {
  components: { CommonAttr },
  data() {
    return {
      activeNames: ['buttonStyle'],
      predefineColors
    };
  },
  computed: {
    curComponent() {
      return this.$store.state.curComponent
    },
  },
  methods: {
    handleChange(val) {
      // 如果需要记录折叠面板的状态，可以在这里处理
      // this.curComponent.collapseName = val
    },
    // 记录快照，用于撤销/重做
    recordStyleChange() {
      this.$store.commit('recordSnapshot')
    },
  },
}
</script>
