<template>
  <el-menu :default-active="defselect"
           :default-openeds="['1_1']"
           class="ly_el_menu"
           :collapse="isCollapse"
           @select="lyMenuSelect">

    <el-submenu index="1_1">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ $t('aside.n_1') }}</span>
      </template>
      <nuxt-link to="/advertising">
        <el-menu-item index="1_1_1">{{ $t('aside.n_1_1') }} </el-menu-item>
      </nuxt-link>
      <nuxt-link to="/productplatform">
        <el-menu-item index="1_1_2"> {{ $t('aside.n_1_4') }} </el-menu-item>
      </nuxt-link>
      <nuxt-link to="/toolvideo">
        <el-menu-item index="1_1_3"> {{ $t('aside.n_1_5') }} </el-menu-item>
      </nuxt-link>
    </el-submenu>

    <nuxt-link to="/integral">
      <el-menu-item index="1_2">
        <i class="el-icon-s-claim"></i>
        <span slot="title">{{ $t('aside.n_2') }}</span>
      </el-menu-item>
    </nuxt-link>
    <nuxt-link to="/topic">
      <el-menu-item index="1_3">
        <i class="el-icon-s-claim"></i>
        <span slot="title">{{ $t('aside.n_3') }}</span>
      </el-menu-item>
    </nuxt-link>
    <nuxt-link to="/comments">
      <el-menu-item index="1_4">
        <i class="el-icon-s-claim"></i>
        <span slot="title">{{ $t('aside.n_4') }}</span>
      </el-menu-item>
    </nuxt-link>
    <nuxt-link to="/feedback">
      <el-menu-item index="1_6">
        <i class="el-icon-s-claim"></i>
        <span slot="title">{{ $t('aside.n_6') }}</span>
      </el-menu-item>
    </nuxt-link>
    <nuxt-link to="/usermanagement">
      <el-menu-item index="1_7">
        <i class="el-icon-s-claim"></i>
        <span slot="title">{{ $t('aside.n_7') }}</span>
      </el-menu-item>
    </nuxt-link>
    <nuxt-link to="/beingpushed">
      <el-menu-item index="1_8">
        <i class="el-icon-s-claim"></i>
        <span slot="title">{{ $t('aside.n_8') }}</span>
      </el-menu-item>
    </nuxt-link>

    <el-submenu index="1_5">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ $t('aside.n_5') }}</span>
      </template>
      <nuxt-link to="/datastatistics/applist">
        <el-menu-item index="1_5_1">{{ $t('aside.n_5_1') }} </el-menu-item>
      </nuxt-link>
      <nuxt-link to="/datastatistics/websitepv">
        <el-menu-item index="1_5_2"> {{ $t('aside.n_5_2') }} </el-menu-item>
      </nuxt-link>
      <nuxt-link to="/datastatistics/websiteofficial">
        <el-menu-item index="1_5_3"> {{ $t('aside.n_5_3') }} </el-menu-item>
      </nuxt-link>
      <nuxt-link to="/datastatistics/devicelist">
        <el-menu-item index="1_5_4"> {{ $t('aside.n_5_4') }} </el-menu-item>
      </nuxt-link>
      <!-- <nuxt-link to="/datastatistics/applist">
        <el-menu-item index="1_5_5"> {{ $t('aside.n_5_5') }} </el-menu-item>
      </nuxt-link> -->
      <nuxt-link to="/datastatistics/wx">
        <el-menu-item index="1_5_6"> {{ $t('aside.n_5_6') }} </el-menu-item>
      </nuxt-link>
    </el-submenu>

    <!-- <nuxt-link to="/beingpushed">
      <el-menu-item index="1_9">
        <i class="el-icon-s-claim"></i>
        <span slot="title">{{ $t('aside.n_9') }}</span>
      </el-menu-item>
    </nuxt-link> -->

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
