<template>
    <div class="content">
        <div class="infoItem">
            <div class="leftCont"><span>*</span>照片：</div>
            <div class="rightCont rightImg">
                <div class="imgList">
                    <div v-for="(item,ind) in imgFiles" :key="ind" >
                        <div class="imgItem" >
                            <div class="remove" @click="removeImg(ind)"><image src="/static/img/delete.png"></image></div>
                            <image :src="item" alt="" @click="previewImg(ind)" mode="aspectFit" style="width:50px;height:50px"></image>
                        </div>
                    </div>
                </div>
                <div class="addImg" @click="chooseImg">
                    <div class="addImgBtn">+</div>
                </div>
            </div>
        </div>
        <canvas class="canvas" canvas-id="canvas" :style="{width:cWidth+'px',height:cHeight+'px', visibility: 'hidden', 'position':'absolute', 'z-index': '-1', left: '-10000rpx',top:'-10000rpx'}"></canvas>
    </div>
</template>

<script>
import { getLessLimitSizeImage, imageSizeIsLessLimitSize,getCanvasImage, getBase64} from '../../../static/js/common'
export default {
  data () {
    return {
        cWidth: 2000,
        cHeight:2000,
        mapCtx:{},
        imgFiles:[],
        compressImgs:[],
      }
    },
  methods: {
      chooseImg(e){
          let maxSize = 400;
          let dWidth = wx.getSystemInfoSync().windowWidth;
          console.log(dWidth);
          let that = this;
          wx.chooseImage({
              sizeType:['compressed'],
              sourceType:['album','camera'],
              success:function(res){
                  // 返回选定图片的本地文件列表，tempFilePaths可以作为img标签的src列表
                  // 当一次选择多张图片的情况
                  res.tempFilePaths.forEach(v=>{
                      that.imgFiles.push(v);
                      wx.getFileInfo({
                        filePath:v,
                        success:function(res){
                            var cW = res.width,cH = res.height,rat = 1.1;
                            that.cWidth = cW;
                            that.cHeight = cH;
                        }
                    })
                    getLessLimitSizeImage('canvas', v, maxSize, dWidth, function(img){
                        that.compressImgs.push(img);                        
                        wx.getFileInfo({
                            filePath:img,
                            success:function(res){
                                console.log('压缩后：'+res.size/1024+'kb')
                            }
                        })
                })

                  });
              },
              fail:function(err){
                  console.log(err)
              }
          })
      },
      // 预览图片
      previewImg(ind){
          var that = this;
          wx.showActionSheet({
              itemList:['预览','删除'],
              success:function(res){
                  if (res.tapIndex == 0){
                      wx.previewImage({
                          current:that.imgFiles[ind],
                          urls:that.imgFiles
                      });
                  }else{
                      that.imgFiles.splice(ind,1);
                  }
              }
          })
      },
  },
  
  computed:{
  },
  onLoad(){
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
@import '../../../static/css/caraply.scss';
</style>
