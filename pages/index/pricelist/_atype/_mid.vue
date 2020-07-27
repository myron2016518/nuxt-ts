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
          <el-option v-for="item in priceProductSelect"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('operating.t_63')"
                    prop="pcid">
        <el-select v-model="ruleForm.pcid"
                   :placeholder="$t('comm.pleaseselect')"
                   :size="cSize"
                   @change="pcidChange">
          <el-option v-for="item in priceProductChildren"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('operating.t_64')">
        <el-select v-model="ruleForm.merchantid"
                   multiple
                   :placeholder="$t('comm.pleaseselect')"
                   :size="cSize"
                   class="merchant_s">

          <el-option v-for="item in merchantSelectList"
                     :key="item.id"
                     :label="item.merchant"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('operating.t_67')">
        <el-input-number v-model="ruleForm.originalprice"
                         :size="cSize"
                         :precision="2"
                         step-strictly
                         controls-position="right"
                         :min="1"></el-input-number>
        {{$t('operating.p_7')}}
      </el-form-item>

      <el-form-item :label="$t('operating.t_69')">
        <el-input-number v-model="ruleForm.discount"
                         :size="cSize"
                         :precision="2"
                         :step="0.1"
                         :max="1"
                         controls-position="right"
                         :min="0.1"></el-input-number>
        {{$t('operating.p_7')}}
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
        pid: '',
        pcid: '',
        merchantid: [],
        originalprice: 1,
        discount: 1,
      },
      rules: {

        // desc: [
        //   { required: true, message: this.$t('comm.noEmpty'), trigger: 'blur' }
        // ],
        pid: [
          { required: true, message: this.$t('comm.noEmpty'), trigger: 'change' }
        ],
        pcid: [
          { required: true, message: this.$t('comm.noEmpty'), trigger: 'change' }
        ],

      },
      priceProductChildren: [],   // 配置列表
      PPSofts: [],   // 软件列表
      merchantSelectList: [],   // 经销商列表
      isEditorFirst: false,
    }
  },
  computed: {
    pid () {
      return this.ruleForm.pid
    },
    pcid () {
      return this.ruleForm.pcid
    },
    ...mapState({
      priceProductSelect: state => state.priceProductSelect,
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

      const _cl = this.priceProductSelect.find(item => item.id === newValue);
      // _cl && (this.priceProductChildren = _cl.children || []);
      if (_cl) {
        this.priceProductChildren = _cl.children || [];
        this.PPSofts = _cl.softs || []
      }
    }
  },
  created () {

    if (!this.priceProductSelect.length) {
      // 获取产品平台列表接口
      this.getProductSelectList(this.$store, {}, this).then(res => {
        // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
        if (res.code === 0) {
          this.$store.commit('SET_PRICEPRODUCTSELECT', res.data)
        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }
      })
    }

    if (!this.merchantSelect.length) {
      // 获取经销商列表接口
      this.getMerchantSelectList(this.$store, {}, this).then(res => {
        if (res.code === 0) {
          this.$store.commit('SET_MERCHANTSELECT', res.data);
          this.merchantSelectList = res.data;
        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }
      })
    } else {
      this.merchantSelectList = this.merchantSelect;
    }

  },
  mounted () {
    if (this.$route.params.atype === 'add') {
      this.ruleForm = {
        pid: '',
        pcid: '',
        merchantid: [],
        originalprice: 1,
        discount: 0.8,
      }

    } else {
      // 编辑
      // this.getMarketingByIdAction(this.$store, {}, this).then(res => {
      //   // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
      //   if (res.code === 0) {
      //     this.isEditorFirst = true;

      //     this.ruleForm.pid = res.data.pid || '';
      //     this.ruleForm.pcid = res.data.product_id || '';


      //   } else {
      //     this.$message.error(this.$t('comm.tip_4'));
      //   }
      // })

    }
  },
  methods: {
    pcidChange (v) {
      this.ruleForm.merchantid = [];
      this.getProductMerchantListAction(this.$store, { 'product_id': v }, this).then(res => {
        // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
        if (res.code === 0) {
          // this.merchantSelect
          let _list = this.merchantSelect;
          res.data.map((_i) => {
            _list = _list.filter(_item => _item.id !== _i)
          });
          this.merchantSelectList = _list;
        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }
      })
    },

    submitForm (formName) {
      const _that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {

          if (_that.$route.params.atype === 'add') {
            this.addProductPricingAction(this.$store, this.ruleForm, this).then(res => {
              // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.$router.push("/pricelist")
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
                this.$router.push("/pricelist")
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
    addProductPricingAction (store, params, self) {
      const param = {
        'token': getSessionCache("userToken") || '',
        'pid': params.pid || '',
      };

      params.pcid !== '' && (param.product_id = params.pcid);
      params.merchantid.length > 0 && (param.merchant_id = params.merchantid);
      params.originalprice !== 0 && (param.origin_price = params.originalprice);
      params.discount !== 0 && (param.rate = params.discount);

      return new Promise(resolve => {
        store.dispatch('addProductPricing', param).then(res => {
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
    getProductSelectList (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
      }
      return new Promise(resolve => {
        store.dispatch('getProductSelectList', param).then(res => {
          resolve(res)
        })
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
    getProductMerchantListAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        product_id: params.product_id || '',
      }
      return new Promise(resolve => {
        store.dispatch('getProductMerchantList', param).then(res => {
          resolve(res)
        }).catch(err => {
          this.$message.error(this.$t('comm.unknownEorr') + ":" + err);
        });
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
  .merchant_s
    width 403px
</style>
