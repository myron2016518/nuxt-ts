<template>
  <div class="dstore_add">
    <!-- <title-row :title="$t('aside.dealers3_2')"></title-row> -->
    <el-form ref="ruleForm"
             :model="ruleForm"
             :rules="rules"
             label-width="100px"
             class="demo-ruleForm">

      <el-form-item :label="$t('operating.f_16')"
                    prop="name">
        <el-input v-model="ruleForm.name"
                  :size="cSize"
                  class="tc_store_w"></el-input>
      </el-form-item>

      <el-form-item :label="$t('operating.f_18')"
                    prop="desc">
        <el-input v-model="ruleForm.desc"
                  type="textarea"
                  class="tc_store_w"
                  :autosize="{ minRows: 4, maxRows: 6}"></el-input>
      </el-form-item>

      <el-form-item :label="$t('aside.n_8_2')"
                    prop="pid">
        <bp-select v-model="ruleForm.pid"
                   isnoall=true
                   ismultiple="multiple"></bp-select>
      </el-form-item>
      <!-- <el-form-item :label="$t('operating.f_17')">
        <el-switch v-model="ruleForm.status"> </el-switch>
        <span class="tc_topic_isonline">（默认为提交并推送消息）</span>
      </el-form-item> -->

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
import BpSelect from '@/components/home/bp-select'
import { getSessionCache } from '@/utils/dom/dom'

export default {
  scrollToTop: true,
  components: {
    // TitleRow,
    BpSelect,
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
      this.getMessageByIdAction(this.$store, {}, this).then(res => {
        // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
        if (res.code === 0) {
          console.log('============', res.data);

          // const _pidlist = JSON.parse('[' + String(res.data.platform_label) + ']');
          const _pidlist = [];
          res.data.device.map((_item) => {
            _pidlist.push(_item.id);
          })
          console.log(_pidlist);
          this.ruleForm = {
            name: res.data.title,
            pid: _pidlist,
            desc: res.data.data,
            // status: res.data.status === 'passed'
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
            this.addMessageAction(this.$store, this.ruleForm, this).then(res => {
              // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.$router.push("/beingpushed")
              } else if (res.code === 50001 || res.code === 50003) {
                this.$message.error(this.$t('comm.tip_4'));
              } else {
                this.$message.error(this.$t('comm.unknownEorr'));
              }
            })
          } else {
            // 编辑
            this.editMessageAction(this.$store, this.ruleForm, this).then(res => {
              // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.$router.push("/beingpushed")
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
    addMessageAction (store, params, self) {
      console.log(params);
      const param = {
        token: getSessionCache("userToken") || '',
        title: params.name || '',
        data: params.desc || '',
        device_ids: params.pid.toString() || '',
        // status: params.status ? 'passed' : 'waiting'
      }
      return new Promise(resolve => {
        store.dispatch('addMessage', param).then(res => {
          resolve(res)
        })
      })
    },
    editMessageAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: self.$route.params.bpid || '',
        title: params.name || '',
        data: params.desc || '',
        device_ids: params.pid.toString() || '',
        // status: params.status ? 'passed' : 'waiting'
      }
      return new Promise(resolve => {
        store.dispatch('editMessage', param).then(res => {
          resolve(res)
        })
      })
    },
    getMessageByIdAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: self.$route.params.bpid || '',
      }
      return new Promise(resolve => {
        store.dispatch('getMessageById', param).then(res => {
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
