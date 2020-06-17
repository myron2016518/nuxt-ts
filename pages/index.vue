<template>

  <el-container class="ly_h100">
    <el-header>
      <v-header></v-header>
    </el-header>
    <el-container class="ly_h100 ly_content">
      <el-aside class="ly_aside ly_h100">
        <v-aside></v-aside>
      </el-aside>
      <el-main class="ly_main ly_h100">
        <nuxt />
        <el-backtop target=".ly_main"
                    :bottom="100"></el-backtop>
      </el-main>
    </el-container>
    <!-- <v-icon name="android-home"
            size="16"></v-icon> -->
  </el-container>

</template>
<script>
import { mapState, mapMutations } from 'vuex'
import VHeader from '~/components/home/header'
import VAside from '~/components/home/aside'

export default {
  components: {
    VHeader,
    VAside
    // VFooter
  },
  data () {
    return {
      showTopBtn: false
    }
  },
  head () {
    return {
      title: this.$t('comm.home'),
      meta: [
        { hid: 'home custom title', name: 'home', content: 'home custom title description' }
      ]
    }
  },
  computed: {
    ...mapState({
      counter: state => state.counter
    })
  },
  methods: {
    ...mapMutations([
      'INCREMENT'
    ]),
    clickFn () {
      this.INCREMENT()
    },
    goTop () {
      document.documentElement.scrollTop = 0
    },
    handleMore () {
      this.$message({
        message: 'sorry ~',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="stylus">
.ly_main
  padding 0 0 5% 0
.ly_aside
  padding 0 0 5% 0
  border-right solid 1px #e6e6e6
</style>
