<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_2_1')"></title-row>
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
    <el-row class="dtc_action">
      <nuxt-link to="/integral/integralwater">
        <el-button type="primary"
                   :size="cSize">{{$t('aside.n_2_2')}}</el-button>
      </nuxt-link>
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
      <el-table-column prop="user.phone"
                       :label="$t('comm.telephone')">
      </el-table-column>

      <el-table-column prop="user.email"
                       :label="$t('comm.email')">
      </el-table-column>
      <el-table-column prop="sum"
                       :label="$t('operating.t_5')">
      </el-table-column>
      <el-table-column :label="$t('comm.action')">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.native.prevent="changeIntegral(scope.row)">
            {{$t('operating.b_2')}}
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
const getUserCreditList = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getUserCreditList', params).then(res => {
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
      title: this.$t('aside.n_2_1'),
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
    const _res = await getUserCreditList(store, _par)
    return {
      entries: _res.data.data,
      listcount: parseInt(_res.data.total)
    }
  },
  methods: {

    changeIntegral (_info) {

      this.$prompt(this.$t('comm.pleaseinput'), this.$t('comm.tip'), {
        inputPattern: /^-?\d+$/,
        closeOnClickModal: false,
        inputErrorMessage: this.$t('operating.p_3')
      }).then(({ value }) => {

        this.editUserCreditSumAction(this.$store, { 'owner_id': _info.owner_id, 'amount': value }, this).then(res => {
          if (res.code === 0) {
            this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
            this.actiongetUserCreditList(this.pagination.page);
          } else {
            this.$message.error(this.$t('comm.tip_4'));
          }

        })
      }).catch(() => { });

    },

    onSubmit () {
      this.actiongetUserCreditList(1);
    },
    handleCurrentChange (val) {
      this.actiongetUserCreditList(val);
    },
    actiongetUserCreditList (_v) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        size: _pageSize,
        page: _v || 1,
        name: this.qpform.name || '',
      };
      (this.qpform.app !== 0 && this.qpform.app) && (_par.app = this.qpform.app);
      getUserCreditList(this.$store, _par, this).then(res => {
        this.entries = res.data.data;
        this.listcount = parseInt(res.data.total)
        this.pagination.page = _v;
        this.loading = false;
      })
    },

    editUserCreditSumAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: params.owner_id || '',
        amount: Math.abs(params.amount) || 0,
        type: 1,
      }
      parseInt(params.amount) < 0 && (param.type = -1);

      return new Promise(resolve => {
        store.dispatch('editUserCreditSum', param).then(res => {
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
