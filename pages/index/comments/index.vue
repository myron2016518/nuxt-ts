<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_4_1')"></title-row>
    <el-row class="d_tcpde_main">
      <el-form :inline="true"
               class="d_plist_form">
        <el-form-item :label="$t('operating.t_28')">
          <!-- <pp-select v-model="ppid"></pp-select> -->
          <el-select v-model="ptdcode"
                     :placeholder="$t('comm.pleaseselect')"
                     :size="cSize">
            <el-option v-for="item in appSelectList"
                       :key="item.id"
                       :label="item.value"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('operating.t_15')">
          <!-- <el-select v-model="softid"
                     :placeholder="$t('comm.pleaseselect')"
                     :size="cSize">
            <el-option v-for="item in softSelectList"
                       :key="item.soft_package_id"
                       :label="item.soft_package_id"
                       :value="item.soft_package_id">
            </el-option>
          </el-select> -->
          <el-input v-model="softid"
                    :size="cSize"
                    :placeholder="$t('comm.pleaseinput')"></el-input>
        </el-form-item>
        <el-form-item style="margin-right:50px;">
          <el-button type="primary"
                     :size="cSize"
                     @click="onSubmit('select')">{{$t('header.query')}}</el-button>
        </el-form-item>

      </el-form>
    </el-row>

    <el-table v-loading="loading"
              class="d_plist_table"
              :data="entries">
      <el-table-column prop="id"
                       :label="$t('operating.t_1')">
      </el-table-column>
      <el-table-column prop="soft_package_id"
                       :label="$t('operating.t_15')">
      </el-table-column>
      <el-table-column prop="comment"
                       :label="$t('operating.t_14')">
      </el-table-column>
      <el-table-column prop="point"
                       :label="$t('operating.t_13')">
      </el-table-column>
      <el-table-column :label="$t('operating.t_28')">
        <template slot-scope="scope"> {{ appSelectList[scope.row.ptd_code].value || ''  }} </template>
      </el-table-column>
      <el-table-column prop="create_time"
                       :label="$t('operating.t_2')">
        <!-- <template slot-scope="scope"> {{ scope.row.create_time |formatTime('Y-M-D h:m:s') }} </template> -->
      </el-table-column>

      <el-table-column :label="$t('comm.action')">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.native.prevent="addProduct('delete',scope.row)">
            {{$t('comm.delete')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-row class="dtc_action">
      <!-- <el-col :span="4">
        <el-button type="primary"
                   :size="cSize"
                   @click="addProduct('add')">{{$t('aside.n_3_2')}}</el-button>
      </el-col> -->
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
import { getSessionCache } from '@/utils/dom/dom'
const getCommentList = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getCommentList', params).then(res => {
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
  },

  head () {
    return {
      title: this.$t('aside.n_4_1'),
      meta: [
        { hid: 'adv custom title', name: 'adv', content: 'adv custom title description' }
      ]
    }
  },
  data () {

    return {
      loading: false,
      ppid: '0',
      softid: '',
      ptdcode: -1,
      softSelectList: [],
      appSelectList: [],
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
      // productPlatformSelect: state => state.productPlatformSelect,
      country: state => state.country,
      cSize: state => state.cSize
    })
  },
  // watch: {
  //   ppid (val, oldVal) {// 普通的watch监听
  //     console.log("ppid: " + val, oldVal);
  //     const _find = this.productPlatformSelect.find(_tiem => _tiem.id === val);
  //     this.softid = '';
  //     _find && (this.softSelectList = _find.soft);
  //   },

  // },
  async asyncData ({ store, params }) {
    const _par = {
      token: getSessionCache("userToken") || '',
      size: _pageSize,
      page: 1
    };
    const _res = await getCommentList(store, _par)
    return {
      entries: _res.data.data,
      listcount: parseInt(_res.data.total)
    }
  },
  created () {
    if (this.country === 'inland') {
      this.appSelectList = [
        { 'id': -1, 'value': '全部' },
        { 'id': 0, 'value': 'thinkcar' },
        { 'id': 1, 'value': 'thinkdiag' },
        { 'id': 2, 'value': '星卡TT' },
        { 'id': 3, 'value': 'thinkdriver' },
        { 'id': 4, 'value': 'thinkplus' },
        { 'id': 5, 'value': '星卡TD' },
      ];
    } else {
      this.appSelectList = [
        { 'id': -1, 'value': '全部' },
        { 'id': 0, 'value': 'thinkcar' },
        { 'id': 1, 'value': 'thinkdiag' },
        { 'id': 2, 'value': '星卡TT' },
        { 'id': 3, 'value': 'thinkdriver' },
        { 'id': 4, 'value': 'thinkplus' },
        { 'id': 5, 'value': '星卡TD' },
      ];

    }
  },
  methods: {

    addProduct (_type, _info) {
      if (_type === 'add') {
      } else if (_type === 'delete') {
        this.$confirm(this.$t('comm.confDelete'))
          .then(_ => {
            this.deleteCommentAction(this.$store, _info, this).then(res => {
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.actiongetCommentList(this.pagination.page);
              } else {
                this.$message.error(this.$t('comm.tip_4'));
              }

            })
          })
          .catch(_ => { });
      } else if (_type === 'editor') {
      } else if (_type === 'status') {

      } else {

      }
    },

    onSubmit () {
      this.actiongetCommentList(1);
    },
    handleCurrentChange (val) {
      this.actiongetCommentList(val);
    },
    actiongetCommentList (_v) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        size: _pageSize,
        page: _v || 1,
      };
      console.log(this.ptdcode);
      this.ptdcode !== -1 && (_par.ptd_code = this.ptdcode);
      this.softid !== '' && (_par.soft_package_id = this.softid);

      getCommentList(this.$store, _par, this).then(res => {
        this.entries = res.data.data;
        this.listcount = parseInt(res.data.total);
        this.pagination.page = _v;
        this.loading = false;
      })
    },

    deleteCommentAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: params.id || ''
      }
      return new Promise(resolve => {
        store.dispatch('deleteComment', param).then(res => {
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
