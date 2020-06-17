<template>
  <div class="dstore_add">
    <!-- <title-row :title="$t('aside.dealers3_2')"></title-row> -->
    <el-form ref="ruleForm"
             :model="ruleForm"
             :rules="rules"
             label-width="100px"
             class="demo-ruleForm">

      <el-form-item :label="$t('operating.f_3')"
                    prop="name">
        <el-input v-model="ruleForm.name"
                  :size="cSize"
                  class="tc_store_w"></el-input>
      </el-form-item>
      <el-form-item :label="$t('operating.f_1')"
                    prop="ppid">
        <pp-select v-model="ruleForm.ppid"
                   isnoall=true></pp-select>
      </el-form-item>
      <el-form-item :label="$t('operating.f_2')"
                    prop="adid">
        <adtypes-select v-model="ruleForm.adid"
                        isnoall=true></adtypes-select>
        <span v-if="ruleForm.adid ===1"
              class="tc_blue">多张800px*230</span>
        <span v-if="ruleForm.adid ===2"
              class="tc_blue">两张1800px*230</span>
        <span v-if="ruleForm.adid ===3"
              class="tc_blue">2800px*230</span>
      </el-form-item>
      <el-form-item :label="$t('comm.addImg')">
        <el-upload ref="upload"
                   class="asa_uploader"
                   :action="urlu"
                   :data="uploadImgData"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   list-type="picture-card"
                   name="file"
                   :file-list="uploadList"
                   :limit="getUploadNumber"
                   :http-request="upload">
          <i class="el-icon-plus"></i>
          <div slot="tip"
               class="el-upload__tip">{{$t('operating.f_4')}}</div>
        </el-upload>

      </el-form-item>

      <el-form-item :label="$t('operating.t_3')">

        <div v-for="(itemdata) in uploadList"
             :key="itemdata.id">
          <el-input v-model="itemdata.link"
                    :size="cSize"
                    class="tc_store_w"></el-input>
          <span>{{itemdata.name}}</span>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   :size="cSize"
                   @click="submitForm('ruleForm')">{{$t('signin.sub')}}</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%"
           :src="dialogImageUrl"
           alt="">
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as qiniu from 'qiniu-js'
// import TitleRow from '@/components/home/title-row'
import PpSelect from '@/components/home/pp-select'
import AdtypesSelect from '@/components/home/adtypes-select'
import { getSessionCache } from '@/utils/dom/dom'

export default {
  scrollToTop: true,
  components: {
    // TitleRow,
    PpSelect,
    AdtypesSelect
  },
  head () {
    return {
      title: this.$t('aside.n_1'),
      meta: [
        { hid: 'events custom title', name: 'events', content: 'events custom title description' }
      ]
    }
  },
  data () {
    return {
      imageUrl: '',
      urlu: 'http://upload-z2.qiniup.com/',
      uploadImgData: {
        token: ''
      },
      uploadList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      ruleForm: {
        name: '',
        ppid: '',
        adid: '',
        saveUrl: '',
      },
      rules: {
        // saveUrl: [
        //   { required: true, message: this.$t('comm.noEmpty'), trigger: 'change' }
        // ],
        name: [
          { required: true, message: this.$t('comm.noEmpty'), trigger: 'blur' }
        ],
        ppid: [
          { required: true, message: this.$t('comm.noEmpty'), trigger: 'change' }
        ],
        adid: [
          { required: true, message: this.$t('comm.noEmpty'), trigger: 'change' }
        ],

      }
    }
  },
  computed: {
    getUploadNumber: function () {
      let _n = 100;
      this.ruleForm.adid === 2 && (_n = 2);
      return _n
    },
    ...mapState({
      cSize: state => state.cSize
    })
  },
  created () {
    this.getUpToken();
  },
  mounted () {
    if (this.$route.params.atype === 'add') {
      this.ruleForm = {
        name: '',
        ppid: '',
        adid: '',
      }
    } else {
      // 编辑
      this.getPosterByIdAction(this.$store, {}, this).then(res => {
        // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
        if (res.code === 0) {
          this.ruleForm = {
            name: res.data.title,
            ppid: res.data.platform_id,
            adid: res.data.poster_type_id,
          }
          const _list = res.data.resource;
          if (_list.length) {
            _list.forEach((item) => {
              this.uploadList.push({
                'type': item.type,
                'path': item.path,
                'key': item.path,
                'id': item.id,
                'name': item.path,
                'link': item.extra.link,
                'url': item.path_label,
              });

            })
          }

        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }
      })

    }
  },
  methods: {

    handleRemove (file, fileList) {
      console.log(file, fileList);
      const _list = [...this.uploadList];
      for (let i = 0; i < _list.length; i++) {
        const _id = this.$route.params.atype === 'add' ? file.uid : file.id;
        if (_list[i].id === _id) {
          _list.splice(i, 1);
        }
      }
      this.uploadList = _list;
    },
    handlePreview (file) {
      console.log(file);
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    upload () {
      const that = this;
      /**
       * @link https://developer.qiniu.com/kodo/sdk/1283/javascript#2
       * @type {{next: next, error: error, complete: complete}}
       */
      const files = that.$refs.upload.uploadFiles;
      const file = files[files.length - 1].raw;
      const file2 = files[files.length - 1];
      const fileName = file.name;
      const subObject = {
        next: (res) => { // 上传进度

        },
        // eslint-disable-next-line handle-callback-err
        error: (err) => {
          that.$message.error(that.$t('comm.tip_2'));
        },
        complete: (res) => {
          console.log(files)
          console.log("上传完成", res);
          const _ob = {
            'id': file.uid,
            'name': fileName,
            'type': file.type,
            'link': '',
            'path': res.key,
            'url': file2.url,
            'key': res.key
          };

          that.uploadList = [...that.uploadList, ...[_ob]];
        }
      };
      const token = this.uploadImgData.token;
      const config = {
        useCdnDomain: true,
        disableStatisticsReport: false,
        retryCount: 6,
        region: qiniu.region.z2
      };
      const putExtra = {
        fname: "",
        params: {},
        mimeType: ["image/png", "image/jpeg", "image/jpg"]
      };
      const observable = qiniu.upload(file, fileName, token, putExtra, config);
      observable.subscribe(subObject);
    },

    submitForm (formName) {
      const _that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.uploadList.length <= 0) {
            this.$message.error(this.$t('operating.p_1'));
            return;
          }
          if (_that.ruleForm.adid === 2 && this.uploadList.length > 2) {
            this.$message.error(this.$t('operating.p_2'));
            return;
          }

          if (_that.$route.params.atype === 'add') {
            this.addPosterListAction(this.$store, this.ruleForm, this).then(res => {
              // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.$router.push("/advertising")
              } else if (res.code === 50001 || res.code === 50003) {
                this.$message.error(this.$t('comm.tip_4'));
              } else {
                this.$message.error(this.$t('comm.unknownEorr'));
              }
            })
          } else {
            // 编辑
            this.editPosterListAction(this.$store, this.ruleForm, this).then(res => {
              // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.$router.push("/advertising")
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
    addPosterListAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        title: params.name || '',
        platform_id: params.ppid || '',
        poster_type_id: params.adid || '',
        files: [],
      }
      const _list = [];
      this.uploadList.forEach((item) => {
        _list.push({
          'type': item.type,
          'path': item.key,
          'extra': { 'link': item.link },
        });
      })
      _list.length && (param.files = _list);
      return new Promise(resolve => {
        store.dispatch('addPosterList', param).then(res => {
          resolve(res)
        }).catch(err => {
          this.$message.error(this.$t('comm.unknownEorr') + ":" + err);
        });
      })
    },
    editPosterListAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: self.$route.params.advid || '',
        title: params.name || '',
        platform_id: params.ppid || '',
        poster_type_id: params.adid || '',
        files: [],
      }
      const _list = [];
      this.uploadList.forEach((item) => {
        _list.push({
          'type': item.type,
          'path': item.key,
          'extra': { 'link': item.link },
        });
      })
      _list.length && (param.files = _list);
      return new Promise(resolve => {
        store.dispatch('editPosterList', param).then(res => {
          resolve(res)
        })
      })
    },
    getPosterByIdAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: self.$route.params.advid || '',
      }
      return new Promise(resolve => {
        store.dispatch('getPosterById', param).then(res => {
          resolve(res)
        })
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    getUpToken () {
      this.getQiniuToken(this.$store, { token: getSessionCache("userToken") || '' }, this).then(res => {
        if (res.code === 0) {
          this.uploadImgData.token = res.data.token;
        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }
      })

    },
    getQiniuToken (store, params, self) {
      return new Promise(resolve => {
        store.dispatch('qiniuToken', params).then(res => {
          resolve(res)
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.dstore_add
  font-size 16px
  margin-top 1.767rem
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
    width 250px
</style>
