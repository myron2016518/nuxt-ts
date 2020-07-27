<template>

  <el-select :placeholder="$t('comm.pleaseselect')"
             :value="value"
             :size="cSize"
             :multiple="ismultiple === 'multiple'"
             @input="change($event)">
    <el-option v-if="!isnoall"
               :label="$t('comm.all')"
               value="0"></el-option>
    <el-option v-for="item in deviceSelect"
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
  name: 'BpSelect',

  // eslint-disable-next-line vue/require-prop-types
  props: ['value', 'ismultiple', 'isnoall'],

  computed: {
    ...mapState({
      deviceSelect: state => state.deviceSelect,
      cSize: state => state.cSize
    })
  },
  mounted () {
    if (!this.deviceSelect.length) {
      const _userToken = getSessionCache("userToken");
      this.getDeviceList(this.$store, { 'token': _userToken }, this).then(res => {
        // code ,50001: 参数错误，50003： 账号或者密码错误 ， 0 ：成功
        if (res.code === 0) {
          this.$store.commit('SET_DEVICESELECT', res.data)
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

    getDeviceList (store, params, self) {
      return new Promise(resolve => {
        store.dispatch('getDeviceList', params).then(res => {
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
