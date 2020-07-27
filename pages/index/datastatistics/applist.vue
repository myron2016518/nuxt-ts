<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_5')"
               :title2="$t('aside.n_5_1')"></title-row>
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
      <el-table-column prop="ymd"
                       fixed
                       width="150"
                       :label="$t('operating.t_16')">
      </el-table-column>
      <el-table-column :label="tableTitle.thinkcar"
                       align="center">
        <el-table-column prop="apps.0.total_user_count"
                         :label="$t('operating.t_17')"> </el-table-column>
        <el-table-column prop="apps.0.count"
                         :label="$t('operating.t_21')"> </el-table-column>
        <el-table-column prop="apps.0.day_live"
                         label="日活量"> </el-table-column>
        <el-table-column prop="apps.0.week_live"
                         label="周活量"> </el-table-column>
        <el-table-column prop="apps.0.month_live"
                         label="月活量"> </el-table-column>
      </el-table-column>

      <el-table-column :label="tableTitle.thinkdiag"
                       align="center">
        <el-table-column prop="apps.1.total_user_count"
                         :label="$t('operating.t_17')"> </el-table-column>
        <el-table-column prop="apps.1.count"
                         :label="$t('operating.t_21')"> </el-table-column>
        <el-table-column prop="apps.1.day_live"
                         label="日活量"> </el-table-column>
        <el-table-column prop="apps.1.week_live"
                         label="周活量"> </el-table-column>
        <el-table-column prop="apps.1.month_live"
                         label="月活量"> </el-table-column>
      </el-table-column>

      <el-table-column :label="tableTitle.thinkdiag_mini"
                       align="center">
        <el-table-column prop="apps.5.total_user_count"
                         :label="$t('operating.t_17')"> </el-table-column>
        <el-table-column prop="apps.5.count"
                         :label="$t('operating.t_21')"> </el-table-column>
        <el-table-column prop="apps.5.day_live"
                         label="日活量"> </el-table-column>
        <el-table-column prop="apps.5.week_live"
                         label="周活量"> </el-table-column>
        <el-table-column prop="apps.5.month_live"
                         label="月活量"> </el-table-column>
      </el-table-column>

      <el-table-column :label="tableTitle.thinktool"
                       align="center">
        <el-table-column prop="apps.2.total_user_count"
                         :label="$t('operating.t_17')"> </el-table-column>
        <el-table-column prop="apps.2.count"
                         :label="$t('operating.t_21')"> </el-table-column>
        <el-table-column prop="apps.2.day_live"
                         label="日活量"> </el-table-column>
        <el-table-column prop="apps.2.week_live"
                         label="周活量"> </el-table-column>
        <el-table-column prop="apps.2.month_live"
                         label="月活量"> </el-table-column>
      </el-table-column>

      <el-table-column :label="tableTitle.thinktool_mini"
                       align="center">
        <el-table-column prop="apps.15.total_user_count"
                         :label="$t('operating.t_17')"> </el-table-column>
        <el-table-column prop="apps.15.count"
                         :label="$t('operating.t_21')"> </el-table-column>
        <el-table-column prop="apps.15.day_live"
                         label="日活量"> </el-table-column>
        <el-table-column prop="apps.15.week_live"
                         label="周活量"> </el-table-column>
        <el-table-column prop="apps.15.month_live"
                         label="月活量"> </el-table-column>
      </el-table-column>

      <el-table-column :label="tableTitle.thinkdriver"
                       align="center">
        <el-table-column prop="apps.3.total_user_count"
                         :label="$t('operating.t_17')"> </el-table-column>
        <el-table-column prop="apps.3.count"
                         :label="$t('operating.t_21')"> </el-table-column>
        <el-table-column prop="apps.3.day_live"
                         label="日活量"> </el-table-column>
        <el-table-column prop="apps.3.week_live"
                         label="周活量"> </el-table-column>
        <el-table-column prop="apps.3.month_live"
                         label="月活量"> </el-table-column>
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
const getDataManageAppList = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getDataManageAppList', params).then(res => {
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
      title: this.$t('aside.n_5_1'),
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
        time: '',
      },
      pagination: {
        page_size: _pageSize,
        page: 1,
      },
      listcount: 0,
      entries: [],
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
      tableTitle: {
        thinkcar: 'ThinkCar',
        thinkdiag: 'ThinkDiag',
        thinkdiag_mini: 'ThinkDiag Mini',
        thinktool: 'ThinkTool',
        thinktool_mini: 'ThinkTool Mini',
        thinkdriver: 'ThinkDriver',
      },
    }
  },
  computed: {
    ...mapState({
      cSize: state => state.cSize,
      country: state => state.country,
    })
  },
  async asyncData ({ store, params }) {
    const _par = {
      token: getSessionCache("userToken") || '',
      size: _pageSize,
      page: 1
    };
    const _res = await getDataManageAppList(store, _par)
    return {
      entries: _res.data.data,
      listcount: parseInt(_res.data.total)
    }
  },

  created () {
    if (this.country === 'inland') {
      this.tableTitle.thinkcar = '星卡TC';
      this.tableTitle.thinkdiag = '星卡TD';
      this.tableTitle.thinktool = '星卡TT';
    }
  },
  methods: {

    onSubmit () {
      this.actiongetDataManageAppList(1);
    },
    handleCurrentChange (val) {
      this.actiongetDataManageAppList(val);
    },
    actiongetDataManageAppList (_v) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        size: _pageSize,
        page: _v || 1,
      };

      if (this.qpform.time) {
        _par.start_time = this.qpform.time[0];
        _par.end_time = this.qpform.time[1];
      }
      // (this.qpform.time !== 0 && this.qpform.app) && (_par.app = this.qpform.app);
      getDataManageAppList(this.$store, _par, this).then(res => {
        this.entries = res.data.data;
        this.listcount = parseInt(res.data.total)
        this.pagination.page = _v;
        this.loading = false;
      })
    },
    getDataInfo (_data, _title, _name) {
      // console.log(_data, _title, _name);
      let _appid = 0;
      _title === 'thinkdiag' && (_appid = 1);
      _title === 'thinktool' && (_appid = 2);
      const _item = _data.data || [];
      const _find = _item.find(_t => _t.app_id === _appid)
      if (_find) {
        return _find.data[_name] || 0;
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
