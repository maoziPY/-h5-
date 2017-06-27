// 引入服务接口
var dataServices = require('dataServices');

// 引入cookie
var cookie = require('../util/cookie');

var Login = function (api) {

  return {

    checkLogin: function () {
      var userinfo = dataServices.getDataModel().userinfo;
      userinfo = userinfo === '' ? {} : userinfo;
      var isLogin = !!userinfo.nickname;

      return isLogin
    },

    jumpLogin: function (cb) {

      var h = '',
        cu = cb || location.href.replace('https://', 'http://');
      cu = decodeURIComponent(decodeURIComponent(cu));
      cu = encodeURIComponent(cu);
      h = 'http://account.wps.cn/mobilelogin?cb=' + cu;
      location.href = h;
    }
  }

}()

module.exports = Login
