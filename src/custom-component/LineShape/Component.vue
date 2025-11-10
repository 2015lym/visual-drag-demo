<template>
  <div class="line-shape"></div>
</template>

<script>
import OnEvent from '../common/OnEvent'

export default {
  extends: OnEvent,
}
</script>

<style lang="scss" scoped>
.line-shape {
  width: 100%;
  height: 100%;
  overflow: auto;
  border-bottom: 0 !important;
  border-left: 0 !important;
  border-right: 0 !important;
}
</style>
