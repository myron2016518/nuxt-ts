<template>
  <div class="d_tcpde_p">
    <title-row :title="$t('aside.n_1_1')"></title-row>
    <el-row class="d_tcpde_main">
      <el-form :inline="true"
               :model="qpform"
               class="d_plist_form">
        <el-form-item :label="$t('operating.f_1')">
          <pp-select v-model="qpform.ppid"></pp-select>
        </el-form-item>

        <el-form-item :label="$t('operating.f_2')">
          <adtypes-select v-model="qpform.adid"></adtypes-select>
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
                 @click="addProduct('add')">{{$t('operating.b_1')}}</el-button>
    </el-row>
    <el-table v-loading="loading"
              class="d_plist_table"
              :data="entries">
      <el-table-column prop="id"
                       :label="$t('operating.t_1')">
      </el-table-column>
      <el-table-column :label="$t('aside.n_1')">
        <template slot-scope="scope">
          <el-image style="width: 60px; height: 60px"
                    :src="scope.row.resource[0].path_label"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="platform.name"
                       :label="$t('operating.f_1')">
      </el-table-column>
      <el-table-column prop="poster_type.name"
                       :label="$t('operating.f_2')">
      </el-table-column>
      <el-table-column :label="$t('operating.t_3')">
        <template slot-scope="scope">
          {{scope.row.resource[0].extra.link}}
        </template>
      </el-table-column>

      <el-table-column prop="created_at"
                       :label="$t('operating.t_2')">
      </el-table-column>

      <el-table-column :label="$t('comm.action')">
        <template slot-scope="scope">
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
import AdtypesSelect from '@/components/home/adtypes-select'
import { getSessionCache } from '@/utils/dom/dom'
const getPosterList = (store, params, self) => {
  return new Promise(resolve => {
    store.dispatch('getPosterList', params).then(res => {
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
    AdtypesSelect
  },

  head () {
    return {
      title: this.$t('aside.n_1_1'),
      meta: [
        { hid: 'adv custom title', name: 'adv', content: 'adv custom title description' }
      ]
    }
  },
  data () {

    return {
      loading: false,
      qpform: {
        ppid: '',
        adid: '',
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
    const _res = await getPosterList(store, _par)
    return {
      entries: _res.data.data,
      listcount: parseInt(_res.data.total)
    }
  },
  methods: {

    addProduct (_type, _info) {
      if (_type === 'add') {
        this.$router.push("/advertising/add")
      } else if (_type === 'delete') {

      } else if (_type === 'editor') {
        this.$router.push("/advertising/editor/" + _info.id)
      } else {

      }
    },

    onSubmit () {
      this.actiongetPosterList(1);
    },
    handleCurrentChange (val) {
      this.actiongetPosterList(val);
    },
    actiongetPosterList (_v) {
      this.loading = true;
      const _par = {
        token: getSessionCache("userToken") || '',
        size: _pageSize,
        page: _v || 1,
        platform_id: this.qpform.ppid || '',
        poster_type_id: this.qpform.adid || '',
      };
      (this.qpform.app !== 0 && this.qpform.app) && (_par.app = this.qpform.app);
      getPosterList(this.$store, _par, this).then(res => {
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
