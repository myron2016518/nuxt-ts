<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_6')"></title-row>
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
      <el-table-column prop="id"
                       :label="$t('operating.t_45')">
      </el-table-column>
      <el-table-column prop="name"
                       :label="$t('operating.t_46')">
      </el-table-column>
      <el-table-column prop="content"
                       :label="$t('operating.t_47')">
      </el-table-column>

      <el-table-column prop="created_at"
                       :label="$t('operating.t_48')">
      </el-table-column>
      <el-table-column prop="rcontent"
                       :label="$t('operating.t_49')">
      </el-table-column>
      <el-table-column prop="rtime"
                       :label="$t('operating.t_50')">
      </el-table-column>
      <el-table-column :label="$t('comm.action')">
        <template slot-scope="scope">
          <el-button :type="scope.row.status==='0'? 'danger':'primary'"
                     size="small"
                     @click.native.prevent="changeIntegral(scope.row)">
            {{scope.row.status==='0'?  $t('operating.b_10') : $t('operating.b_11')}}
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
  </div>

</template>

<script>
import { mapState } from 'vuex'
import TitleRow from '@/components/home/title-row'
import { getSessionCache } from '@/utils/dom/dom'
const getFeedBackApp = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getFeedBackApp', params).then(res => {
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
      title: this.$t('aside.n_6'),
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
      page_size: _pageSize,
      page: 1
    };
    const _res = await getFeedBackApp(store, _par)
    return {
      entries: _res.data.list,
      listcount: parseInt(_res.data.count)
    }
  },
  methods: {

    changeIntegral (_info) {
      if (_info.status === '1') return;

      this.$prompt('', this.$t('operating.f_19'), {
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        closeOnClickModal: false,
        inputType: "textarea",
        inputErrorMessage: this.$t('operating.p_5')
      }).then(({ value }) => {

        this.ajaxAppReplyAction(this.$store, { 'id': _info.id, 'rcontent': value }, this).then(res => {
          if (res.code === 0) {
            this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
            this.actiongetFeedBackApp(this.pagination.page);
          } else {
            this.$message.error(this.$t('comm.tip_4'));
          }

        })
      }).catch(() => { });

    },

    onSubmit () {
      this.actiongetFeedBackApp(1);
    },
    handleCurrentChange (val) {
      this.actiongetFeedBackApp(val);
    },
    actiongetFeedBackApp (_v) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        page_size: _pageSize,
        page: _v || 1,
        key: this.qpform.name || '',
      };
      (this.qpform.app !== 0 && this.qpform.app) && (_par.app = this.qpform.app);
      getFeedBackApp(this.$store, _par, this).then(res => {
        this.entries = res.data.list;
        this.listcount = parseInt(res.data.count);
        this.pagination.page = _v;
        this.loading = false;
      })
    },

    ajaxAppReplyAction (store, params, self) {
      const _pa = {
        // token: getSessionCache("userToken") || '',
        id: params.id || '',
        rcontent: params.rcontent || '',
        sign: 'xkkjreply'
      }
      // const param = deepObjectMerge(_pa, { sign: getSign(_pa).toUpperCase() });
      return new Promise(resolve => {
        store.dispatch('ajaxAppReply', _pa).then(res => {
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
</style>
