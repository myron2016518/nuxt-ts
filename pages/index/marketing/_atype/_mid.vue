<template>
  <div class="dstore_add">
    <!-- <title-row :title="$t('aside.dealers3_2')"></title-row> -->
    <el-form ref="ruleForm"
             :model="ruleForm"
             :rules="rules"
             label-width="200px"
             class="demo-ruleForm">
      <el-form-item :label="$t('operating.f_1')"
                    prop="pid">
        <!-- <pp-select v-model="ruleForm.pid"
                   isnoall=true></pp-select> -->
        <el-select v-model="ruleForm.pid"
                   :placeholder="$t('comm.pleaseselect')"
                   :size="cSize">
          <el-option v-for="item in snppSelect"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="ruleForm.pcid"
                   :placeholder="$t('comm.pleaseselect')"
                   :size="cSize">
          <el-option v-for="item in snProductChildren"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('operating.t_64')">
        <el-select v-model="ruleForm.merchantid"
                   :placeholder="$t('comm.pleaseselect')"
                   :size="cSize">

          <el-option v-for="item in merchantSelect"
                     :key="item.id"
                     :label="item.merchant"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-divider></el-divider>
      <!-- 试用 -->
      <el-form-item :label="$t('operating.f_33')">
        <el-switch v-model="tryIsOpen">
        </el-switch>
      </el-form-item>
      <el-form-item :label="$t('operating.f_22')">
        <el-input-number v-model="ruleForm.trynum"
                         :disabled="!tryIsOpen"
                         :size="cSize"
                         step-strictly
                         controls-position="right"
                         :min="0"></el-input-number>
        {{$t('operating.f_23')}}
        <p v-if="ruleForm.trynum > 0"
           class="try_tip1"> {{$t('operating.f_24')}}</P>
      </el-form-item>

      <el-form-item>
        <el-input v-model="ruleForm.desc"
                  :disabled="!tryIsOpen"
                  type="textarea"
                  class="tc_store_w"
                  :autosize="{ minRows: 4, maxRows: 6}"></el-input>
      </el-form-item>
      <el-divider></el-divider>
      <!-- 赠送 -->
      <el-form-item :label="$t('operating.f_35')">
        <el-switch v-model="givingIsOpen">
        </el-switch>
      </el-form-item>
      <el-form-item :label="$t('operating.f_25')">
        <el-input-number v-model="ruleForm.givingnum"
                         :size="cSize"
                         :disabled="!givingIsOpen"
                         step-strictly
                         controls-position="right"
                         :min="0"></el-input-number>
        {{$t('operating.f_23')}}
        <p v-if="ruleForm.trynum > 0"
           class="try_tip1"> {{$t('operating.f_24')}}</P>
      </el-form-item>

      <el-form-item>
        <el-input v-model="ruleForm.givingdesc"
                  type="textarea"
                  :disabled="!givingIsOpen"
                  class="tc_store_w"
                  :autosize="{ minRows: 4, maxRows: 6}"></el-input>
      </el-form-item>
      <el-divider></el-divider>
      <!-- 组合购买 -->
      <el-form-item :label="$t('operating.f_26')">
        <el-switch v-model="combIsOpen">
        </el-switch>
      </el-form-item>
      <!-- <el-form-item :label="$t('operating.f_26')">
        <el-select v-model="ruleForm.combstatus"
                   :placeholder="$t('comm.pleaseselect')"
                   :size="cSize">
          <el-option key="0"
                     value="0"
                     :label="$t('comm.yes')">
          </el-option>
          <el-option key="1"
                     value="1"
                     :label="$t('comm.no')">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="warning"
                   :size="cSize"
                   :disabled="!combIsOpen"
                   class="markBt2"
                   @click="addCombList">{{$t('comm.add')}}</el-button>
      </el-form-item>
      <el-form-item v-for="item in combList"
                    :key="item.id"
                    :label="$t('operating.f_27')">
        <el-input-number v-model="item.number"
                         :size="cSize"
                         :disabled="!combIsOpen"
                         :precision="2"
                         step-strictly
                         controls-position="right"
                         :min="1"></el-input-number>
        {{$t('operating.f_28')}}
        <el-input-number v-model="item.discount"
                         :size="cSize"
                         :disabled="!combIsOpen"
                         step-strictly
                         controls-position="right"
                         :min="0"></el-input-number>
        {{$t('operating.f_29')}}
        <el-button type="danger"
                   :size="cSize"
                   icon="el-icon-delete"
                   :disabled="!combIsOpen"
                   circle
                   @click="deleteComb(item.id)"></el-button>

      </el-form-item>

      <el-form-item>
        <el-input v-model="ruleForm.combdesc"
                  type="textarea"
                  class="tc_store_w"
                  :disabled="!combIsOpen"
                  :autosize="{ minRows: 4, maxRows: 6}"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   :size="cSize"
                   class="markBt1"
                   @click="submitForm('ruleForm')">{{$t('signin.sub')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import * as qiniu from 'qiniu-js'
// import TitleRow from '@/components/home/title-row'
// import PpSelect from '@/components/home/pp-select'
import { getSessionCache } from '@/utils/dom/dom'

export default {
  scrollToTop: true,
  components: {
    // TitleRow,
    // PpSelect,
  },
  head () {
    return {
      title: this.$t('aside.n_9'),
      meta: [
        { hid: 'events custom title', name: 'events', content: 'events custom title description' }
      ]
    }
  },
  data () {
    return {
      tryIsOpen: true,// 试用是否打开
      givingIsOpen: true,// 赠送是否打开
      combIsOpen: true,// 组合是否打开
      ruleForm: {
        trynum: 0,
        desc: '',
        givingnum: 0,
        givingdesc: '',
        pid: '',
        pcid: '',
        combdesc: '',
        merchantid: '',

      },
      rules: {

        // desc: [
        //   { required: true, message: this.$t('comm.noEmpty'), trigger: 'blur' }
        // ],
        pid: [
          { required: true, message: this.$t('comm.noEmpty'), trigger: 'change' }
        ],

      },
      combList: [],
      snProductChildren: [],
      isEditorFirst: false,
    }
  },
  computed: {
    pid () {
      return this.ruleForm.pid
    },
    ...mapState({
      snppSelect: state => state.snppSelect,
      merchantSelect: state => state.merchantSelect,
      cSize: state => state.cSize
    })
  },
  watch: {
    pid (newValue, oldValue) {
      if (this.isEditorFirst) {
        this.isEditorFirst = false;
      } else {
        this.ruleForm.pcid = '';
      }

      const _cl = this.snppSelect.find(item => item.id === newValue);
      _cl && (this.snProductChildren = _cl.children || []);
    }
  },
  created () {

    if (!this.snppSelect.length) {
      // 获取产品平台列表接口
      this.getAllProductList(this.$store, {}, this).then(res => {
        // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
        if (res.code === 0) {
          this.$store.commit('SET_SNPPSELECT', res.data)
        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }
      })
    }

    if (!this.merchantSelect.length) {
      // 获取经销商列表接口
      this.getMerchantSelectList(this.$store, {}, this).then(res => {
        if (res.code === 0) {
          this.$store.commit('SET_MERCHANTSELECT', res.data)
        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }
      })
    }

  },
  mounted () {
    if (this.$route.params.atype === 'add') {
      this.ruleForm = {
        trynum: 0,
        desc: '',
        givingnum: 0,
        givingdesc: '',
        pid: '',
        pcid: '',
        combdesc: '',
        merchantid: '',
      }
      this.combList = [
        { 'id': 'c1', 'number': 1, 'discount': 80 }
      ];
    } else {
      // 编辑
      this.getMarketingByIdAction(this.$store, {}, this).then(res => {
        // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
        if (res.code === 0) {
          this.isEditorFirst = true;
          // this.ruleForm = {
          //   trynum: res.data.trial_days || 0,
          //   desc: res.data.trial_description || '',
          //   givingnum: res.data.give_days || 0,
          //   givingdesc: res.data.give_description || '',
          //   pid: res.data.pid || '',
          //   pcid: res.data.product_id || '',
          //   // combstatus: res.data.scheme.rule.length === 0 ? '1' : '0',
          //   combdesc: res.data.scheme.description || '',
          // };
          this.ruleForm.pid = res.data.pid || '';
          this.ruleForm.pcid = res.data.product_id || '';
          this.ruleForm.merchantid = res.data.merchant_id || '';
          if (!res.data.trial_days && !res.data.trial_description) {
            this.tryIsOpen = false;
          } else {
            this.ruleForm.trynum = res.data.trial_days || 0;
            this.ruleForm.desc = res.data.trial_description || '';
          }

          if (!res.data.give_days && !res.data.give_description) {
            this.givingIsOpen = false;
          } else {
            this.ruleForm.givingnum = res.data.give_days || 0;
            this.ruleForm.givingdesc = res.data.give_description || '';
          }

          if (!res.data.scheme) {
            this.combIsOpen = false;
          } else {
            this.ruleForm.combdesc = res.data.scheme.description || '';
            const _list = [];
            res.data.scheme.rule.map((_item, _idx) => {
              _list.push({ 'id': 'c' + _idx, 'number': _item.num, 'discount': parseFloat(_item.ratio) * 100 });
            })
            _list.length && (this.combList = _list);
          }


        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }
      })

    }
  },
  methods: {
    addCombList () {
      this.combList.push({ 'id': new Date().getTime().toString(), 'number': 1, 'discount': 80 });
    },
    deleteComb (_id) {
      console.log(_id);
      const _list = this.combList.filter((item) => {
        return !_id.includes(item.id)
      });

      this.combList = _list;
    },
    submitForm (formName) {
      const _that = this;
      console.log(_that.combList);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!_that.tryIsOpen && !_that.givingIsOpen && !_that.combIsOpen) return;
          if (_that.$route.params.atype === 'add') {
            this.addMarketingAction(this.$store, this.ruleForm, this).then(res => {
              // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.$router.push("/marketing")
              } else if (res.code === 50001 || res.code === 50003) {
                this.$message.error(this.$t('comm.tip_4'));
              } else {
                this.$message.error(this.$t('comm.unknownEorr'));
              }
            })
          } else {
            // 编辑
            this.editMarketingAction(this.$store, this.ruleForm, this).then(res => {
              // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.$router.push("/marketing")
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
    addMarketingAction (store, params, self) {
      const param = {
        'token': getSessionCache("userToken") || '',
        'pid': params.pid || '',
        'status': 0,
      };

      params.pcid !== '' && (param.product_id = params.pcid);
      params.merchantid !== '' && (param.merchant_id = params.merchantid);
      params.trynum !== 0 && self.tryIsOpen && (param.trial_days = params.trynum);
      params.desc !== '' && self.tryIsOpen && (param.trial_description = params.desc);
      params.givingnum !== 0 && self.givingIsOpen && (param.give_days = params.givingnum);
      params.givingdesc !== 0 && self.givingIsOpen && (param.give_description = params.givingdesc);

      if (self.combIsOpen) {
        const _d = {
          'description': '',
          'rule': [],
        }
        params.combdesc !== 0 && (_d.description = params.combdesc);
        const _list = [];
        self.combList.map((_item) => {
          _list.push({ 'num': _item.number, 'ratio': _item.discount / 100 });
        })
        _list.length && (_d.rule = _list);
        param.scheme = _d;
      }

      // params.combdesc !== 0 && self.combIsOpen && (param.scheme.description = params.combdesc);
      // const _list = [];
      // self.combList.map((_item) => {
      //   _list.push({ 'num': _item.number, 'ratio': _item.discount / 100 });
      // })
      // _list.length && self.combIsOpen && (param.scheme.rule = _list);

      return new Promise(resolve => {
        store.dispatch('addMarketing', param).then(res => {
          resolve(res)
        }).catch(err => {
          this.$message.error(this.$t('comm.unknownEorr') + ":" + err);
        });
      })
    },
    editMarketingAction (store, params, self) {

      const param = {
        'token': getSessionCache("userToken") || '',
        'sId': self.$route.params.mid || '',
        'pid': params.pid || '',
        'status': 0,
      }
      params.pcid !== '' && (param.product_id = params.pcid);
      params.merchantid !== '' && (param.merchant_id = params.merchantid);
      params.trynum !== 0 && (param.trial_days = self.tryIsOpen ? params.trynum : 0);
      params.desc !== '' && (param.trial_description = self.tryIsOpen ? params.desc : '');
      params.givingnum !== 0 && (param.give_days = self.givingIsOpen ? params.givingnum : 0);
      params.givingdesc !== 0 && (param.give_description = self.givingIsOpen ? params.givingdesc : '');

      if (self.combIsOpen) {
        const _d = {
          'description': '',
          'rule': [],
        }
        params.combdesc !== 0 && (_d.description = params.combdesc);
        const _list = [];
        self.combList.map((_item) => {
          _list.push({ 'num': _item.number, 'ratio': _item.discount / 100 });
        })
        _list.length && (_d.rule = _list);
        param.scheme = _d;
      } else {
        param.scheme = [''];
      }


      return new Promise(resolve => {
        store.dispatch('editMarketing', param).then(res => {
          resolve(res)
        }).catch(err => {
          this.$message.error(this.$t('comm.unknownEorr') + ":" + err);
        });
      })
    },
    getMarketingByIdAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: self.$route.params.mid || '',
      }
      return new Promise(resolve => {
        store.dispatch('getMarketingById', param).then(res => {
          resolve(res)
        }).catch(err => {
          this.$message.error(this.$t('comm.unknownEorr') + ":" + err);
        });
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },

    getAllProductList (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
      }
      return new Promise(resolve => {
        store.dispatch('getAllProductList', param).then(res => {
          resolve(res)
        }).catch(err => {
          this.$message.error(this.$t('comm.unknownEorr') + ":" + err);
        });
      })
    },

    getMerchantSelectList (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
      }
      return new Promise(resolve => {
        store.dispatch('getMerchantSelectList', param).then(res => {
          resolve(res)
        })
      })
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
  .try_tip1
    line-height 20px
    color #909399
    font-size 12px
  .markBt1
    width 450px
  .markBt2
    width 130px
</style>
