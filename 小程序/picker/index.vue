<template>
  <div>
    <!-- <view class="section">
      <view class="section__title">省市区选择器</view>
        <picker mode="region" @change="bindRegionChange" :value="region" :custom-item="customItem">
          <view class="picker">
            当前选择：{{region[0]}}，{{region[1]}}，{{region[2]}}
          </view>
        </picker>
      </view> -->

  <view class="section">
  <view class="section__title">多列选择器</view>
  <picker mode="multiSelector" @columnchange="changeNextCol" :value="mulIndex" :range="mulArr">
    <view class="picker">
      当前选择：{{mulArr[0][mulIndex[0]]}}，{{mulArr[1][mulIndex[1]]}}，{{mulArr[2][mulIndex[2]]}}
    </view>
  </picker>
</view>
  </div>
</template>

<script>
import store from '../../store'
export default {
  data () {
    return {
      region: ['四川省', '成都市', '武侯区'],
      customItem: '全部',
      mulIndex: [0,0,0],
      mulArr:[],
      // 假设json为后端返回的数据
      json: [{type:'汽车', brand:[{name:'领克',cars:['01', '02', '03']},
                                      {name:'丰田',cars:['汉兰达','凯美瑞', '卡罗拉']}]},
                {type:'摩托车',brand:[{name:'雅马哈',cars:['MT-9','迅鹰']},
                                       {name:'铃木',cars:['钻豹','gw250']}]},
                {type:'自行车',brand:[{name:'美利达',cars:['挑战者300', '挑战者900']},
                                      {name:'捷安特',cars:['ATX777','XTR']}]}]
    }

  },
  components: {
  },
  methods: {
      htmlChange(e){
        // picker 的value改变时触发
        console.log('new index', e.target.value);
        this.mulIndex = e.target.value;
      },
      changeNextCol(e){
        // 列的值改变时触发   我这里是三列：车子类型  品牌名称  车型
        console.log('修改的列', e.target.column, '值为', e.target.value);
        // 监听用户操作，改变mulIndex的值
        this.mulIndex[e.target.column] = e.target.value;
        // mulArr[0]的值是不会随用户操作变更的，因此不需要改变  
        // mulArr[1]的值是由 mulIndex[0]的值决定的
        this.mulArr.splice(1,1,this.json[this.mulIndex[0]].brand.map(function(v){return v.name}));
        // mulArr[2]的值是由 muIndex[1]的值决定的 
        this.mulArr.splice(2,1,this.json[this.mulIndex[0]].brand[this.mulIndex[1]].cars);
        },
      bindRegionChange(e) {
        console.log('修改值为', e.target.value);
        this.region = e.target.value
    }

  
   
  },
  computed:{
   
  },
  onLoad () {
    // 初始化picker默认值
    this.mulArr[0] = this.json.map(function(v){return v.type});
    this.mulArr[1] = this.json[this.mulIndex[0]].brand.map(function(v){return v.name});
    this.mulArr[2] = this.json[this.mulIndex[0]].brand[this.mulIndex[1]].cars;
  }
}
</script>

<style lang="scss" scoped>
</style>
