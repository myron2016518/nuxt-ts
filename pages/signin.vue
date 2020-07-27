<template>
  <div class="signin_page">
    <div class="sgp_div">
      <el-row class="sgp_lang">
        <tc-lang />
      </el-row>
      <el-row class="sgp_title">
        {{$t('header.logo')}}
      </el-row>
      <el-form ref="ruleForm"
               :model="ruleForm"
               :rules="rules"
               label-width="auto"
               class="sgp_form">
        <el-form-item :label="$t('signin.aoc')"
                      prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('signin.password')"
                      prop="password">
          <el-input v-model="ruleForm.password"
                    type="password"
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>

        <el-form-item class="sgp_btn">
          <el-button type="primary"
                     @click="submitForm('ruleForm')">{{$t('signin.sub')}}</el-button>
        </el-form-item>
      </el-form>

    </div>

  </div>
</template>

<script>
import { setSessionCache, getSessionCache } from '@/utils/dom/dom'
import TcLang from '@/components/home/lang'
export default {
  components: {
    TcLang
  },
  head () {
    return {
      title: this.$t('header.signin'),
      meta: [
        { hid: 'books custom title', name: 'books', content: 'books custom title description' }
      ]
    }
  },
  data () {

    return {
      ruleForm: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('signin.aocEorr'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('signin.pawEorr'), trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    const _token = getSessionCache("userToken");
    const _userInfo = getSessionCache("userInfo");
    if (_token && _userInfo) {
      this.$router.push("/");
    }
  },
  mounted () {

  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.doLoginAction(this.$store, this.ruleForm, this).then(res => {
            // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
            if (res.code === 0) {
              this.$message({
                message: this.$t('signin.successful'),
                type: 'success'
              });
              const _token = res.data.access_token.replace('Bearer ', '')
              setSessionCache("userInfo", this.ruleForm)
              setSessionCache("userToken", _token)
              this.$store.commit('SET_USERNAME', this.ruleForm.name)
              this.$router.push("/")
            } else if (res.code === 50001 || res.code === 50003) {
              this.$message.error(this.$t('signin.eorr'));
            } else {
              this.$message.error(this.$t('signin.unknownEorr'));
            }

          })

        } else {
          return false;
        }
      });
    },
    doLoginAction (store, params, self) {
      const param = {
        username: params.name || '',
        password: params.password || ''
      }
      return new Promise(resolve => {
        store.dispatch('dologin', param).then(res => {
          resolve(res)
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.signin_page
  width 100%
  position absolute
  top 0
  height 100%
  left 0
  background-color #606266
  padding-top 10%
  z-index 100
  .sgp_div
    width 30%
    margin 0 auto
    text-align center
    background-color #fff
    padding 20px
    border-radius 10px
    .sgp_title
      padding 20px
      font-size 20px
      font-weight bold
    .sgp_form
      // margin-right 100px
    .sgp_lang
      text-align right
      .tc_h_locale
        color #000
@media (max-width: 960px)
  .sgp_div
    width 90% !important
  .book-list
    margin 0 auto 50px
</style>
