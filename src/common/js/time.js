/**
 * Created by sjs-fqy on 2017/7/25.
 */

/**
 * 毫秒转换友好的显示格式
 * 输出格式：21小时前
 * @param  {[type]} time [description]
 * @return {[type]}      [description]
 */
export function dateStr (str) {
  // 时间格式转换2017-01-01 00：00：00 转换为 2017/01/01 00：00：00
  let date = Date.parse(str.replace(/-/g, '/'))
  // 获取js 时间戳
  let newDate = Date.parse(new Date())
  let time = parseInt((newDate - date) / 1000)
  // 存储转换值
  let s
  if (time < 60 * 10) {
    // 十分钟内
    return '刚刚'
  } else if ((time < 60 * 60) && (time >= 60 * 10)) {
    // 超过十分钟少于1小时
    s = Math.floor(time / 60) | 0
    return s + '分钟前'
  } else if ((time < 60 * 60 * 24) && (time >= 60 * 60)) {
    // 超过1小时少于24小时
    s = Math.floor(time / 60 / 60) | 0
    return s + '小时前'
  } else if ((time < 60 * 60 * 24 * 3) && (time >= 60 * 60 * 24)) {
    // 超过1天少于3天内
    s = Math.floor(time / 60 / 60 / 24) | 0
    return (s + '天前')
  } else {
    return str
  }
}
