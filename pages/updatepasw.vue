<template>
  <div class="pass_page">
    <el-form ref="ruleForm"
             :model="ruleForm"
             status-icon
             :rules="rules"
             label-width="auto"
             class="pass_ruleForm">
      <el-form-item :label="$t('signin.newPwd')"
                    prop="pass">
        <el-input v-model="ruleForm.pass"
                  type="password"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('signin.confnewPwd')"
                    prop="checkPass">
        <el-input v-model="ruleForm.checkPass"
                  type="password"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="submitForm('ruleForm')">{{$t('signin.sub')}}</el-button>
        <el-button @click="resetForm('ruleForm')">{{$t('signin.reset')}}</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { getSessionCache, removeSessionCache } from '@/utils/dom/dom'
export default {

  head () {
    return {
      title: this.$t('header.updatepassword'),
      meta: [
        { hid: 'books custom title', name: 'books', content: 'books custom title description' }
      ]
    }
  },
  data () {

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('signin.pawEorr')));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('signin.pawEorr2')));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error(this.$t('signin.pawEorr3')));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],

      }

    }
  },
  methods: {

    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _userToken = getSessionCache("userToken");
          this.updateMerchantPassword(this.$store, { 'token': _userToken, 'password': this.ruleForm.pass }, this).then(res => {
            if (res.code === 0) {
              this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
              removeSessionCache("userInfo")
              removeSessionCache("userToken")
              this.$router.push("/signin")
            } else if (res.code === 50001 || res.code === 50003) {
              this.$message.error(this.$t('comm.tip_4'));
            } else {
              this.$message.error(this.$t('comm.unknownEorr'));
            }

          })

        } else {
          return false;
        }
      });
    },
    updateMerchantPassword (store, params, self) {
      return new Promise(resolve => {
        store.dispatch('updateMerchantPassword', params).then(res => {
          resolve(res)
        })
      })
    },
  }
}
</script>

<style lang="stylus" scoped>
.pass_page
  .pass_ruleForm
    padding 5% 10%
</style>
