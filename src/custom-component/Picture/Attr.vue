<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <el-form>
      <el-form-item label="镜像翻转">
        <div style="clear: both">
          <el-checkbox v-model="curComponent.propValue.flip.horizontal" label="horizontal">水平翻转</el-checkbox>
          <el-checkbox v-model="curComponent.propValue.flip.vertical" label="vertical">垂直翻转</el-checkbox>
        </div>
      </el-form-item>
      <el-form-item label="图片更换">
        <label for="inputAttr" class="insert">
          选择图片
          <input id="inputAttr" type="file" hidden @change="handleFileChange" />
        </label>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CommonAttr from '@/custom-component/common/CommonAttr.vue'
import { $ } from '@/utils/utils'
import eventBus from '@/utils/eventBus'

export default {
  components: { CommonAttr },
  computed: {
    curComponent() {
      return this.$store.state.curComponent
    },
  },
  methods: {
    handleFileChange(e) {
      const file = e.target.files[0]
      if (!file.type.includes('image')) {
        toast('只能插入图片')
        return
      }

      const reader = new FileReader()
      reader.onload = (res) => {
        const fileResult = res.target.result
        console.log(res)
        this.curComponent.propValue.url = fileResult
        // 修复重复上传同一文件，@change 不触发的问题
        const input = document.getElementById('inputAttr');
        if (input) {
          input.setAttribute('type', 'text');
          input.setAttribute('type', 'file');
        } else {
          console.warn('未找到文件输入元素，无法重置其值')
        }
      }
      reader.readAsDataURL(file)
    },
  }
}
</script>

<style lang="scss" scoped>
.insert {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid var(--toolbar-border-color);
  color: var(--text-color);
  appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 9px 15px;
  font-size: 12px;
  border-radius: 3px;
  margin-left: 10px;
}
</style>
