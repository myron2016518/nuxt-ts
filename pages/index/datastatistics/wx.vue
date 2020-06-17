<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_5')"
               :title2="$t('aside.n_5_6')"></title-row>
    <!-- <el-row class="d_tcpde_main">
      <el-form :inline="true"
               :model="qpform"
               class="d_plist_form">
        <el-form-item :label="$t('operating.f_1')">
          <pp-select v-model="qpform.ppid"></pp-select>
        </el-form-item>

        <el-form-item :label="$t('operating.f_2')">
          <adtypes-select v-model="qpform.adid"></adtypes-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     :size="cSize"
                     @click="onSubmit">{{$t('header.query')}}</el-button>
        </el-form-item>
      </el-form>
    </el-row> -->

    <el-table v-loading="loading"
              class="d_plist_table"
              :data="entries">
      <el-table-column prop="ref_date"
                       :label="$t('operating.t_16')">
      </el-table-column>
      <el-table-column prop="new_user_count"
                       :label="$t('operating.t_22')">
      </el-table-column>
      <el-table-column prop="cancel_user_count"
                       :label="$t('operating.t_23')">
      </el-table-column>
      <el-table-column prop="new_count"
                       :label="$t('operating.t_25')">
      </el-table-column>
      <el-table-column prop="wechat_reports_count"
                       :label="$t('operating.t_24')">
      </el-table-column>
      <el-table-column prop="wechat_reports_total_count"
                       :label="$t('operating.t_43')">
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
  </div>

</template>

<script>
import { mapState } from 'vuex'
import TitleRow from '@/components/home/title-row'
// import PpSelect from '@/components/home/pp-select'
// import AdtypesSelect from '@/components/home/adtypes-select'
import { getSessionCache } from '@/utils/dom/dom'
const getDMOfficialAccountList = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getDMOfficialAccountList', params).then(res => {
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
      title: this.$t('aside.n_5_6'),
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
      },
      pagination: {
        page_size: _pageSize,
        page: 1,
      },
      listcount: 0,
      entries: [],
    }
  },
  computed: {
    ...mapState({
      cSize: state => state.cSize
    })
  },
  async asyncData ({ store, params }) {
    const _par = {
      token: getSessionCache("userToken") || '',
      size: _pageSize,
      page: 1
    };
    const _res = await getDMOfficialAccountList(store, _par)
    return {
      entries: _res.data.data,
      listcount: parseInt(_res.data.total)
    }
  },
  methods: {

    onSubmit () {
      this.actiongetDMOfficialAccountList(1);
    },
    handleCurrentChange (val) {
      this.actiongetDMOfficialAccountList(val);
    },
    actiongetDMOfficialAccountList (_v) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        size: _pageSize,
        page: _v || 1,
        platform_id: this.qpform.ppid || '',
        poster_type_id: this.qpform.adid || '',
      };
      (this.qpform.app !== 0 && this.qpform.app) && (_par.app = this.qpform.app);
      getDMOfficialAccountList(this.$store, _par, this).then(res => {
        this.entries = res.data.data;
        this.listcount = parseInt(res.data.total)
        this.pagination.page = _v;
        this.loading = false;
      })
    },
    getDataInfo (_data, _title, _name) {
      let _appid = 0;
      _title === 'thinkdiag' && (_appid = 1);
      _title === 'thinktool' && (_appid = 2);
      const _item = _data.data || [];
      const _find = _item.find(_t => _t.app_id === _appid)
      if (_find) {
        let _count = 0;
        _name === 'count' && (_count = _find.data[_name] || 0);
        if (_name === 'report') {
          const _itemreport = _find.data.report || [];
          const _findreport = _itemreport.find(_t => _t.product_type === _appid);
          _findreport && (_count = _findreport.count);
        }
        return _count;
      } else {
        return 0;
      }
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
