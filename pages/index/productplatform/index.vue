<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_1_4')"></title-row>
    <el-row class="dtc_action">
      <el-col :span="12"
              class="tc_pp_table1">
        <el-button type="primary"
                   :size="cSize"
                   @click="platformAction('add')">{{$t('comm.add')}}</el-button>

        <el-table v-loading="loading"
                  class="d_plist_table"
                  max-height="500"
                  :data="productPlatformSelect">
          <el-table-column prop="name"
                           :label="$t('operating.f_1')">
          </el-table-column>
          <el-table-column :label="$t('comm.action')">
            <template slot-scope="scope">
              <el-button type="text"
                         size="small"
                         @click.native.prevent="platformAction('editor',scope.row)">
                {{$t('comm.editor')}}
              </el-button>
              <el-button type="text"
                         size="small"
                         @click.native.prevent="platformAction('delete',scope.row)">
                {{$t('comm.delete')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12"
              class="tc_pp_table1">
        <el-button type="primary"
                   :size="cSize"
                   @click="posterTypeformAction('add')">{{$t('comm.add')}}</el-button>

        <el-table v-loading="loading2"
                  class="d_plist_table"
                  max-height="500"
                  :data="adtypesSelect">
          <el-table-column prop="name"
                           :label="$t('operating.f_2')">
          </el-table-column>
          <el-table-column :label="$t('comm.action')">
            <template slot-scope="scope">
              <el-button type="text"
                         size="small"
                         @click.native.prevent="posterTypeformAction('editor',scope.row)">
                {{$t('comm.editor')}}
              </el-button>
              <el-button type="text"
                         size="small"
                         @click.native.prevent="posterTypeformAction('delete',scope.row)">
                {{$t('comm.delete')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

    </el-row>

    <el-dialog :title="platFormTitle"
               width="30%"
               :visible.sync="platDialogVisible">
      <el-form ref="platForm"
               :model="platForm"
               :rules="rulesPlat"
               label-width="auto"
               class="pp_d_form">
        <el-form-item :label="$t('operating.f_1')"
                      prop="name">
          <el-input v-model="platForm.name"
                    :size="cSize"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     :size="cSize"
                     @click="submitPlatForm('platForm')">{{$t('comm.confirm')}}</el-button>
          <el-button :size="cSize"
                     @click="platDialogVisible = false">{{$t('comm.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="posterFormTitle"
               width="30%"
               :visible.sync="posterTypeDialogVisible">
      <el-form ref="posterTypeForm"
               :model="posterTypeForm"
               :rules="rulesPoster"
               label-width="auto"
               class="pp_d_form">
        <el-form-item :label="$t('operating.f_2')"
                      prop="name">
          <el-input v-model="posterTypeForm.name"
                    :size="cSize"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     :size="cSize"
                     @click="submitPosterTypeForm('posterTypeForm')">{{$t('comm.confirm')}}</el-button>
          <el-button :size="cSize"
                     @click="posterTypeDialogVisible = false">{{$t('comm.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import TitleRow from '@/components/home/title-row'
import { getSessionCache } from '@/utils/dom/dom'

export default {
  scrollToTop: true,
  components: {
    TitleRow,
  },

  head () {
    return {
      title: this.$t('aside.n_1_4'),
      meta: [
        { hid: 'adv custom title', name: 'adv', content: 'adv custom title description' }
      ]
    }
  },
  data () {

    return {
      loading: false,
      loading2: false,
      platDialogVisible: false,
      platActionType: 'add',
      platFormTitle: this.$t('comm.add') + "--" + this.$t('operating.f_1'),
      posterTypeDialogVisible: false,
      posterActionType: 'add',
      posterFormTitle: this.$t('comm.add') + "--" + this.$t('operating.f_2'),
      platForm: {
        id: '',
        name: '',
      },
      posterTypeForm: {
        id: '',
        name: '',
      },
      rulesPlat: {
        name: [
          { required: true, message: this.$t('comm.noEmpty'), trigger: 'blur' }
        ],
      },
      rulesPoster: {
        name: [
          { required: true, message: this.$t('comm.noEmpty'), trigger: 'blur' }
        ],
      },

    }
  },
  computed: {
    ...mapState({
      productPlatformSelect: state => state.productPlatformSelect,
      adtypesSelect: state => state.adtypesSelect,
      cSize: state => state.cSize,
    })
  },

  mounted () {
    !this.productPlatformSelect.length && this.actionGetPlatformList();
    !this.adtypesSelect.length && this.actionGetPosterTypeList();
  },
  methods: {

    submitPlatForm (formName) {
      const _that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.platForm.name === '') {
            this.$message.error(this.$t('comm.noEmpty'));
            return;
          }

          if (_that.platActionType === 'add') {
            this.addpPlatformAction(this.$store, this.platForm, this).then(res => {
              // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.platDialogVisible = false;
                this.actionGetPlatformList();
              } else if (res.code === 50001 || res.code === 50003) {
                this.$message.error(this.$t('comm.tip_4'));
              } else {
                this.$message.error(this.$t('comm.unknownEorr'));
              }
            }, (err) => {
              this.$message.error(err.data.message);
            })
          } else {
            // 编辑
            this.editPlatformAction(this.$store, this.platForm, this).then(res => {
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.platDialogVisible = false;
                this.actionGetPlatformList();
              } else if (res.code === 50001 || res.code === 50003) {
                this.$message.error(this.$t('comm.tip_4'));
              } else {
                this.$message.error(this.$t('comm.unknownEorr'));
              }
            }, (err) => {
              this.$message.error(err.data.message);
            });
          }
        } else {
          return false;
        }
      });
    },
    platformAction (_type, _info) {
      this.platActionType = _type;
      if (_type === 'add') {
        this.platDialogVisible = true;
        this.platFormTitle = this.$t('comm.add') + "--" + this.$t('operating.f_1');
        this.platForm = {
          id: '',
          name: '',
        }
      } else if (_type === 'delete') {
        this.$confirm(this.$t('comm.confDelete'))
          .then(_ => {
            this.deletePlatformAction(this.$store, _info, this).then(res => {
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.actionGetPlatformList();
              } else {
                this.$message.error(this.$t('comm.tip_4'));
              }

            })
          })
          .catch(_ => { });
      } else if (_type === 'editor') {
        this.platDialogVisible = true;
        this.platFormTitle = this.$t('comm.editor') + "--" + this.$t('operating.f_1');
        this.platForm = {
          id: _info.id || '',
          name: _info.name || '',
        }
      } else {

      }
    },
    addpPlatformAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        name: params.name || '',
      }
      return new Promise((resolve, reject) => {
        store.dispatch('addpPlatform', param).then((res, error) => {
          resolve(res)
        }).catch(err => {
          reject(err.response)
        });
      })
    },
    editPlatformAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: params.id || '',
        name: params.name || '',
      }
      return new Promise((resolve, reject) => {
        store.dispatch('editPlatform', param).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err.response)
        });
      })
    },
    deletePlatformAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: params.id || '',
      }
      return new Promise(resolve => {
        store.dispatch('deletePlatform', param).then(res => {
          resolve(res)
        })
      })
    },




    submitPosterTypeForm (formName) {
      const _that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.posterTypeForm.name === '') {
            this.$message.error(this.$t('comm.noEmpty'));
            return;
          }

          if (_that.posterActionType === 'add') {
            this.addPosterTypeformAction(this.$store, this.posterTypeForm, this).then(res => {
              // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.posterTypeDialogVisible = false;
                this.actionGetPosterTypeList();
              } else if (res.code === 50001 || res.code === 50003) {
                this.$message.error(this.$t('comm.tip_4'));
              } else {
                this.$message.error(this.$t('comm.unknownEorr'));
              }
            }, (err) => {
              this.$message.error(err.data.message);
            })
          } else {
            // 编辑
            this.editPosterTypeformAction(this.$store, this.posterTypeForm, this).then(res => {
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.posterTypeDialogVisible = false;
                this.actionGetPosterTypeList();
              } else if (res.code === 50001 || res.code === 50003) {
                this.$message.error(this.$t('comm.tip_4'));
              } else {
                this.$message.error(this.$t('comm.unknownEorr'));
              }
            }, (err) => {
              this.$message.error(err.data.message);
            });
          }
        } else {
          return false;
        }
      });
    },
    posterTypeformAction (_type, _info) {
      this.posterActionType = _type;
      if (_type === 'add') {
        this.posterTypeDialogVisible = true;
        this.posterFormTitle = this.$t('comm.add') + "--" + this.$t('operating.f_2');
        this.posterTypeForm = {
          id: '',
          name: '',
        }
      } else if (_type === 'delete') {
        this.$confirm(this.$t('comm.confDelete'))
          .then(_ => {
            this.deletePosterTypeformAction(this.$store, _info, this).then(res => {
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.actionGetPosterTypeList();
              } else {
                this.$message.error(this.$t('comm.tip_4'));
              }

            })
          })
          .catch(_ => { });
      } else if (_type === 'editor') {
        this.posterTypeDialogVisible = true;
        this.posterFormTitle = this.$t('comm.editor') + "--" + this.$t('operating.f_2');
        this.posterTypeForm = {
          id: _info.id || '',
          name: _info.name || '',
        }
      } else {

      }
    },
    addPosterTypeformAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        name: params.name || '',
      }
      return new Promise((resolve, reject) => {
        store.dispatch('addPosterType', param).then((res, error) => {
          resolve(res)
        }).catch(err => {
          reject(err.response)
        });
      })
    },
    editPosterTypeformAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: params.id || '',
        name: params.name || '',
      }
      return new Promise((resolve, reject) => {
        store.dispatch('editPosterType', param).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err.response)
        });
      })
    },
    deletePosterTypeformAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: params.id || '',
      }
      return new Promise(resolve => {
        store.dispatch('deletePosterType', param).then(res => {
          resolve(res)
        })
      })
    },



    actionGetPlatformList () {
      this.loading = true;
      const _userToken = getSessionCache("userToken");
      this.getPlatformList(this.$store, { 'token': _userToken }, this).then(res => {
        // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
        if (res.code === 0) {
          this.$store.commit('SET_PPSELECT', res.data)
        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }
        this.loading = false;
      })
    },
    actionGetPosterTypeList () {
      this.loading2 = true;
      const _userToken = getSessionCache("userToken");
      this.getPosterTypeList(this.$store, { 'token': _userToken }, this).then(res => {
        // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
        if (res.code === 0) {
          this.$store.commit('SET_ADTYPESELECT', res.data)
        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }
        this.loading2 = false;
      })
    },
    getPlatformList (store, params, self) {
      return new Promise(resolve => {
        store.dispatch('getPlatformList', params).then(res => {
          resolve(res)
        })
      })
    },
    getPosterTypeList (store, params, self) {
      return new Promise(resolve => {
        store.dispatch('getPosterTypeList', params).then(res => {
          resolve(res)
        })
      })
    },


  }
}
</script>

<style lang="stylus" scoped>
.d_tcpde_p
  font-size 14px
  background-color #fff
  .d_tcpde_main
    padding 10px
    .d_plist_form
      .el-form-item
        margin-bottom 0px
  .tc_pp_table1
    padding 2% 5% 2% 10%
  .dtc_action
    padding 0px 10px
    .dtc_pa
      text-align right
  .d_tcpde_table
    padding 0 10px
</style>
