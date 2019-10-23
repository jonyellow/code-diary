// *********** 地图 ************
import QQmapWX from './qqmap.min'

//通过经纬度得到地址相关信息   该操作是异步操作，所以最好加个callback
// function getAddress(long, lat, callback) {
//     // long 经度   lat 纬度
//     var address = '';
//     var locationString = lat + "," + long;
//     console.log(locationString);
//     wx.request({
//         url: 'http://apis.map.qq.com/ws/geocoder/v1/',
//         data: {
//             "key": "xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxx",
//             "location": locationString
//         },
//         method: 'GET',
//         success: function(r) {
//             //输出一下位置信息
//             console.log('用户位置信息', r.data.result.address);
//             //r.data.result.address获得的就是用户的位置信息，将它保存到一个全局变量上
//             address = r.data.result.address;
//             callback(r.data.result);
//         },
//         fail(err) {
//             console.log(err)
//         }
//     });
//     return address
// }

function sdkAddress(long, lat, callback) {
    var address = '';
    var qqmapsdk = new QQmapWX({
        key: 'xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxx'
    });
    qqmapsdk.reverseGeocoder({
        location: {
            longitude: long,
            latitude: lat
        },
        success(res) {
            // 输出位置信息
            address = res.result.address;
            callback(res.result.address);
        }

    });
    return address
}
export { getAddress, sdkAddress }

