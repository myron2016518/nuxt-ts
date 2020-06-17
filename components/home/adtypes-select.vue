<template>

  <el-select :placeholder="$t('comm.pleaseselect')"
             :value="value"
             :size="cSize"
             :multiple="ismultiple === 'multiple'"
             @input="change($event)">
    <el-option v-if="!isnoall"
               :label="$t('comm.all')"
               value="0"></el-option>
    <el-option v-for="item in adtypesSelect"
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
  name: 'AdtypesSelect',

  // eslint-disable-next-line vue/require-prop-types
  props: ['value', 'ismultiple', 'isnoall'],

  computed: {
    ...mapState({
      adtypesSelect: state => state.adtypesSelect,
      cSize: state => state.cSize
    })
  },
  mounted () {
    if (!this.adtypesSelect.length) {
      const _userToken = getSessionCache("userToken");
      this.getPosterTypeList(this.$store, { 'token': _userToken }, this).then(res => {
        // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
        if (res.code === 0) {
          this.$store.commit('SET_ADTYPESELECT', res.data)
        } else {
          this.$message.error(this.$t('comm.tip_4'));
        }

      })
      // this.$store.commit('SET_ADTYPESELECT', [
      //   { "product_id": "1", "product_name": "官网广告" },
      //   { "product_id": "2", "product_name": "星卡商城广告" },
      //   { "product_id": "3", "product_name": "产品开机广告" }
      // ])
    }
  },
  methods: {

    getPosterTypeList (store, params, self) {
      return new Promise(resolve => {
        store.dispatch('getPosterTypeList', params).then(res => {
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
