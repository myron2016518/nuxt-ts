<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_5')"
               :title2="$t('aside.n_5_4')"></title-row>
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
      <el-table-column prop="date"
                       :label="$t('operating.t_16')">
      </el-table-column>
      <el-table-column :label="tableTitle.thinkcar"
                       align="center">
        <!-- <el-table-column :label="$t('operating.t_20')" >
          <template slot-scope="scope"> {{ getDataInfo(scope.row,'thinkcar','think_device_active_count')   }} </template>
        </el-table-column>
        <el-table-column :label="$t('operating.t_21')">
          <template slot-scope="scope"> {{ getDataInfo(scope.row,'thinkcar','report_record_count')   }} </template>
        </el-table-column> -->
        <el-table-column prop="tc_a"
                         :label="$t('operating.t_20')"> </el-table-column>
        <el-table-column prop="tc_r"
                         :label="$t('operating.t_21')"> </el-table-column>
      </el-table-column>
      <el-table-column :label="tableTitle.thinkdiag"
                       align="center">
        <!-- <el-table-column :label="$t('operating.t_20')">
          <template slot-scope="scope"> {{ getDataInfo(scope.row,'thinkdiag','think_device_active_count')   }} </template>
        </el-table-column>
        <el-table-column :label="$t('operating.t_21')">
          <template slot-scope="scope"> {{ getDataInfo(scope.row,'thinkdiag','report_record_count')   }} </template>
        </el-table-column> -->
        <el-table-column prop="td_a"
                         :label="$t('operating.t_20')"> </el-table-column>
        <el-table-column prop="td_r"
                         :label="$t('operating.t_21')"> </el-table-column>
      </el-table-column>
      <el-table-column :label="tableTitle.thinkdiag_mini"
                       align="center">
        <!-- <el-table-column :label="$t('operating.t_20')">
          <template slot-scope="scope"> {{ getDataInfo(scope.row,'thinkdiag_mini','think_device_active_count')   }} </template>
        </el-table-column>
        <el-table-column :label="$t('operating.t_21')">
          <template slot-scope="scope"> {{ getDataInfo(scope.row,'thinkdiag_mini','report_record_count')   }} </template>
        </el-table-column> -->
        <el-table-column prop="tdm_a"
                         :label="$t('operating.t_20')"> </el-table-column>
        <el-table-column prop="tdm_r"
                         :label="$t('operating.t_21')"> </el-table-column>
      </el-table-column>
      <el-table-column :label="tableTitle.thinktool"
                       align="center">
        <!-- <el-table-column :label="$t('operating.t_20')">
          <template slot-scope="scope"> {{ getDataInfo(scope.row,'thinktool','think_device_active_count')   }} </template>
        </el-table-column>
        <el-table-column :label="$t('operating.t_21')">
          <template slot-scope="scope"> {{ getDataInfo(scope.row,'thinktool','report_record_count')   }} </template>
        </el-table-column> -->
        <el-table-column prop="tt_a"
                         :label="$t('operating.t_20')"> </el-table-column>
        <el-table-column prop="tt_r"
                         :label="$t('operating.t_21')"> </el-table-column>
      </el-table-column>
      <el-table-column :label="tableTitle.thinktool_mini"
                       align="center">
        <!-- <el-table-column :label="$t('operating.t_20')">
          <template slot-scope="scope"> {{ getDataInfo(scope.row,'thinktool_mini','think_device_active_count')   }} </template>
        </el-table-column>
        <el-table-column :label="$t('operating.t_21')">
          <template slot-scope="scope"> {{ getDataInfo(scope.row,'thinktool_mini','report_record_count')   }} </template>
        </el-table-column> -->
        <el-table-column prop="ttm_a"
                         :label="$t('operating.t_20')"> </el-table-column>
        <el-table-column prop="ttm_r"
                         :label="$t('operating.t_21')"> </el-table-column>
      </el-table-column>
      <el-table-column :label="tableTitle.thinkdriver"
                       align="center">
        <!-- <el-table-column :label="$t('operating.t_20')">
          <template slot-scope="scope"> {{ getDataInfo(scope.row,'thinkdriver','think_device_active_count')   }} </template>
        </el-table-column>
        <el-table-column :label="$t('operating.t_21')">
          <template slot-scope="scope"> {{ getDataInfo(scope.row,'thinkdriver','report_record_count')   }} </template>
        </el-table-column> -->
        <el-table-column prop="tdv_a"
                         :label="$t('operating.t_20')"> </el-table-column>
        <el-table-column prop="tdv_r"
                         :label="$t('operating.t_21')"> </el-table-column>
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
const getDataManageDeviceList = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getDataManageDeviceList', params).then(res => {
      resolve(res)
    })
  })
};
const getInitialData = (_data) => {
  const _nd = [];
  _data.map((_i, _x) => {
    const _d = {
      "date": _i.date || "--", "tc_a": 0, "tc_r": 0, "td_a": 0, "td_r": 0, "tdm_a": 0, "tdm_r": 0,
      "tt_a": 0, "tt_r": 0, "ttm_a": 0, "ttm_r": 0, "tdv_a": 0, "tdv_r": 0,
    };
    _i.apps.map((_i2, _x2) => {
      const _fa = _i2.type.find((_fi, _fx) => _fi.name.indexOf("DiagActiveRecord") !== -1);
      const _fr = _i2.type.find((_fi, _fx) => _fi.name.indexOf("ReportRecord") !== -1);
      switch (_i2.id) {
        case 1:
          _d.tc_a = _fa.count || 0;
          _d.tc_a = _fr.count || 0;
          break;
        case 3:
          _d.td_a = _fa.count || 0;
          _d.td_r = _fr.count || 0;
          break;
        case 5:
          _d.tt_a = _fa.count || 0;
          _d.tt_r = _fr.count || 0;
          break;
        case 6:
          _d.tdv_a = _fa.count || 0;
          _d.tdv_r = _fr.count || 0;
          break;
        case 7:
          _d.tdm_a = _fa.count || 0;
          _d.tdm_r = _fr.count || 0;
          break;
        case 8:
          _d.ttm_a = _fa.count || 0;
          _d.ttm_r = _fr.count || 0;
          break;
        default:
          break;
      }
    })
    _nd.push(_d);
  })
  return _nd;
};
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
      title: this.$t('aside.n_5_4'),
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
    const _res = await getDataManageDeviceList(store, _par)
    return {
      entries: getInitialData(_res.data.data),
      listcount: parseInt(_res.data.total)
    }
  },
  created () {
    if (this.country === 'inland') {
      this.tableTitle.thinkcar = 'ThinkCar';
      this.tableTitle.thinkdiag = '星卡TD';
      this.tableTitle.thinktool = '星卡TT';
    }
  },
  methods: {

    onSubmit () {
      this.actiongetDataManageDeviceList(1);
    },
    handleCurrentChange (val) {
      this.actiongetDataManageDeviceList(val);
    },
    actiongetDataManageDeviceList (_v) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        size: _pageSize,
        page: _v || 1,
        // platform_id: this.qpform.ppid || '',
        // poster_type_id: this.qpform.adid || '',
      };
      if (this.qpform.time) {
        _par.start_time = this.qpform.time[0];
        _par.end_time = this.qpform.time[1];
      }
      // (this.qpform.app !== 0 && this.qpform.app) && (_par.app = this.qpform.app);
      getDataManageDeviceList(this.$store, _par, this).then(res => {
        this.entries = getInitialData(res.data.data);
        this.listcount = parseInt(res.data.total)
        this.pagination.page = _v;
        this.loading = false;
      })
    },

    getDataInfo (_data, _title, _name) {
      let _appid = 1;
      _title === 'thinkdiag' && (_appid = 2);
      _title === 'thinktool' && (_appid = 4);
      const _item = _data.products || [];
      const _find = _item.find(_t => _t.id === _appid)
      if (_find) {
        return _find[_name] || 0;
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
