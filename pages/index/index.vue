<template>
  <div class="tc_admin_index">

  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
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

<style lang="stylus"></style>
