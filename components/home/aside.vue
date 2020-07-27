<template>
  <el-menu :default-active="defselect"
           class="ly_el_menu"
           :collapse="isCollapse"
           :router="true"
           @select="lyMenuSelect">

    <el-submenu index="1_1">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ $t('aside.n_1') }}</span>
      </template>
      <el-menu-item index="/advertising">{{ $t('aside.n_1_1') }} </el-menu-item>
      <el-menu-item index="/productplatform"> {{ $t('aside.n_1_4') }} </el-menu-item>
      <el-menu-item index="/toolvideo"> {{ $t('aside.n_1_5') }} </el-menu-item>
    </el-submenu>

    <el-menu-item index="/integral">
      <i class="el-icon-s-claim"></i>
      <span slot="title">{{ $t('aside.n_2') }}</span>
    </el-menu-item>
    <el-menu-item index="/topic">
      <i class="el-icon-s-claim"></i>
      <span slot="title">{{ $t('aside.n_3') }}</span>
    </el-menu-item>

    <el-submenu index="1_2">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ $t('aside.n_8') }}</span>
      </template>
      <el-menu-item index="/beingpushed"> {{ $t('aside.n_8_1') }} </el-menu-item>
      <el-menu-item index="/beingpushedplatform"> {{ $t('aside.n_8_2') }} </el-menu-item>
    </el-submenu>

    <el-menu-item index="/comments">
      <i class="el-icon-s-claim"></i>
      <span slot="title">{{ $t('aside.n_4') }}</span>
    </el-menu-item>
    <el-menu-item index="/feedback">
      <i class="el-icon-s-claim"></i>
      <span slot="title">{{ $t('aside.n_6') }}</span>
    </el-menu-item>
    <el-menu-item index="/usermanagement">
      <i class="el-icon-s-claim"></i>
      <span slot="title">{{ $t('aside.n_7') }}</span>
    </el-menu-item>

    <el-submenu index="1_5">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ $t('aside.n_5') }}</span>
      </template>
      <el-menu-item index="/datastatistics/applist">{{ $t('aside.n_5_1') }} </el-menu-item>
      <el-menu-item index="/datastatistics/websitepv"> {{ $t('aside.n_5_2') }} </el-menu-item>
      <el-menu-item index="/datastatistics/websiteofficial"> {{ $t('aside.n_5_3') }} </el-menu-item>
      <el-menu-item index="/datastatistics/devicelist"> {{ $t('aside.n_5_4') }} </el-menu-item>
      <!-- <nuxt-link to="/datastatistics/applist">
        <el-menu-item index="1_5_5"> {{ $t('aside.n_5_5') }} </el-menu-item>
      </nuxt-link> -->
      <!-- <el-menu-item index="/datastatistics/wx"> {{ $t('aside.n_5_6') }} </el-menu-item> -->
      <el-menu-item index="/datastatistics/userstatistics"> {{ $t('aside.n_5_7') }} </el-menu-item>
    </el-submenu>

    <!-- <nuxt-link to="/marketing">
      <el-menu-item index="marketing">
        <i class="el-icon-s-claim"></i>
        <span slot="title">{{ $t('aside.n_9') }}</span>
      </el-menu-item>
    </nuxt-link> -->
    <el-menu-item index="/marketing">
      <i class="el-icon-s-claim"></i>
      <span slot="title">{{ $t('aside.n_9') }}</span>
    </el-menu-item>
    <el-menu-item index="/pricelist">
      <i class="el-icon-s-claim"></i>
      <span slot="title">{{ $t('aside.n_10') }}</span>
    </el-menu-item>

  </el-menu>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'VAside',
  data () {
    return {
      defselect: ''
    }
  },
  computed: {
    ...mapState({
      isCollapse: state => state.isCollapse
    })
  },
  mounted () {
    this.defselect = location.pathname;
  },
  methods: {
    lyMenuSelect (key, keyPath) {
      // console.log(key, keyPath);
    },

  }
}
</script>

<style lang="stylus">
.ly_el_menu
  border-right none !important
.ly_el_menu:not(.el-menu--collapse)
  width 200px
  min-height 400px
</style>
