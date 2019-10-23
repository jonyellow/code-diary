<template>
    <div class="content">
        <div class="infoItem">
            <div class="leftCont"><span>*</span>定位：</div>
            <div class="rightCont">
                <div class="address">{{address}}</div>
                <map id="my-map"
                     class="my-map"
                     :longitude="!mapInit&&formData.longitude"
                     :latitude="!mapInit&&formData.latitude"
                     :markers="marker"
                     @regionchange="regionChange"
                     @begin="begin"
                     @end="end"
                     show-location
                                 ></map>
            </div>
        </div>
    </div>
</template>

<script>
import { sdkAddress } from '../../../static/js/common'
export default {
  data () {
    return {
        mapCtx:{},
        touchTimeStamp:0,
        address:'',
        mapInit: false,//防止用户拖动地图时，经纬值变化带来的位置闪烁bug
      }
    },
  methods: {
      // 获取用户当前位置信息
      getLocalInfo(){
          var that =this;
          that.mapCtx = wx.createMapContext('my-map');
          wx.getLocation({
              type:'gcj02',
              success(res){
                  that.formData.longitude = res.longitude;
                  that.formData.latitude = res.latitude;
                  sdkAddress(res.longitude, res.latitude, function(ad){
                      that.address = ad;
                  })
              }
          });
      },
      regionChange (param) {
      console.log('change', param) // （实测不会输出）
    },
    // 开始拖动
    begin ({timeStamp}) {
        console.log(1111);
      this.touchTimeStamp = timeStamp
    },
    // 结束拖动
    end ({timeStamp}) {
        console.log(2222);
     // 添加拖动时长判断，防止误触操作
        if (timeStamp - this.touchTimeStamp > 100) {
            console.log(3333);
        }
    },
  },
  
  computed:{
  },
  onLoad(){
  },
  mounted () {
      this.getLocalInfo()
  }
}
</script>

<style lang="scss" scoped>
@import '../../../static/css/caraply.scss';
</style>
