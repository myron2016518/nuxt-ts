<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_8')"></title-row>
    <el-row class="d_tcpde_main">
      <el-form :inline="true"
               :model="qpform"
               class="d_plist_form">
        <el-form-item :label="$t('operating.f_1')">
          <pp-select v-model="qpform.ppid"></pp-select>
        </el-form-item>

        <el-form-item :label="$t('operating.f_16')">
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
      <el-button type="primary"
                 :size="cSize"
                 @click="addProduct('add')">{{$t('operating.b_5')}}</el-button>

    </el-row>
    <el-table v-loading="loading"
              class="d_plist_table"
              :data="entries">
      <el-table-column prop="title"
                       :label="$t('operating.f_16')">
      </el-table-column>
      <el-table-column prop="data"
                       :label="$t('operating.f_18')">
      </el-table-column>
      <el-table-column :label="$t('operating.f_1')">
        <template slot-scope="scope">
          <p v-for="(item,idx) in scope.row.platform"
             :key="idx">{{item}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="user.username"
                       :label="$t('operating.t_10')">
      </el-table-column>
      <!-- 状态为 0 ： 未推送。1：已推送。2：推送失败 -->
      <el-table-column :label="$t('operating.t_44')">
        <template slot-scope="scope">
          <el-tag effect="dark"
                  type="danger">
            {{ getStatue(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at"
                       :label="$t('operating.t_11')">
        <!-- <template slot-scope="scope"> {{ (new Date(scope.row.updated_at).getTime())/1000 |formatTime('Y-M-D h:m:s') }} </template> -->
      </el-table-column>

      <el-table-column :label="$t('comm.action')">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status!==1"
                     type="text"
                     size="small"
                     @click.native.prevent="addProduct('status',scope.row)">
            {{ $t('operating.b_6')}}
          </el-button>
          <el-button v-if="scope.row.status!==1"
                     type="text"
                     size="small"
                     @click.native.prevent="addProduct('editor',scope.row)">
            {{$t('comm.editor')}}
          </el-button>
          <el-button v-if="scope.row.status!==1"
                     type="text"
                     size="small"
                     @click.native.prevent="addProduct('delete',scope.row)">
            {{$t('comm.delete')}}
          </el-button>
          <span v-else>--</span>
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
import PpSelect from '@/components/home/pp-select'
import { getSessionCache } from '@/utils/dom/dom'
const getMessageList = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getMessageList', params).then(res => {
      resolve(res)
    })
  })
}
const _pageSize = 10;
export default {
  scrollToTop: true,
  components: {
    TitleRow,
    PpSelect,
  },

  head () {
    return {
      title: this.$t('aside.n_8'),
      meta: [
        { hid: 'adv custom title', name: 'adv', content: 'adv custom title description' }
      ]
    }
  },
  data () {

    return {
      loading: false,
      qpform: {
        ppid: '0',
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
    const _res = await getMessageList(store, _par)
    return {
      entries: _res.data.data,
      listcount: parseInt(_res.data.total)
    }
  },
  methods: {

    addProduct (_type, _info) {
      if (_type === 'add') {
        this.$router.push("/beingpushed/add")
      } else if (_type === 'delete') {

        this.$confirm(this.$t('comm.confDelete'))
          .then(_ => {
            this.deletMmessageAction(this.$store, _info, this).then(res => {
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.actiongetMessageList(this.pagination.page);
              } else {
                this.$message.error(this.$t('comm.tip_4'));
              }
            }).catch(_err => { this.$message.error(this.$t('comm.tip_4')); });
          })
          .catch(_ => { });
      } else if (_type === 'editor') {
        this.$router.push("/beingpushed/editor/" + _info.id)
      } else if (_type === 'status') {  // 推送操作
        const _txt = this.$t('operating.b_6');
        this.$confirm(this.$t('comm.confirm') + "：" + _txt)
          .then(_ => {
            this.pushMessageAction(this.$store, _info, this).then(res => {
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.actiongetMessageList(this.pagination.page);
              } else {
                this.$message.error(this.$t('comm.tip_4'));
              }

            }).catch(_err => { this.$message.error(_txt + "" + this.$t('comm.tip_4')); });
          })
          .catch(_ => { });
      } else {

      }
    },

    onSubmit () {
      this.actiongetMessageList(1);
    },
    handleCurrentChange (val) {
      this.actiongetMessageList(val);
    },
    actiongetMessageList (_v) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        size: _pageSize,
        page: _v || 1,
      };
      (this.qpform.ppid !== '0' && this.qpform.ppid) && (_par.platform = this.qpform.ppid);
      this.qpform.name !== '' && (_par.keyword = this.qpform.name);
      getMessageList(this.$store, _par, this).then(res => {
        this.entries = res.data.data;
        this.listcount = parseInt(res.data.total);
        this.pagination.page = _v;
        this.loading = false;
      })
    },

    pushMessageAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: params.id || '',
      }
      return new Promise((resolve, reject) => {
        store.dispatch('pushMessage', param).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err);
        });
      })
    },
    deletMmessageAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: params.id || ''
      }
      return new Promise((resolve, reject) => {
        store.dispatch('deletMmessage', param).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err);
        });
      })
    },
    getStatue (_type) {
      let _txt = '--';
      if (_type === 0) {
        _txt = this.$t('operating.b_8');
      } else if (_type === 1) {
        _txt = this.$t('operating.b_7');
      } else if (_type === 2) {
        _txt = this.$t('operating.b_9');
      }
      return _txt;
    }
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
