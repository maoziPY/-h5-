var app = getApp()
// 引入jquery
var $ = require('../lib/jquery/wxquery')

/**
	* 创建模板服务模块
	*
	*/
var DataServices = function () {
  this.init();
};

DataServices.prototype = {
  constructor: DataServices,

  init: function () {
    this.dataServices = [];
    this.dataModel = app.datamodel || {};
  },

  add: function (name, url, dataMap, action) {
    this.dataServices[name] = new CURD(url, dataMap, action);
  },

  get: function (name) {
    return this.dataServices[name];
  },

  getDataModel: function () {
    return this.dataModel;
  }
};


var CURD = function (url, dataMap, action) {
  // this.action = $.extend(true, {
  //   query: {},
  //   create: {},
  //   update: {},
  //   remove: {}
  // }, action);
  this.params = { url: url };
  this.dataMap = dataMap;
  this.init();
};

CURD.prototype = {
  constructor: CURD,

  init: function () {
    for (var x in this.action) {
      this[x] = function (type) {
        return function (params) {
          return this.send(params, type);
        };
      }(x);
    }
  },

  //发送信息
  send: function (params, type) {
    // var _params = $.extend(true, {}, this.params, this.action[type], params);

    for (var x in this.dataMap) {
      if (_params.hasOwnProperty(x)) {
        var reg = new RegExp(':\\b' + x + '\\b');
        _params.url = _params.url.replace(reg, _params[x]);
      }
    }

    var httpHandler = $.ajax({
      xhrFields: {
        'withCredentials': true
      },
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      type: _params.method || 'POST',
      cache: _params.cache,
      url: _params.url,
      dataType: _params.dataType || 'json',
      timeout: _params.timeout || 10000,
      data: _params.data || {}
    });
    return httpHandler;
  }
};

var ins = new DataServices();

var pre = '//vipapi.wps.cn'

//h5页面接口
ins.add('vipapi', pre + '/:_method_', { _method_: '@_method_' }, {
  //支付配置信息
  memberConfig: { method: 'GET', _method_: 'pay_config/v1/config/member' }
})

ins.add('vip', '//vip.wps.cn/:_method_', { _method_: '@_method_' }, {
  //获取支付优惠券列表的
  couponList: { method: 'GET', _method_: 'coupon/member/usablelist' },
  //购买会员-支付宝支付
  alipay: { method: 'GET', _method_: 'pay/webpay' },
  //购买会员-微信支付
  wxpay: { method: 'POST', _method_: 'pay/webpay' },
  //获取用户信息
  getUserinfo: { method: 'GET', _method_: 'userinfo' },
  //查询用户所有的自动续费项目（需要登录）
  getContract: { method: 'GET', _method_: 'pay/autorenew/contract' }
});

module.exports = ins;