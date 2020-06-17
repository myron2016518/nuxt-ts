<template>
  <div class="info-row title-row">
    <!-- <span class="title">{{ title }}</span> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="tc_title_1">{{ title }}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="title2 !==''"
                          class="tc_title_2">{{title2}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'TitleRow',
  props: {
    title: {
      type: String,
      default: ''
    },
    title2: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.title-row
  margin 0.5rem 0 0.8rem
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  border-bottom solid 1px #e6e6e6
  padding 10px
</style>
