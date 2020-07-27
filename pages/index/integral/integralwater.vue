<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_2')"
               :title2="$t('aside.n_2_2')"></title-row>
    <el-row class="d_tcpde_main">
      <el-form :inline="true"
               :model="qpform"
               class="d_plist_form">
        <el-form-item :label="$t('operating.f_5')">
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

    <el-table v-loading="loading"
              class="d_plist_table"
              :data="entries">
      <el-table-column prop="owner_id"
                       :label="$t('operating.t_4')">
      </el-table-column>
      <el-table-column prop="user.name"
                       :label="$t('operating.f_5')">
      </el-table-column>
      <el-table-column prop="amount"
                       :label="$t('operating.t_5')">
      </el-table-column>
      <el-table-column prop="body"
                       :label="$t('operating.t_6')">
      </el-table-column>
      <el-table-column prop="type_label"
                       :label="$t('comm.type')">
      </el-table-column>
      <el-table-column prop="updated_at"
                       :label="$t('comm.time')">
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
const getUserCreditRecordList = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getUserCreditRecordList', params).then(res => {
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
      title: this.$t('aside.n_2_2'),
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
    const _res = await getUserCreditRecordList(store, _par)
    return {
      entries: _res.data.data,
      listcount: parseInt(_res.data.total)
    }
  },
  methods: {

    onSubmit () {
      this.actiongetUserCreditRecordList(1);
    },
    handleCurrentChange (val) {
      this.actiongetUserCreditRecordList(val);
    },
    actiongetUserCreditRecordList (_v) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        size: _pageSize,
        page: _v || 1,
        name: this.qpform.name || '',
      };
      (this.qpform.app !== 0 && this.qpform.app) && (_par.app = this.qpform.app);
      getUserCreditRecordList(this.$store, _par, this).then(res => {
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
