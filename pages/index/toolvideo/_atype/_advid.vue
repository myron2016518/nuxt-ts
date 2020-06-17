<template>
  <div class="dstore_add">
    <!-- <title-row :title="$t('aside.dealers3_2')"></title-row> -->
    <el-form ref="ruleForm"
             :model="ruleForm"
             :rules="rules"
             label-width="100px"
             class="demo-ruleForm">

      <el-form-item :label="$t('operating.f_8')"
                    prop="name">
        <el-input v-model="ruleForm.name"
                  :size="cSize"
                  class="tc_store_w"></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('operating.f_9')"
                    prop="username">
        <el-input v-model="ruleForm.username"
                  :size="cSize"
                  class="tc_store_w"></el-input>
      </el-form-item>
      <el-form-item :label="$t('operating.f_10')"
                    prop="time">
        <el-input v-model="ruleForm.time"
                  :size="cSize"
                  class="tc_store_w"></el-input>
      </el-form-item> -->
      <el-form-item :label="$t('operating.f_1')"
                    prop="ppid">
        <pp-select v-model="ruleForm.ppid"
                   isnoall=true></pp-select>
      </el-form-item>

      <el-form-item :label="$t('operating.f_11')">
        <el-upload ref="upload"
                   class="asa_uploader"
                   :action="urlu"
                   :data="uploadImgData"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   list-type="picture-card"
                   name="file"
                   :file-list="uploadList"
                   :limit=1
                   :http-request="upload">
          <i class="el-icon-plus"></i>
          <div slot="tip"
               class="el-upload__tip">{{$t('operating.f_4')}}</div>
        </el-upload>
      </el-form-item>

      <el-form-item :label="$t('operating.f_12')">
        <el-upload ref="uploadvideo"
                   class="asa_uploader_video"
                   :action="urlu"
                   :data="uploadImgData"
                   :on-remove="handleVideoRemove"
                   name="file"
                   :file-list="uploadVidoeList"
                   :limit=1
                   :http-request="uploadVideo">
          <el-button size="small"
                     type="primary">{{$t('comm.uploadBtn')}}</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item :label="$t('operating.f_13')">
        {{ruleForm.videotime ||0}} <span>秒</span>
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
// import AdtypesSelect from '@/components/home/adtypes-select'
import { getSessionCache } from '@/utils/dom/dom'

export default {
  scrollToTop: true,
  components: {
    // TitleRow,
    PpSelect,
    // AdtypesSelect
  },
  head () {
    return {
      title: this.$t('aside.n_1_5'),
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
      uploadVidoeList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      ruleForm: {
        name: '',
        time: '',
        ppid: '',
        saveUrl: '',
        videotime: '',
        status: -1,
      },
      rules: {
        // saveUrl: [
        //   { required: true, message: this.$t('comm.noEmpty'), trigger: 'change' }
        // ],
        name: [
          { required: true, message: this.$t('comm.noEmpty'), trigger: 'blur' }
        ],

        time: [
          { required: true, message: this.$t('comm.noEmpty'), trigger: 'blur' }
        ],
        ppid: [
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
    this.getUpToken();
  },
  mounted () {
    if (this.$route.params.atype === 'add') {
      this.ruleForm = {
        name: '',
        time: '',
        ppid: '',
        saveUrl: '',
        videotime: '',
        status: -1,
      }
    } else {
      // 编辑
      this.getCourseByIdAction(this.$store, {}, this).then(res => {
        if (res.code === 0) {
          const _file = res.data.resource[0];
          this.ruleForm = {
            name: res.data.title,
            ppid: res.data.platform_id,
            videotime: _file.extra.duration,
            status: res.data.status || 1,
          }
          this.uploadVidoeList = [{
            'type': _file.type,
            'path': _file.path,
            'key': _file.path,
            'id': _file.id,
            'name': _file.path,
            'url': _file.path_label,
          }];
          this.uploadList = [{
            'path': res.data.cover,
            'key': res.data.cover,
            'id': res.data.cover,
            'url': res.data.cover_label,
          }];

        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }
      })

    }
  },
  methods: {

    handleRemove (file, fileList) {
      console.log(file, fileList);
      this.uploadList = [];
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

          that.uploadList = [_ob];
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

    handleVideoRemove (file, fileList) {
      this.uploadVidoeList = [];
      this.ruleForm.videotime = 0;
    },
    uploadVideo () {
      const that = this;
      /**
       * @link https://developer.qiniu.com/kodo/sdk/1283/javascript#2
       * @type {{next: next, error: error, complete: complete}}
       */

      const files = that.$refs.uploadvideo.uploadFiles;
      console.log(files);
      const file = files[files.length - 1].raw;
      const file2 = files[files.length - 1];
      const fileName = file.name;

      // 获取视频或者音频时长
      const fileurl = URL.createObjectURL(file);
      // 经测试，发现audio也可获取视频的时长
      const audioElement = new Audio(fileurl);
      let duration;
      audioElement.addEventListener("loadedmetadata", function (_event) {
        duration = audioElement.duration;
        console.log("duration");
        console.log(duration);// 单位：秒
        that.ruleForm.videotime = parseInt(duration);
      });

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

          that.uploadVidoeList = [_ob];
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
        // mimeType: ["image/png", "image/jpeg", "image/jpg"]
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
          if (_that.uploadVidoeList <= 0) {
            this.$message.error(this.$t('operating.p_4'));
            return;
          }

          if (_that.$route.params.atype === 'add') {
            this.addCourseListAction(this.$store, this.ruleForm, this).then(res => {
              // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.$router.push("/toolvideo")
              } else if (res.code === 50001 || res.code === 50003) {
                this.$message.error(this.$t('comm.tip_4'));
              } else {
                this.$message.error(this.$t('comm.unknownEorr'));
              }
            })
          } else {
            // 编辑
            this.editCourseAction(this.$store, this.ruleForm, this).then(res => {
              // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.$router.push("/toolvideo")
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
    addCourseListAction (store, params, self) {

      const param = {
        token: getSessionCache("userToken") || '',
        title: params.name || '',
        platform_id: params.ppid || '',
        cover: this.uploadList[0].key || '',
        files: [
          { type: 'video', path: this.uploadVidoeList[0].key, extra: { duration: params.videotime || 0 } }
        ],
        status: params.status,
      }
      return new Promise(resolve => {
        store.dispatch('addCourseList', param).then(res => {
          resolve(res)
        }).catch(err => {
          this.$message.error(this.$t('comm.unknownEorr') + ":" + err);
        });
      })
    },
    editCourseAction (store, params, self) {
      console.log(params, this.uploadList);
      const param = {
        token: getSessionCache("userToken") || '',
        sId: self.$route.params.advid || '',
        title: params.name || '',
        platform_id: params.ppid || '',
        cover: this.uploadList[0].key || '',
        files: [
          { type: 'video', path: this.uploadVidoeList[0].key, extra: { duration: params.videotime || 0 } }
        ],
        status: params.status,
      }
      return new Promise(resolve => {
        store.dispatch('editCourse', param).then(res => {
          resolve(res)
        })
      })
    },
    getCourseByIdAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: self.$route.params.advid || '',
      }
      return new Promise(resolve => {
        store.dispatch('getCourseById', param).then(res => {
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
