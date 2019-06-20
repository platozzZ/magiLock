const formatAll = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatAllTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('/')
}
const formatTimes = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}
const formatTime = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
}

const formatHour = date => {
  return date.getHours()
}
const formatMinute = date => {
  return date.getMinutes()
}

const getDateStr = addDayCount => {
  var dd = new Date();
  dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期
  var d = dd.getDate();
  return y + '/' + (m < 10 ? '0' + m : m) + '/' + (d < 10 ? '0' + d : d);
}
const getDateNext = addDayCount => {
  var dd = new Date();
  dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期
  var d = dd.getDate();
  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
}

const formatWords = date => {
  // var dd = new Date();
  // dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期
  var y = date.getFullYear();
  var m = date.getMonth() + 1;//获取当前月份的日期
  var d = date.getDate();
  return (m < 10 ? '0' + m : m) + '月' + (d < 10 ? '0' + d : d) + '日';
}

const formatWeeks = date => {
  // var dd = new Date();
  // dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期
  var day = date.getDay();
  var weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  var week = weeks[day]; //根据星期值，从数组中获取对应的星期字符串
  return week;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatNumber: formatNumber,
  formatAll: formatAll,
  formatAllTime: formatAllTime,
  formatDate: formatDate,
  formatTime: formatTime,
  formatTimes: formatTimes,
  formatHour: formatHour,
  formatMinute: formatMinute,
  getDateStr: getDateStr,
  getDateNext: getDateNext,
  formatWords: formatWords,
  formatWeeks: formatWeeks
}
