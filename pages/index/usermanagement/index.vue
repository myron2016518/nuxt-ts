<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_7')"></title-row>
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
                     @click="onSubmit('username')">{{$t('header.query')}}</el-button>
        </el-form-item>
        <el-form-item :label="$t('operating.f_14')">
          <el-input v-model="qpform.emailandtel"
                    :size="cSize"
                    :placeholder="$t('comm.pleaseinput')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     :size="cSize"
                     @click="onSubmit('emailandtel')">{{$t('header.query')}}</el-button>
        </el-form-item>
        <el-form-item :label="$t('operating.f_15')">
          <el-input v-model="qpform.sn"
                    :size="cSize"
                    :placeholder="$t('comm.pleaseinput')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     :size="cSize"
                     @click="onSubmit('sn')">{{$t('header.query')}}</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table v-loading="loading"
              class="d_plist_table"
              stripe
              :data="entries">
      <el-table-column prop="id"
                       :label="$t('operating.t_1')">
      </el-table-column>
      <el-table-column prop="email"
                       :label="$t('operating.f_14')">
      </el-table-column>
      <el-table-column prop="user_name"
                       :label="$t('operating.f_5')">
      </el-table-column>
      <el-table-column label="SN">
        <template slot-scope="scope">
          <p v-for="s in scope.row.order"
             :key="s.id">{{s.device_sn}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="create_time"
                       :label="$t('operating.t_26')">
      </el-table-column>
      <el-table-column prop="area"
                       :label="$t('operating.t_27')">
      </el-table-column>

      <el-table-column :label="$t('comm.details')">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.native.prevent="showDetilsList(scope.row)">
            {{$t('operating.b_4')}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="app_label"
                       :label="$t('operating.t_28')">
      </el-table-column>
      <el-table-column prop="phone_model"
                       :label="$t('operating.t_31')">
      </el-table-column>
      <el-table-column prop="comment_count"
                       :label="$t('operating.t_29')">
      </el-table-column>
      <el-table-column :label="$t('operating.t_30')"
                       prop="report_count">
        <template slot-scope="scope">
          <el-button type="text"
                     @click.native.prevent="goReportList(scope.row.user_id)">
            {{scope.row.report_count}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="支付总额">
        <template slot-scope="scope"> ${{scope.row.order_total_amount}} </template>
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

    <el-dialog title=""
               :visible.sync="dialogFormVisible">

      <el-table border
                :data="decorderJson">
        <el-table-column prop="order_no"
                         :label="$t('operating.t_36')">
        </el-table-column>
        <el-table-column prop="vin"
                         label="VIN">
        </el-table-column>
        <el-table-column prop="car_make"
                         :label="$t('operating.t_37')">
        </el-table-column>
        <el-table-column :label="$t('operating.t_38')">
          <template slot-scope="scope"> {{ scope.row.expiration_end |formatTime('Y-M-D h:m:s') }} </template>
        </el-table-column>
        <el-table-column prop="device_sn"
                         :label="$t('operating.f_15')">
        </el-table-column>
        <el-table-column prop="pay_price"
                         label="支付金额">
          <template slot-scope="scope"> ${{scope.row.pay_price}} </template>
        </el-table-column>

      </el-table>
    </el-dialog>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import TitleRow from '@/components/home/title-row'
import { getSessionCache } from '@/utils/dom/dom'
const getUserList = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getUserList', params).then(res => {
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
      title: this.$t('aside.n_7'),
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
        emailandtel: '',
        sn: '',
      },
      pagination: {
        page_size: _pageSize,
        page: 1,
      },
      listcount: 0,
      entries: [],
      actiontype: '',
      dialogFormVisible: false,
      orderName: '', // 排序查询字段
      orderType: '', // 排序类型 desc ，asce
      decorderJson: [],
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
    const _res = await getUserList(store, _par)
    return {
      entries: _res.data.data,
      listcount: parseInt(_res.data.total)
    }
  },
  methods: {

    // 查看详情
    showDetilsList (_info) {
      this.dialogFormVisible = true;
      this.decorderJson = _info.order || [];
    },
    // 报告数量
    goReportList (_userid) {
      this.$router.push("/usermanagement/" + _userid);
    },
    // 排序
    sortChange (_c, _p, _o) {
      console.log(_c, _p, _o);

      if (_c.order) {
        this.orderName = _c.prop || "";
        this.orderType = _c.order === "descending" ? "desc" : "asc";
      } else {
        this.orderName = "";
        this.orderType = "";
      }
      this.actiongetUserList(1, this.actiontype);
    },

    onSubmit (_type) {
      this.actiontype = _type;
      this.actiongetUserList(1, _type);
    },
    handleCurrentChange (val) {
      this.actiongetUserList(val, this.actiontype);
    },
    actiongetUserList (_v, _type) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        size: _pageSize,
        page: _v || 1,
      };
      if (_type) {
        if (_type === 'username') {
          this.qpform.name !== '' && (_par.username = this.qpform.name || '');
        } else if (_type === 'emailandtel') {
          this.qpform.emailandtel !== '' && (_par.email = this.qpform.emailandtel || '');
        } else if (_type === 'sn') {
          this.qpform.sn !== '' && (_par.device_sn = this.qpform.sn || '');
        }
      }

      console.log('===this.orderName===', this.orderName);

      if (this.orderName) {
        _par.order = this.orderType || '';
        _par.order_column = this.orderName || '';
      }

      getUserList(this.$store, _par, this).then(res => {
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
