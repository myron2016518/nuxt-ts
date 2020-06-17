<template>
  <header class="v-header">
    <div class="header-container">
      <div class="ly_h_collapse">
        <i :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
           @click="collapseChange"></i>
      </div>
      <nuxt-link to="/">{{ $t('header.logo') }} </nuxt-link>
      <nav class="main-nav">
        <ul class="nav-list">
          <!-- <li class="main-nav-list">
            <v-dropdown />
          </li> -->
          <!-- <li class="nav-item search">
            <v-input :placeholder="$t('header.search')" />
          </li>
          <li class="nav-item auth">
            <span class="login">
              <nuxt-link to="/signin">{{ $t('header.signin') }}</nuxt-link>
            </span>
            <span class="register">{{ $t('header.registered') }}</span>
          </li> -->
          <li class="tc_h_user_li">
            <el-dropdown class="tc_h_user"
                         @command="headerUserA">
              <span class="el-dropdown-link">
                {{username}}
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="updatepassword">{{ $t('header.updatepassword') }}</el-dropdown-item>
                <el-dropdown-item command="signout">{{ $t('header.signout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <!-- <li>
            {{ $t('header.signout') }}
          </li> -->
          <li>
            <tc-lang />
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'
import TcLang from './lang'
import { getSessionCache, removeSessionCache } from '@/utils/dom/dom'
export default {
  name: 'VHeader',
  components: {
    TcLang
  },
  data () {
    return {
      maxClientWidth: 980,
    }
  },
  computed: {
    ...mapState({
      isPhone: state => state.isPhone,
      isCollapse: state => state.isCollapse,
      username: state => state.username
    })
  },
  beforeCreate () {
    // const self = this
    // const _userinfo = getSessionCache("userInfo");
    // if (_userinfo) {
    //   console.log('==_userinfo===', _userinfo);
    //   self.$store.commit('SET_USERNAME', _userinfo.name)
    // }
  },
  mounted () {
    const self = this
    let _userinfo = getSessionCache("userInfo");
    if (_userinfo) {
      _userinfo = JSON.parse(_userinfo);
      self.$store.commit('SET_USERNAME', _userinfo.name)
    }
    // document.body.onresize = () => {
    //   if (document.body.clientWidth > self.maxClientWidth) {
    //     self.$store.commit('PCORPHONE', false)
    //   } else {
    //     self.$store.commit('PCORPHONE', true)
    //   }
    // }
  },
  methods: {
    unLogigToken (store, params, self) {
      return new Promise(resolve => {
        store.dispatch('unLogigToken', params).then(res => {
          resolve(res)
        })
      })
    },

    headerUserA (_type) {

      if (_type === 'signout') {
        removeSessionCache("userInfo")
        removeSessionCache("userToken")
        this.$router.push("/signin")
        // const _userToken = getSessionCache("userToken");
        // this.unLogigToken(this.$store, { 'token': _userToken }, this).then(res => {
        //   // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
        //   if (res.code === 0) {
        //     this.$message({
        //       message: this.$t('signin.successful'),
        //       type: 'success'
        //     });
        //     removeSessionCache("userInfo")
        //     removeSessionCache("userToken")
        //     this.$router.push("/signin")
        //   } else if (res.code === 50001 || res.code === 50003) {
        //     this.$message.error(this.$t('signin.eorr'));
        //   } else {
        //     this.$message.error(this.$t('signin.unknownEorr'));
        //   }
        // })

      } else if (_type === 'updatepassword') {
        this.$router.push("/updatepasw")
      }
    },
    collapseChange () {
      this.$store.commit('SET_COLLAPSE', !this.isCollapse);
    },
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/header'
.v-header
  position fixed
  top 0
  left 0
  right 0
  z-index 99
  height 5rem
  background #fff
  border-bottom 1px solid #f1f1f1
  font-size 22px
  background-color #242f42
  color #fff
  padding 0 20px
  .header-container
    height 100%
    display flex
    align-items center
    position relative
    .ly_h_collapse
      float left
      padding-right 21px
      cursor pointer
  .main-nav
    height 100%
    flex 1 0 auto
    .tc_h_user_li
      margin-right 2%
      .tc_h_user
        color #fff
        font-size medium
        font-weight 700
@media (max-width: 960px)
  .v-header
    .header-container
      width 96%
</style>
