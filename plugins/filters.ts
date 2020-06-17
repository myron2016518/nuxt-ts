import Vue from 'vue'

// 数据转化  
function formatNumber(n: string | number | any[]) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 时间格式化
export function formatTime(number: number, format: string) {
  if (!number) return '--'

  const formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  let returnArr: any[] = [];
  const date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (const i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

export function trim(str: string) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
const filters = {
  formatTime,
  trim
}

Object.keys(filters).forEach(key => {
  Vue.filter(key, (<any>filters)[key])
})
export default filters