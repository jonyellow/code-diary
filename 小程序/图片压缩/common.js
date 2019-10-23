//*************** 图片压缩 ***********
// 判断图片大小是否满足需求
function imageSizeIsLessLimitSize(imagePath, limitSize, lessCallBack, moreCallBack) {
    wx.getFileInfo({
        filePath: imagePath,
        success(res) {
            console.log("压缩前图片大小:", res.size / 1024, 'kb');
            if (res.size > 1024 * limitSize) {
                moreCallBack();
            } else {
                lessCallBack();
            }
        }
    })
};
/**
 * 获取画布图片 
 */
// 利用cavas进行压缩  每次压缩都需要ctx.draw()  wx.canvasToTempFilePath()连用
function getCanvasImage(canvasId, imagePath, imageW, imageH, getImgsuccess) {
    const ctx = wx.createCanvasContext(canvasId);
    ctx.drawImage(imagePath, 0, 0, imageW, imageH);
    ctx.draw(false, setTimeout(function() { // 一定要加定时器，因为ctx.draw()应用到canvas是有个时间的
        wx.canvasToTempFilePath({
            canvasId: canvasId,
            x: 0,
            y: 0,
            width: imageW,
            height: imageH,
            quality: 1,
            success: function(res) {
                getImgsuccess(res.tempFilePath);
            },
        });
    }, 200));
};

// 主调用方法

/**
 * 获取小于限制大小的Image, limitSize默认为100KB，递归调用。
 */
function getLessLimitSizeImage(canvasId, imagePath, limitSize = 100, drawWidth, callBack) {
    imageSizeIsLessLimitSize(imagePath, limitSize,
        (lessRes) => {
            callBack(imagePath);
        },
        (moreRes) => {
            wx.getImageInfo({
                src: imagePath,
                success: function(imageInfo) {
                    var maxSide = Math.max(imageInfo.width, imageInfo.height);
                    //画板的宽高默认是windowWidth
                    var windowW = drawWidth;
                    var scale = 1;
                    if (maxSide > windowW) {
                        scale = windowW / maxSide;
                    }
                    var imageW = Math.trunc(imageInfo.width * scale);
                    var imageH = Math.trunc(imageInfo.height * scale);
                    console.log('调用压缩', imageW, imageH);
                    getCanvasImage(canvasId, imagePath, imageW, imageH,
                        (pressImgPath) => {
                            getLessLimitSizeImage(canvasId, pressImgPath, limitSize, drawWidth * 0.95, callBack);
                        }
                    );
                }
            })
        }
    )
};
// 图片转basee64    io操作 使用异步方式
function getBase64(img) {
    return new Promise(function(resolve, reject) {
        const FSM = wx.getFileSystemManager();
        FSM.readFile({
            filePath: img,
            encoding: 'base64',
            success(data) {
                resolve(data)
            }
        })
    })
}

export { getLessLimitSizeImage, imageSizeIsLessLimitSize, getCanvasImage, getBase64 }
