<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_3_1')"></title-row>
    <el-row class="d_tcpde_main">
      <el-form :inline="true"
               :model="qpform"
               class="d_plist_form">
        <el-form-item :label="$t('operating.f_1')">
          <pp-select v-model="qpform.ppid"></pp-select>
        </el-form-item>

        <el-form-item :label="$t('operating.f_6')">
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
                 @click="addProduct('add')">{{$t('aside.n_3_2')}}</el-button>

    </el-row>
    <el-table v-loading="loading"
              class="d_plist_table"
              :data="entries">
      <el-table-column prop="id"
                       :label="$t('operating.t_1')">
      </el-table-column>
      <el-table-column prop="name"
                       :label="$t('comm.namet')">
      </el-table-column>
      <el-table-column prop="status_label"
                       :label="$t('operating.t_7')">
      </el-table-column>
      <el-table-column prop="feeds_count"
                       :label="$t('operating.t_8')">
      </el-table-column>
      <el-table-column prop="followers_count"
                       :label="$t('operating.t_9')">
      </el-table-column>
      <el-table-column prop="app.name"
                       :label="$t('operating.f_1')">
      </el-table-column>
      <el-table-column prop="user.name"
                       :label="$t('operating.t_10')">
      </el-table-column>
      <el-table-column prop="updated_at"
                       :label="$t('operating.t_11')">
      </el-table-column>

      <el-table-column :label="$t('comm.action')">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.native.prevent="addProduct('status',scope.row)">
            {{scope.row.status === 'waiting' ? $t('comm.online'):$t('comm.offline')}}
          </el-button>
          <el-button type="text"
                     size="small"
                     @click.native.prevent="addProduct('editor',scope.row)">
            {{$t('comm.editor')}}
          </el-button>
          <el-button type="text"
                     size="small"
                     @click.native.prevent="addProduct('delete',scope.row)">
            {{$t('comm.delete')}}
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
import PpSelect from '@/components/home/pp-select'
import { getSessionCache } from '@/utils/dom/dom'
const getTopicList = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getTopicList', params).then(res => {
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
      title: this.$t('aside.n_3_1'),
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
    const _res = await getTopicList(store, _par)
    return {
      entries: _res.data.data,
      listcount: parseInt(_res.data.total)
    }
  },
  methods: {

    addProduct (_type, _info) {
      if (_type === 'add') {
        this.$router.push("/topic/add")
      } else if (_type === 'delete') {

        this.$confirm(this.$t('comm.confDelete'))
          .then(_ => {
            this.deleteTopicAction(this.$store, _info, this).then(res => {
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.actiongetTopicList(this.pagination.page);
              } else {
                this.$message.error(this.$t('comm.tip_4'));
              }

            })
          })
          .catch(_ => { });
      } else if (_type === 'editor') {
        this.$router.push("/topic/editor/" + _info.id)
      } else if (_type === 'status') {  // 上线 下线操作
        const _txt = _info.status === 'waiting' ? this.$t('comm.online') : this.$t('comm.offline')
        this.$confirm(this.$t('comm.confirm') + "：" + _txt)
          .then(_ => {
            this.editTopicAction(this.$store, _info, this).then(res => {
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.actiongetTopicList(this.pagination.page);
              } else {
                this.$message.error(this.$t('comm.tip_4'));
              }

            })
          })
          .catch(_ => { });
      } else {

      }
    },

    onSubmit () {
      this.actiongetTopicList(1);
    },
    handleCurrentChange (val) {
      this.actiongetTopicList(val);
    },
    actiongetTopicList (_v) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        size: _pageSize,
        page: _v || 1,
      };
      (this.qpform.ppid !== '0' && this.qpform.ppid) && (_par.app_id = this.qpform.ppid);
      this.qpform.name !== '' && (_par.name = this.qpform.name);
      getTopicList(this.$store, _par, this).then(res => {
        this.entries = res.data.data;
        this.listcount = parseInt(res.data.total);
        this.pagination.page = _v;
        this.loading = false;
      })
    },

    editTopicAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: params.id || '',
        status: params.status === 'waiting' ? 'passed' : 'waiting', // 0下架，1上架
      }
      return new Promise(resolve => {
        store.dispatch('editTopic', param).then(res => {
          resolve(res)
        })
      })
    },
    deleteTopicAction (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
        sId: params.id || ''
      }
      return new Promise(resolve => {
        store.dispatch('deleteTopic', param).then(res => {
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
