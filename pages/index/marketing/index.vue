<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_9')"></title-row>
    <el-row class="d_tcpde_main">
      <el-form :inline="true"
               :model="qpform"
               class="d_plist_form">
        <el-form-item :label="$t('operating.f_1')">
          <!-- <pp-select v-model="qpform.ppid"></pp-select> -->
          <el-select v-model="qpform.ppid"
                     :placeholder="$t('comm.pleaseselect')"
                     :size="cSize">
            <el-option :label="$t('comm.all')"
                       value="0"></el-option>
            <el-option v-for="item in snppSelect"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="qpform.pcid"
                     :placeholder="$t('comm.pleaseselect')"
                     :size="cSize">
            <el-option v-for="item in snProductChildren"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item :label="$t('operating.f_6')">
          <el-input v-model="qpform.name"
                    :size="cSize"
                    :placeholder="$t('comm.pleaseinput')"></el-input>
        </el-form-item> -->
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
                 @click="addProduct('add')">{{$t('operating.b_12')}}</el-button>

    </el-row>
    <el-table v-loading="loading"
              class="d_plist_table"
              :data="entries">
      <el-table-column :label="$t('operating.f_1')">
        <template slot-scope="scope">
          {{getPidData(scope.row.pid)}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('operating.t_63')">
        <template slot-scope="scope">
          {{getPidCData(scope.row.pid,scope.row.product_id)}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="name"
                       :label="$t('operating.t_64')">
      </el-table-column> -->
      <el-table-column prop="trial_description"
                       :label="$t('operating.t_57')">
      </el-table-column>

      <el-table-column :label="$t('operating.t_65')">
        <template slot-scope="scope">

          <el-button type="text"
                     size="small"
                     @click.native.prevent="addProduct('status',scope.row)">
            {{scope.row.status===0 ?  $t('operating.b_13') :$t('operating.b_14')}}
          </el-button>
          <el-button type="text"
                     size="small"
                     @click.native.prevent="addProduct('editor',scope.row)">
            {{$t('comm.editor')}}
          </el-button>
          <!-- <el-button type="text"
                     size="small"
                     @click.native.prevent="addProduct('delete',scope.row)">
            {{$t('comm.delete')}}
          </el-button> -->
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('operating.t_66')">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.native.prevent="showDetilsList(scope.row)">
            {{$t('operating.b_16')}}
          </el-button>
        </template>
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
  </div>

</template>

<script>
import { mapState } from 'vuex'
import TitleRow from '@/components/home/title-row'
// import PpSelect from '@/components/home/pp-select'
import { getSessionCache } from '@/utils/dom/dom'
const getMarketingList = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getMarketingList', params).then(res => {
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
      title: this.$t('aside.n_9'),
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
        pcid: '',
        name: '',
      },
      pagination: {
        page_size: _pageSize,
        page: 1,
      },
      listcount: 0,
      entries: [],
      snProductChildren: [],
    }
  },
  computed: {
    ppid () {
      return this.qpform.ppid
    },
    ...mapState({
      snppSelect: state => state.snppSelect,
      cSize: state => state.cSize
    })
  },
  watch: {
    ppid (newValue, oldValue) {
      this.qpform.pcid = '';
      newValue === '0' && (this.snProductChildren = []);
      const _cl = this.snppSelect.find(item => item.id === newValue);
      _cl && (this.snProductChildren = _cl.children || []);
    }
  },
  async asyncData ({ store, params }) {
    const _par = {
      token: getSessionCache("userToken") || '',
      size: _pageSize,
      page: 1
    };
    const _res = await getMarketingList(store, _par)
    return {
      entries: _res.data.data,
      listcount: parseInt(_res.data.total)
    }
  },
  created () {
    if (!this.snppSelect.length) {
      // 获取产品平台列表接口
      this.getAllProductList(this.$store, {}, this).then(res => {
        // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
        if (res.code === 0) {
          this.$store.commit('SET_SNPPSELECT', res.data)
        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }
      })
    }
  },
  methods: {

    addProduct (_type, _info) {
      if (_type === 'add') {
        this.$router.push("/marketing/add")
      } else if (_type === 'delete') {

        this.$confirm(this.$t('comm.confDelete'))
          .then(_ => {
            this.deleteTopicAction(this.$store, _info, this).then(res => {
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.actiongetMarketingList(this.pagination.page);
              } else {
                this.$message.error(this.$t('comm.tip_4'));
              }

            })
          })
          .catch(_ => { });
      } else if (_type === 'editor') {
        this.$router.push("/marketing/editor/" + _info.id)
      } else if (_type === 'status') {  // 1：开启，0：关闭
        const _txt = _info.status === 0 ? this.$t('operating.b_13') : this.$t('operating.b_14')
        this.$confirm(this.$t('comm.confirm') + "：" + _txt)
          .then(_ => {
            this.editMarketingAction(this.$store, _info, this).then(res => {
              if (res.code === 0) {
                this.$message({ message: this.$t('comm.tip_3'), type: 'success' });
                this.actiongetMarketingList(this.pagination.page);
              } else {
                this.$message.error(this.$t('comm.tip_4'));
              }

            })
          })
          .catch(_ => { });
      } else {

      }
    },
    // 查看详情
    showDetilsList (_info) {
      const _txt = this.getPidCData(_info.pid, _info.product_id) || '';
      console.log(_txt);
      this.$router.push(`/marketing/softwarelist?id=${_info.id}&name=${_txt}`)
    },

    onSubmit () {
      this.actiongetMarketingList(1);
    },
    handleCurrentChange (val) {
      this.actiongetMarketingList(val);
    },
    actiongetMarketingList (_v) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        size: _pageSize,
        page: _v || 1,
      };
      (this.qpform.ppid !== '0' && this.qpform.ppid) && (_par.pid = this.qpform.ppid);
      (this.qpform.pcid !== '0' && this.qpform.pcid) && (_par.product_id = this.qpform.pcid);
      this.qpform.name !== '' && (_par.name = this.qpform.name);
      getMarketingList(this.$store, _par, this).then(res => {
        this.entries = res.data.data;
        this.listcount = parseInt(res.data.total);
        this.pagination.page = _v;
        this.loading = false;
      })
    },

    editMarketingAction (store, params, self) {
      params.token = getSessionCache("userToken") || '';
      params.sId = parseInt(params.id) || '';
      params.status = params.status === 0 ? 1 : 0; // 1：开启，0：关闭
      return new Promise(resolve => {
        store.dispatch('editMarketing', params).then(res => {
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
    getAllProductList (store, params, self) {
      const param = {
        token: getSessionCache("userToken") || '',
      }
      return new Promise(resolve => {
        store.dispatch('getAllProductList', param).then(res => {
          resolve(res)
        })
      })
    },
    getPidData (_id) {
      let _txt = '';
      const _find = this.snppSelect.find(_item => _item.id === _id);
      _find && (_txt = _find.name);
      return _txt;
    },
    getPidCData (_pid, _cid) {
      const _find = this.snppSelect.find(_item => _item.id === _pid);
      let _txt = ''
      if (_find) {
        const _findC = _find.children.find(_item2 => _item2.id === _cid);
        _txt = _findC ? _findC.name : _find.name;
      }
      return _txt;
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
