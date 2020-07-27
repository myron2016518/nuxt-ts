<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_5')"
               :title2="$t('aside.n_5_2')"></title-row>
    <el-row class="d_tcpde_main">
      <el-form :inline="true"
               :model="qpform"
               class="d_plist_form">
        <el-form-item :label="$t('operating.t_16')">
          <el-date-picker v-model="qpform.time"
                          type="daterange"
                          align="right"
                          value-format="yyyy-MM-dd"
                          unlink-panels
                          range-separator="-"
                          :start-placeholder="$t('operating.f_20')"
                          :end-placeholder="$t('operating.f_21')"
                          :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('operating.f_34')">
          <el-select v-model="qpform.tcpid"
                     :placeholder="$t('comm.pleaseselect')"
                     :size="cSize">
            <el-option v-for="item in productList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
                     :size="cSize"
                     @click="onSubmit">{{$t('header.query')}}</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table v-loading="loading"
              class="d_plist_table"
              :data="entries">

      <el-table-column v-for="item in columnList"
                       :key="item.id"
                       :prop="item.value"
                       :label="item.label">
      </el-table-column>

      <!-- <el-table-column prop="created_date"
                       :label="$t('operating.t_11')">
      </el-table-column>
      <el-table-column prop="index_count"
                       :label="$t('comm.home')">
      </el-table-column>
      <el-table-column prop="buy_count"
                       :label="$t('operating.t_39')">
      </el-table-column>
      <el-table-column prop="pay_count"
                       :label="$t('operating.t_40')">
      </el-table-column>
      <el-table-column prop="diag_count"
                       :label="$t('operating.t_41')">
      </el-table-column>
      <el-table-column prop="thinkcar_count"
                       :label="$t('operating.t_42')">
      </el-table-column> -->

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
  </div>

</template>

<script>
import { mapState } from 'vuex'
import TitleRow from '@/components/home/title-row'
// import PpSelect from '@/components/home/pp-select'
// import AdtypesSelect from '@/components/home/adtypes-select'
import { getSessionCache } from '@/utils/dom/dom'
const getOfficialPvList = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getOfficialPvList', params).then(res => {
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
    // AdtypesSelect
  },

  head () {
    return {
      title: this.$t('aside.n_5_2'),
      meta: [
        { hid: 'adv custom title', name: 'adv', content: 'adv custom title description' }
      ]
    }
  },
  data () {

    return {
      loading: false,
      qpform: {
        ppid: '',
        adid: '',
        tcpid: '',
        time: '',
      },
      searchtcIp: '',
      pagination: {
        page_size: _pageSize,
        page: 1,
      },
      tcProductList: [
        { 'id': 'tcp1', 'name': '星卡TT' },
        { 'id': 'tcp2', 'name': '星卡TD' },
      ],
      listcount: 0,
      entries: [],
      columnList: [],
      pickerOptions: {
        shortcuts: [{
          text: this.$t('operating.f_30'),
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('operating.f_31'),
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('operating.f_32'),
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  computed: {
    ...mapState({
      cSize: state => state.cSize,
      country: state => state.country,
      productList: state => state.productList,
    })
  },
  async asyncData ({ store, params }) {
    const _par = {
      token: getSessionCache("userToken") || '',
      size: _pageSize,
      page: 1,
      path: 'product/1',
    };
    const _res = await getOfficialPvList(store, _par)
    return {
      entries: _res.data.data,
      listcount: parseInt(_res.data.total)
    }
  },
  created () {
    this.qpform.tcpid = this.productList[0].id || "1";
    if (this.country === 'inland') {
      this.columnList = [
        { 'id': 'foreign1', 'value': 'create_date', 'label': this.$t('operating.t_11') },
        { 'id': 'foreign2', 'value': 'banner_count', 'label': this.$t('operating.t_51') },
        { 'id': 'foreign3', 'value': 'index_count', 'label': this.$t('operating.t_52') },
        { 'id': 'foreign4', 'value': 'product_count', 'label': this.$t('operating.t_53') },
        { 'id': 'foreign5', 'value': 'pay_count', 'label': this.$t('operating.t_54') },
        { 'id': 'foreign6', 'value': 'xixnyongka_count', 'label': this.$t('operating.t_55') },
      ];
    } else {
      this.columnList = [
        { 'id': 'foreign1', 'value': 'create_date', 'label': this.$t('operating.t_11') },
        { 'id': 'foreign2', 'value': 'index_count', 'label': this.$t('comm.home') },
        { 'id': 'foreign7', 'value': 'index_banner_count', 'label': "首页广告" },
        { 'id': 'foreign6', 'value': 'product_count', 'label': this.$t('operating.t_53') },
        { 'id': 'foreign3', 'value': 'buy_count', 'label': this.$t('operating.t_39') },
        { 'id': 'foreign4', 'value': 'pay_count', 'label': this.$t('operating.t_40') },
        { 'id': 'foreign5', 'value': 'pay_info_count', 'label': "购买" },
      ];

    }
  },
  methods: {

    onSubmit () {
      // this.qpform.tcpid && (this.searchtcIp = this.qpform.tcpid || '');
      this.actiongetOfficialPvList(1);
    },
    handleCurrentChange (val) {
      this.actiongetOfficialPvList(val);
    },
    actiongetOfficialPvList (_v) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        size: _pageSize,
        page: _v || 1,
        path: "product/" + this.qpform.tcpid,
        // platform_id: this.qpform.ppid || '',
        // poster_type_id: this.qpform.adid || '',
      };
      if (this.qpform.time) {
        _par.start_time = this.qpform.time[0];
        _par.end_time = this.qpform.time[1];
      }
      // this.qpform.tcpid === 'tcp1' && (_par.path = 'product/5');

      // (this.qpform.app !== 0 && this.qpform.app) && (_par.app = this.qpform.app);
      getOfficialPvList(this.$store, _par, this).then(res => {
        this.entries = res.data.data;
        this.listcount = parseInt(res.data.total)
        this.pagination.page = _v;
        this.loading = false;
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
</style>
