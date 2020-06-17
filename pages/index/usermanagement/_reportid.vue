<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_7_1')"></title-row>

    <el-table v-loading="loading"
              class="d_plist_table"
              :data="entries">
      <el-table-column prop="car_brand"
                       :label="$t('operating.t_32')">
      </el-table-column>
      <el-table-column prop="report_type"
                       :label="$t('operating.t_33')">
      </el-table-column>
      <el-table-column prop="created_at"
                       :label="$t('operating.t_34')">
      </el-table-column>
      <el-table-column prop="vin"
                       :label="$t('operating.t_35')">
      </el-table-column>
      <el-table-column prop="device_sn"
                       :label="$t('operating.f_15')">
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
import { getSessionCache } from '@/utils/dom/dom'
const getUserReportList = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getUserReportList', params).then(res => {
      resolve(res)
    })
  })
}
const _pageSize = 10;
export default {
  scrollToTop: true,
  components: {
    TitleRow,
  },

  head () {
    return {
      title: this.$t('aside.n_7_1'),
      meta: [
        { hid: 'adv custom title', name: 'adv', content: 'adv custom title description' }
      ]
    }
  },
  data () {

    return {
      loading: false,

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
      sId: params.reportid,
      page: 1
    };
    const _res = await getUserReportList(store, _par)
    return {
      entries: _res.data.data,
      listcount: parseInt(_res.data.total)
    }
  },
  methods: {

    handleCurrentChange (val) {
      this.actiongetUserReportList(val);
    },
    actiongetUserReportList (_v) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        size: _pageSize,
        sId: this.$route.params.reportid,
        page: _v || 1,
      };
      getUserReportList(this.$store, _par, this).then(res => {
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
