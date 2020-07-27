<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_5')"
               :title2="$t('aside.n_5_7')"></title-row>
    <el-row class="d_tcpde_main">
      <el-radio-group v-model="radioTxt"
                      :size="cSize"
                      @change="tableTypeChange">
        <el-radio-button label="comment_count">{{$t('operating.t_29')}}</el-radio-button>
        <el-radio-button label="report_count">{{$t('operating.t_30')}}</el-radio-button>
        <el-radio-button label="order_total_amount">支付总额</el-radio-button>
      </el-radio-group>
    </el-row>

    <el-table v-loading="loading"
              class="d_plist_table"
              stripe
              :data="entries">
      <el-table-column prop="user.name"
                       :label="$t('operating.f_5')">
      </el-table-column>
      <el-table-column prop="user.email"
                       label="用户邮箱">
      </el-table-column>

      <el-table-column prop="user.created_at"
                       label="创建时间">
      </el-table-column>

      <!-- <el-table-column prop="user.phone"
                       label="电话号码">
      </el-table-column> -->
      <el-table-column :label="getTypeName()">
        <template slot-scope="scope">
          {{radioTxt==='comment_count' ? scope.row.count:''}}
          {{radioTxt==='order_total_amount' ? "$"+scope.row.count:''}}
          <el-button v-if="radioTxt==='report_count'"
                     type="text"
                     @click.native.prevent="goReportList(scope.row.user_id)">
            {{scope.row.count}}
          </el-button>
        </template>
      </el-table-column>

      <!-- <el-table-column v-if="radioTxt==='comment_count'"
                       prop="count"
                       :label="$t('operating.t_29')">
      </el-table-column>
      <el-table-column v-if="radioTxt==='report_count'"
                       :label="$t('operating.t_30')"
                       prop="count">
        <template slot-scope="scope">
          <el-button type="text"
                     @click.native.prevent="goReportList(scope.row.user_id)">
            {{scope.row.count}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="radioTxt==='order_total_amount'"
                       label="支付总额">
        <template slot-scope="scope"> ${{scope.row.count}} </template>
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
    store.dispatch(params.url, params).then(res => {
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
      title: this.$t('aside.n_5_7'),
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
      radioTxt: 'comment_count',
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
      url: 'getcommentCountList',
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
    tableTypeChange (_t) {
      this.actiongetUserList(1, this.actiontype);
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
        url: 'getcommentCountList',
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
      this.radioTxt === "report_count" && (_par.url = "getreportCountList");
      this.radioTxt === "order_total_amount" && (_par.url = "getorderCountList");
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
    getTypeName () {
      let _txt = this.$t('operating.t_29');
      this.radioTxt === "report_count" && (_txt = this.$t('operating.t_30'));
      this.radioTxt === "order_total_amount" && (_txt = "支付总额");
      return _txt || "";
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
