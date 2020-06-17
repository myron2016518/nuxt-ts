<template>
  <div class="dstore_add">
    <!-- <title-row :title="$t('aside.dealers3_2')"></title-row> -->
    <el-form ref="ruleForm"
             :model="ruleForm"
             :rules="rules"
             label-width="100px"
             class="demo-ruleForm">

      <el-form-item :label="$t('operating.f_6')"
                    prop="name">
        <el-input v-model="ruleForm.name"
                  :size="cSize"
                  class="tc_store_w"></el-input>
      </el-form-item>

      <el-form-item :label="$t('comm.desc')"
                    prop="desc">
        <el-input v-model="ruleForm.desc"
                  type="textarea"
                  class="tc_store_w"
                  :autosize="{ minRows: 4, maxRows: 6}"></el-input>
      </el-form-item>

      <el-form-item :label="$t('operating.f_1')"
                    prop="pid">
        <pp-select v-model="ruleForm.pid"
                   isnoall=true></pp-select>
      </el-form-item>
      <el-form-item :label="$t('operating.f_7')">
        <el-switch v-model="ruleForm.status"> </el-switch>
        <span class="tc_topic_isonline">（默认为上线）</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   :size="cSize"
                   @click="submitForm('ruleForm')">{{$t('signin.sub')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import * as qiniu from 'qiniu-js'
// import TitleRow from '@/components/home/title-row'
import PpSelect from '@/components/home/pp-select'
import { getSessionCache } from '@/utils/dom/dom'

export default {
  scrollToTop: true,
  components: {
    // TitleRow,
    PpSelect,
  },
  head () {
    return {
      title: this.$t('aside.n_3'),
      meta: [
        { hid: 'events custom title', name: 'events', content: 'events custom title description' }
      ]
    }
  },
  data () {
    return {

      ruleForm: {
        name: '',
        desc: '',
        pid: '',
        status: true,
      },
      rules: {

        name: [
          { required: true, message: this.$t('comm.noEmpty'), trigger: 'blur' }
        ],
        desc: [
          { required: true, message: this.$t('comm.noEmpty'), trigger: 'blur' }
        ],
        pid: [
          { required: true, message: this.$t('comm.noEmpty'), trigger: 'change' }
        ],

      }
    }
  },
  computed: {
    ...mapState({
      cSize: state => state.cSize
    })
  },
  created () {
  },
  mounted () {
    if (this.$route.params.atype === 'add') {
      this.ruleForm = {
        name: '',
        desc: '',
        pid: '',
        status: true,
      }
    } else {
      // 编辑
      this.getTopicByIdAction(this.$store, {}, this).then(res => {
        // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
        if (res.code === 0) {
          this.ruleForm = {
            name: res.data.name,
            pid: res.data.app_id,
            desc: res.data.desc,
            status: res.data.status === 'passed'
          }
        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }
      })

    }
  },
  methods: {

    submitForm (formName) {
      const _that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_that.$route.params.atype === 'add') {
            this.addTopicAction(this.$store, this.ruleForm, this).then(res => {
              // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.$router.push("/topic")
              } else if (res.code === 50001 || res.code === 50003) {
                this.$message.error(this.$t('comm.tip_4'));
              } else {
                this.$message.error(this.$t('comm.unknownEorr'));
              }
            })
          } else {
            // 编辑
            this.editTopicAction(this.$store, this.ruleForm, this).then(res => {
              // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.$router.push("/topic")
              } else if (res.code === 50001 || res.code === 50003) {
                this.$message.error(this.$t('comm.tip_4'));
              } else {
                this.$message.error(this.$t('comm.unknownEorr'));
              }
            })
          }
        } else {
          return false;
        }
      });
    },
    addTopicAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        name: params.name || '',
        desc: params.desc || '',
        app_id: params.pid || '',
        status: params.status ? 'passed' : 'waiting'
      }
      return new Promise(resolve => {
        store.dispatch('addTopic', param).then(res => {
          resolve(res)
        })
      })
    },
    editTopicAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: self.$route.params.topicid || '',
        name: params.name || '',
        desc: params.desc || '',
        app_id: params.pid || '',
        status: params.status ? 'passed' : 'waiting'
      }
      return new Promise(resolve => {
        store.dispatch('editTopic', param).then(res => {
          resolve(res)
        })
      })
    },
    getTopicByIdAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: self.$route.params.topicid || '',
      }
      return new Promise(resolve => {
        store.dispatch('getTopicById', param).then(res => {
          resolve(res)
        })
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },

  }
}
</script>

<style lang="stylus" scoped>
.dstore_add
  font-size 16px
  margin-top 1.767rem
  .tc_topic_isonline
    font-size 12px
    color #f56c6c
  .avatar-uploader-icon
    font-size 28px
    color #8c939d
    width 178px
    height 178px
    line-height 178px
    text-align center
  .avatar
    width 178px
    height 178px
    display block
  .tc_store_w
    width 450px
</style>
