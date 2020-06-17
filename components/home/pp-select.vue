<template>

  <el-select :placeholder="$t('comm.pleaseselect')"
             :value="value"
             :size="cSize"
             :multiple="ismultiple === 'multiple'"
             @input="change($event)">
    <el-option v-if="!isnoall"
               :label="$t('comm.all')"
               value="0"></el-option>
    <el-option v-for="item in productPlatformSelect"
               :key="item.id"
               :label="item.name"
               :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { mapState } from 'vuex'
import { getSessionCache } from '@/utils/dom/dom'
export default {
  name: 'PpSelect',

  // eslint-disable-next-line vue/require-prop-types
  props: ['value', 'ismultiple', 'isnoall'],

  computed: {
    ...mapState({
      productPlatformSelect: state => state.productPlatformSelect,
      cSize: state => state.cSize
    })
  },
  mounted () {
    if (!this.productPlatformSelect.length) {
      const _userToken = getSessionCache("userToken");
      this.getPlatformList(this.$store, { 'token': _userToken }, this).then(res => {
        // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
        if (res.code === 0) {
          this.$store.commit('SET_PPSELECT', res.data)
        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }

      })
      // this.$store.commit('SET_PPSELECT', [
      //   { "product_id": "1", "product_name": "官网" },
      //   { "product_id": "2", "product_name": "THINKDIAG" },
      //   { "product_id": "3", "product_name": "THINKTOOL" },
      //   { "product_id": "4", "product_name": "THINKDIAG MINI" },
      //   { "product_id": "5", "product_name": "通用" },
      // ])
    }
  },
  methods: {

    getPlatformList (store, params, self) {
      return new Promise(resolve => {
        store.dispatch('getPlatformList', params).then(res => {
          resolve(res)
        })
      })
    },
    change: function (val) {
      this.$emit('input', val);
    }
  },
}
</script>

<style lang="stylus" scoped></style>
