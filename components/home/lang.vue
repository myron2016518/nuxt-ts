<template>
  <el-dropdown class="tc_h_locale"
               @command="handleCommand">
    <span class="el-dropdown-link">
      {{locale | localename}}
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="cn">中文</el-dropdown-item>
      <el-dropdown-item command="en">EN</el-dropdown-item>
      <!-- <el-dropdown-item command="fr">fr</el-dropdown-item> -->
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TcLang',
  filters: {
    localename: function (value) {
      // console.log(value);
      const lang = value || 'cn';
      if (lang === 'en') {
        return 'EN'
      } else if (lang === 'cn') {
        return '中文'
      } else if (lang === 'tw') {
        return 'zh-tw'
      } else if (lang === 'de') {
        return 'de'
      } else if (lang === 'es') {
        return 'es'
      } else if (lang === 'it') {
        return 'it'
      } else if (lang === 'ja') {
        return 'ja'
      } else if (lang === 'fr') {
        return 'FR'
      } else {
        return '中文'
      }
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      locale: state => state.locale
    })
  },
  methods: {
    handleCommand (command) {
      this.$store.commit('SET_LANG', command);
      this.$i18n.locale = command
    },
  }
}
</script>

<style lang="stylus" scoped>
.tc_h_locale
  display block
  color #fff
  padding 0 10px
</style>
