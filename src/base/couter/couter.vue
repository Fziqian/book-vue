<template>
    <span class="couter">剩余时间&nbsp;&nbsp;&nbsp;{{time}}</span>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        time: ''
      }
    },
    props: {
      add_time: {
        type: String,
        default: ''
      }
    },
    created () {
      this.formate(this.add_time)
    },
    methods: {
      formate (data) {
        console.log(data)
        let timer = setInterval(() => {
//          let createtimes = Date.parse(new Date(data))
          let shijian = data.split('T')
          let nian = shijian[0].split('-')
          let shi = shijian[1].split(':')
          let addtime = new Date(Date.UTC(nian[0], nian[1] - 1, nian[2], shi[0] - 8, shi[1], shi[2]))
          let createtimes = parseInt(addtime.getTime() / 1000)
          let nowtimes = new Date()
          let yutime = parseInt(nowtimes.getTime() / 1000)
          let cha = parseInt(yutime - createtimes)
          let minutes = 39 - parseInt(cha / 60)
          let seconds = 59 - parseInt(cha % 60)
          if (minutes === -1 && seconds === -1) {
            clearInterval(timer)
          } else {
            if (minutes < 10) {
              minutes = '0' + minutes
            }
            if (seconds < 10) {
              seconds = '0' + seconds
            }
            this.time = minutes + ':' + seconds
          }
        }, 1000)
      }
    }
  }
</script>

<style scoped>

  .couter {

  }


</style>
