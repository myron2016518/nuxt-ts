<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_9')"
               :title2="$t('aside.n_9_1')"></title-row>
    <el-row class="d_tcpde_main">
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
    </el-row>
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

      <el-table-column prop="name"
                       :label="$t('operating.t_15')">
      </el-table-column>
      <el-table-column prop="name"
                       :label="$t('operating.t_67')">
      </el-table-column>
      <el-table-column prop="trial_description"
                       :label="$t('operating.t_68')">
      </el-table-column>
      <el-table-column prop="trial_description"
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
                           style="width:250px;"
                           controls-position="right"
                           :min="1"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('operating.t_69')">
          <el-input-number v-model="priceForm.discount"
                           :size="cSize"
                           step-strictly
                           style="width:250px;"
                           controls-position="right"
                           :min="1">
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
                   @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import TitleRow from '@/components/home/title-row'
// import PpSelect from '@/components/home/pp-select'
import { getSessionCache } from '@/utils/dom/dom'
const getMarketingList = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getMarketingList', params).then(res => {
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
      pagination: {
        page_size: _pageSize,
        page: 1,
      },
      listcount: 0,
      entries: [],
      dialogFormVisible: false,
      dtitle: '',
      priceForm: {
        original_price: '', // 原价
        discount: '', // 折扣
        present_price: '', // 现价
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
      snppSelect: state => state.snppSelect,
      cSize: state => state.cSize
    })
  },
  async asyncData ({ store, params }) {
    const _par = {
      token: getSessionCache("userToken") || '',
      size: _pageSize,
      page: 1
    };
    const _res = await getMarketingList(store, _par)
    return {
      entries: _res.data.data,
      listcount: parseInt(_res.data.total)
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
    console.log(this.$route.query);
    this.pname = this.$route.query.name || '';
  },
  methods: {

    addProduct (_type, _info) {
      if (_type === 'editorall') {
        this.dtitle = '批量操作';
        this.dialogFormVisible = true;
      } else if (_type === 'editor') {
        this.dtitle = '改价';
        this.dialogFormVisible = true;
      } else {

      }
    },
    onSubmit () {
      this.actiongetMarketingList(1);
    },
    handleCurrentChange (val) {
      this.actiongetMarketingList(val);
    },
    actiongetMarketingList (_v) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        size: _pageSize,
        page: _v || 1,
      };
      this.qpform.name !== '' && (_par.name = this.qpform.name);
      getMarketingList(this.$store, _par, this).then(res => {
        this.entries = res.data.data;
        this.listcount = parseInt(res.data.total);
        this.pagination.page = _v;
        this.loading = false;
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
    getPidData (_id) {
      let _txt = '';
      const _find = this.snppSelect.find(_item => _item.id === _id);
      _find && (_txt = _find.name);
      return _txt;
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
