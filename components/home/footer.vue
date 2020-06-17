<template>
  <footer class="v-footer">
    footer
  </footer>
</template>

<script>

export default {
  name: 'VFooter',
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {

  }
}
</script>

<style lang="stylus">
.v-header
  position fixed
  top 0
  left 0
  right 0
  z-index 99
  height 5rem
  background #fff
  color #909090
  border-bottom 1px solid #f1f1f1
  .header-container
    max-width 960px
    height 100%
    margin auto
    display flex
    align-items center
    position relative
  .main-nav
    height 100%
    flex 1 0 auto
@media (max-width: 960px)
  .v-header
    .header-container
      width 96%
</style>
