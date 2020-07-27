<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_10')"
               :title2="$t('aside.n_9_1')"></title-row>
    <!-- <el-row class="d_tcpde_main">
      <el-form :inline="true"
               :model="qpform"
               class="d_plist_form">
        <el-form-item :label="$t('operating.t_15')">
          <el-input v-model="qpform.name"
                    :size="cSize"
                    :placeholder="$t('comm.pleaseinput')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     :size="cSize"
                     @click="onSubmit">{{$t('header.query')}}</el-button>
        </el-form-item>
      </el-form>
    </el-row> -->
    <el-row class="dtc_action">
      <el-col :span="10"
              class="tc_color_3a8ee6">
        {{pname}}
      </el-col>
      <el-col :span="14"
              style="text-align: right;padding-right:50px;">
        <el-button type="primary"
                   :size="cSize"
                   @click="addProduct('editorall')">{{$t('operating.b_17')}}</el-button>
      </el-col>

    </el-row>
    <el-table v-loading="loading"
              class="d_plist_table"
              :data="entries">

      <el-table-column prop="soft_name"
                       :label="$t('operating.t_15')">
      </el-table-column>
      <el-table-column prop="origin_price"
                       :label="$t('operating.t_67')">
      </el-table-column>
      <el-table-column :label="$t('operating.t_68')">
        <template slot-scope="scope">
          {{scope.row.origin_price * scope.row.rate}}
        </template>
      </el-table-column>
      <el-table-column prop="rate"
                       :label="$t('operating.t_69')">
      </el-table-column>

      <el-table-column :label="$t('comm.action')">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.native.prevent="addProduct('editor',scope.row)">
            {{$t('operating.b_18')}}
          </el-button>

        </template>
      </el-table-column>

    </el-table>
    <el-row class="dtc_action">
      <el-col :span="24"
              class="dtc_pa">
        <el-pagination background
                       class="d_plist_pagination"
                       layout="prev, pager, next"
                       :page-size="pagination.page_size"
                       :current-page="pagination.page"
                       :total="listcount"
                       @current-change="handleCurrentChange">
        </el-pagination>
      </el-col>
    </el-row>

    <el-dialog :title="dtitle"
               width="400px"
               :visible.sync="dialogFormVisible">
      <el-form :model="priceForm">
        <el-form-item :label="$t('operating.t_67')">
          <el-input-number v-model="priceForm.original_price"
                           :size="cSize"
                           step-strictly
                           :precision="2"
                           style="width:250px;"
                           controls-position="right"
                           :min="1"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('operating.t_69')">
          <el-input-number v-model="priceForm.discount"
                           :size="cSize"
                           step-strictly
                           :precision="2"
                           :step="0.1"
                           :max="1"
                           style="width:250px;"
                           controls-position="right"
                           :min="0.1">
          </el-input-number>（%）
        </el-form-item>
        <el-form-item :label="$t('operating.t_68')">
          {{getPresentPrice}}
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="overwriteSoftPriceClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import TitleRow from '@/components/home/title-row'
// import PpSelect from '@/components/home/pp-select'
import { getSessionCache } from '@/utils/dom/dom'
const getProductPricingById = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getProductPricingById', params).then(res => {
      resolve(res)
    })
  })
}
const _pageSize = 10;
export default {
  scrollToTop: true,
  components: {
    TitleRow,
    // PpSelect,
  },

  head () {
    return {
      title: this.$t('aside.n_9_1'),
      meta: [
        { hid: 'adv custom title', name: 'adv', content: 'adv custom title description' }
      ]
    }
  },
  data () {

    return {
      loading: false,
      qpform: {
        name: '',
      },
      pname: '',
      productid: '',
      merchantid: '',
      origin_price: '',
      rate: '',
      pagination: {
        page_size: _pageSize,
        page: 1,
      },
      listcount: 0,
      originalData: [], // 原始数据，处理前端假分页
      entries: [],
      dialogFormVisible: false,
      dtitle: '',
      priceForm: {
        id: '',
        soft_package_id: '',
        original_price: 1, // 原价
        discount: 0.1, // 折扣
        present_price: 0, // 现价
      },
    }
  },
  computed: {
    getPresentPrice () {
      let _price = 0;
      _price = this.priceForm.original_price * this.priceForm.discount || 0
      return _price;
    },
    ...mapState({
      cSize: state => state.cSize
    })
  },

  created () {

    this.actiongetProductPricingById(1);
    console.log(this.$route.query);
    // this.pname = this.$route.query.name || '';
  },
  methods: {

    addProduct (_type, _info) {
      if (_type === 'editorall') {
        this.dtitle = '批量操作';
        this.dialogFormVisible = true;
        this.priceForm = {
          id: '',
          soft_package_id: '',
          original_price: this.origin_price, // 原价
          discount: this.rate, // 折扣
          present_price: 0, // 现价
        };
      } else if (_type === 'editor') {
        this.dtitle = '改价';
        this.dialogFormVisible = true;
        this.priceForm.original_price = _info.origin_price;
        this.priceForm.discount = _info.rate;
        this.priceForm.id = _info.id;
        this.priceForm.soft_package_id = _info.soft_package_id;
      } else {

      }
    },
    onSubmit () {
      this.actiongetProductPricingById(1);
    },
    handleCurrentChange (val) {
      this.actiongetProductPricingById2(val);
    },
    actiongetProductPricingById2 (_v) {
      // 模拟假分页
      const _list = [];
      this.originalData.map((_item, _idx) => {
        if (_v === 1) {
          _idx < _pageSize && _list.push(_item);
        } else {
          const _n = _v * _pageSize;
          (_idx < _n && _idx + 1 > _n - _pageSize) && _list.push(_item);
        }

      })
      this.entries = _list;
      this.pagination.page = _v;
    },
    actiongetProductPricingById (_v) {
      this.loading = true;
      const _par = {
        'token': getSessionCache("userToken") || '',
        'size': _pageSize,
        'page': _v || 1,
        'sId': this.$route.query.id || '',
      };
      this.qpform.name !== '' && (_par.name = this.qpform.name);
      getProductPricingById(this.$store, _par, this).then(res => {
        this.pname = res.data.product.name;
        this.productid = res.data.product.id;
        this.merchantid = res.data.merchant.id;
        this.origin_price = res.data.origin_price;
        this.rate = res.data.rate;
        // 模拟假分页
        this.originalData = res.data.product.parent.soft;
        const _list = [];
        res.data.product.parent.soft.map((_item, _idx) => {
          _idx < _pageSize && _list.push(_item);
        })
        this.entries = _list;
        this.listcount = res.data.product.parent.soft.length;
        this.pagination.page = _v;
        this.loading = false;
      })
    },

    overwriteSoftPriceClick () {
      if (this.priceForm.id) {

        // 单个
        this.overwriteSoftPriceAction(this.$store, this.priceForm, this).then(res => {
          if (res.code === 0) {
            this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
            this.dialogFormVisible = false;
            this.actiongetProductPricingById(1);
            this.priceForm = {
              id: '',
              soft_package_id: '',
              original_price: 1, // 原价
              discount: 0.1, // 折扣
              present_price: 0, // 现价
            };
          } else {
            this.$message.error(this.$t('comm.tip_4'));
          }

        })
      } else {
        // 批量
        this.addProductPricingAction(this.$store, this.priceForm, this).then(res => {
          if (res.code === 0) {
            this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
            this.dialogFormVisible = false;
            this.actiongetProductPricingById(1);
            this.priceForm = {
              id: '',
              soft_package_id: '',
              original_price: 1, // 原价
              discount: 0.1, // 折扣
              present_price: 0, // 现价
            };
          } else {
            this.$message.error(this.$t('comm.tip_4'));
          }

        })

      }

    },

    addProductPricingAction (store, params, self) {
      const param = {
        'token': getSessionCache("userToken") || '',
        'pid': params.pid || '',
      };

      self.productid !== '' && (param.product_id = self.productid);
      self.merchantid && (param.merchant_id = [self.merchantid]);
      params.original_price !== 0 && (param.origin_price = params.original_price);
      params.discount !== 0 && (param.rate = params.discount);

      return new Promise(resolve => {
        store.dispatch('addProductPricing', param).then(res => {
          resolve(res)
        }).catch(err => {
          this.$message.error(this.$t('comm.unknownEorr') + ":" + err);
        });
      })
    },

    overwriteSoftPriceAction (store, params, self) {

      params.token = getSessionCache("userToken") || '';
      params.sId = self.$route.query.id || '';
      params.soft_package_id = params.soft_package_id || '';
      params.origin_price = params.original_price || 0;
      params.rate = params.discount || 0;
      return new Promise(resolve => {
        store.dispatch('overwriteSoftPrice', params).then(res => {
          resolve(res)
        })
      })
    },

    editMarketingAction (store, params, self) {
      params.token = getSessionCache("userToken") || '';
      params.sId = parseInt(params.id) || '';
      return new Promise(resolve => {
        store.dispatch('editMarketing', params).then(res => {
          resolve(res)
        })
      })
    },



    getAllProductList (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
      }
      return new Promise(resolve => {
        store.dispatch('getAllProductList', param).then(res => {
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
  .dtc_action
    padding 10px
    .dtc_pa
      text-align right
  .d_tcpde_table
    padding 0 10px
  .d_tcpde_pagination
    padding 10px
  .tc_color_3a8ee6
    color #3a8ee6
</style>
