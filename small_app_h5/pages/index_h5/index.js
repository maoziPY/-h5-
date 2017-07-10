//index.js
//获取应用实例
var app = getApp()
app.datamodel = {
  "openid": "",
  "userinfo": "",
  "uniform_pay_config": "",
  "code": ""
}

app.sid = '64fab015e983e4316651ee01d5266b33d9991ea9000e3b7079';

var login = require('controllers/login.js');

//$.inArray替代
function inArray(search, array) {
  for (var i in array) {
    if (array[i] == search) {
      return 1;
    }
  }
  return -1;
}


Page({
  data: {
    // 显示开通月份列表
    showMonthEsta: true,
    // 显示选中的开通月份
    showMonthEstaSelect: false,
    // 显示时长
    showDuration: false,
    // 配置数据
    _configData: {},
    // 当前折扣
    _discount: 1,
    // 当前套餐价格
    packPrice: 0,
    // 选中的会员类型
    cardSelected: 14,
    // 显示的开通月份列表
    monthList: [],
    // 选中的开通月份数据
    selectMonthData: {},
    // 选中的月份数据ghsf
    selectIndex: 0,
    // 显示优惠券
    showCoupon: false,
    // 优惠券列表
    couponList: [],
    // 优惠券选中的下标
    couponSelectIndex: 0,
    // 选中的满多少元
    par_min_pay: 0,
    // 选中的减多少元
    par_price: 0,
    // 是否有可用的优惠券
    hasUsableCoupon: false,
    // 支付价格
    payPrice: 0,
    // 省多少钱
    saveMoney: 0,
    // 显示支付方式
    showPaytype: false,
    // 前去支付面板提示文案
    gotoPayText: '',
    // 支付方式，微信=wx_wap，支付宝=alipay_wap
    payway: '',
    // 当前会员等级
    myLevel: 10,
    // 会员映射
    _dataMap: {
      20: [],
      12: [],
      40: []
    },
    // 分页器下标
    activeIndex: 0,
    // h5调起支付参数
    postData: {},
    // 显示网络异常
    showNetError: false,
    // 环境 ali=支付宝，wx=微信 
    environment: 'wx',
    // 优惠券sn
    couponSn: '',
    // 是否登录
    isLogin: false,
    // 用户信息
    userinfo: app.datamodel.userinfo,
    // 白金会员
    isL40: false,
    // 白银会员
    isL20: false,
    // 稻壳会员
    isL12: false,
    // 有效期
    expire_time: false,
    // 连续包月
    contractMap: {
      12: false,
      20: false,
      40: false
    },
    // 卡片下标与会员id的映射
    map: {
      0: 20,
      1: 12,
      2: 40,
      20: 0,
      12: 1,
      40: 2
    },
    // 卡片url
    imgUrls: [
      'http://s3.vas.wpscdn.cn/vip/styles/wappay/img/wpscard.jpg?v=6-9-10-31',
      'http://s3.vas.wpscdn.cn/vip/styles/wappay/img/docercard.png?v=6-9-10-31',
      'http://s3.vas.wpscdn.cn/vip/styles/wappay/img/supercard.jpg?v=6-9-10-31'
    ],
    autoplay: false,
    // 指示点颜色
    indicatorColor: '#e6e6e6',
    // 当前选中的指示点颜色
    indicatorActive: '#FF0000',
    // 滑动动画时长
    duration: 1000
  },

  _init: function () {

    wx.request({
      url: 'https://vip.wps.cn/userinfo',
      header: {
        'sid': app.sid
      },
      success: function (res) {
        var resp = res.data;
        if (resp.result == 'ok') {
          this.setData({
            myLevel: resp.data.vip.memberid,
            userinfo: resp.data
          })
          app.datamodel.userinfo = resp.data;
        }
        this.setData({
          isLogin: login.checkLogin()
        })

        //_checkJump();

        if (this.data.isLogin) {
          // 查询用户所有的自动续费项目
          this.getContract();

          // 判断会员等级，显示对应图标
          this._checkLevel();
        }

        if (!this.data.isLogin) {
          // 获取支付相关配置信息
          this._getConfig();
        }

          // 页面展示量收集
          // cnzzCollect('页面展示量ALL');
          // cnzzCollect('页面展示量+' + util.getQueryStringRegExp('csource'));
      }.bind(this)
    })
  },

  // 判断是否需要二次跳转
  _checkJump: function () {

    var evm = cookie.get('evm');
    // 非微信浏览器
    if (!evm && !this.data.is_weixn()) {
      this.data.environment = 'ali';
    }

    if (!evm) {
      cookie.clear('evm');
    }

    var host = location.host;

    // 非微信选购链接、没有openid、微信浏览器中，跳转到支持微信支付的页面
    if (host == 'vip.wps.cn' && this.data.environment == 'wx' && app.datamodel.openid == '' && this.data.isLogin) {
      cookie.set('evm', 'wx');
      location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb41a418990b73f8b&redirect_uri=' + encodeURIComponent(location.href) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
      return;

    }
  },

  is_weixn: function () {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      return true;
    } else {
      return false;
    }
  },

  // 判断会员等级，显示对应图标
  _checkLevel: function () {
    var enabled = this.data.userinfo.vip.enabled,
      expire_time = app.datamodel.userinfo.vip.expire_time;
    if (enabled.length != 0 && expire_time) {
      var unixTimestamp = new Date(expire_time * 1000);
      var commonTime = unixTimestamp.toLocaleString();
      this.setData({
        expire_time: commonTime
      })
    }

    for (var i = 0, len = enabled.length; i < len; i++) {
      if (enabled[i].memberid == 40) {
        this.setData({
          isL40: true
        })
      }
      else if (enabled[i].memberid == 20) {
        this.setData({
          isL20: true
        })
      }
      else if (enabled[i].memberid == 12) {
        this.setData({
          isL12: true
        })
      }
    }
  },

  // 登录检验
  checkLogin: function () {
    if (!this.data.isLogin) {
      login.jumpLogin();
      return;
    }
  },

  // 切换账号
  jumpLogin: function () {
    login.jumpLogin();
  },

  // 退出登录
  loginOut: function () {
    var h = '/user/logout/?bc=https://vip.wps.cn/wap/pay/member';
    if (location.host == 'vip.docer.com') {
      h = h + location.search;
    } else {
      var cu = window.location.href;
      cu = decodeURIComponent(decodeURIComponent(cu));
      cu = encodeURIComponent(cu);
      h = '/user/logout/?bc=' + cu;
    }
    window.location.href = h;
  },

  /**
   * [selectCard 选取会员类型]
   * @param  {[Number]} mapId [会员类型id，12=稻壳会员，20=wps会员，40=超级会员]
   */
  selectCard: function (mapId) {

    if (mapId == this.data.cardSelected) {
      return;
    }
    // this.data.monthList = [];

    // this.data.monthList = this.data._dataMap[mapId];

    var monthList = this.data._dataMap[mapId];

    // 连续包月判断
    if (this.data.contractMap[mapId] == true) {
      for (var i = 0, len = monthList.length; i < len; i++) {
        if (monthList[i].monthNum == undefined) {
          monthList.splice(i);
          return false
        }
      }
    }

    this.setData({
      monthList: monthList
    })

    this.data.cardSelected = mapId;

    // 默认选中第一个
    this.selectPack();

    this.setData({
      showDuration: false,
      showMonthEstaSelect: false,
      selectIndex: 0
    })
  },

  /**
   * [selectPack 选中套餐]
   * @param  {[Number]} index     [套餐下标]
   * @param  {[String]} packPrice [套餐价格]
   * @param  {[Boolean]} fromDuration [是否从开通时长进来的，默认为否]
   * @return {[type]}           [description]
   */
  selectPack: function (event) {
    var index = 0;
    if (event) {
      var dataset = event.currentTarget.dataset,
        index = dataset.index || 0,
        packPrice = dataset.packPrice,
        fromDuration = dataset.fromDuration;
      this.cnzzCollect('切换月份');

      if (dataset.fromDuration) {
        this.data.showMonthEsta = false;
        this.data.showMonthEstaSelect = true;
        this.data.showDuration = false;
      }
    }


    // var data = $.extend(true, {}, this.data.monthList.$model[index]);

    var TempList = [].concat(this.data.monthList);
    var data = TempList[index];

    this.data.selectMonthData = data;

    this.data.selectIndex = index;

    // 重置优惠券下标
    this.data.couponSelectIndex = 0;

    if (this.data.hasUsableCoupon) {
      this.data.hasUsableCoupon = false;
    }
    if (packPrice) {
      this.data.packPrice = +packPrice;
    }

    // 连续包月
    if (!this.data.monthList[index].monthNum) {
      this.data.packPrice = 0;
    } else {
      this.data.packPrice = this.data.monthList[index].totalUnitPrice;
    }


    // 登录了才拉取优惠券列表
    if (this.data.isLogin) {
      this._getCouponList();
    } else {
      this._couculatePay();
    }

    this.setData({
      selectMonthData: this.data.selectMonthData,
      showMonthEsta: this.data.showMonthEsta,
      showMonthEstaSelect: this.data.showMonthEstaSelect,
      showDuration: this.data.showDuration,
      selectIndex: this.data.selectIndex,
      couponSelectIndex: this.data.couponSelectIndex,
      packPrice: this.data.packPrice,
    })
  },

  /**
   * [selectCoupon 选中优惠券]
   * @param  {[Number]} idnex [选中的优惠券下标]
   * @param  {[String]} min_pay [满多少]
   * @param  {[String]} price [减多少]
   * @param  {[String]} price [优惠券sn码]
   */
  selectCoupon: function (event, index, min_pay, price, couponSn) {
    var dataset = event.currentTarget.dataset,
      index = dataset.index,
      min_pay = dataset.min_pay,
      price = dataset.price,
      couponSn = dataset.couponSn;

    if (+min_pay > +this.data.packPrice) {
      return;
    }

    this.setData({
      couponSelectIndex: index,
      par_min_pay: min_pay,
      par_price: price,
      showCoupon: false,
      couponSn: couponSn
    })
    this._couculatePay();
  },

  // 计算支付价格及节省的钱
  _couculatePay: function () {
    // 设置支付价格
    if (this.data.selectMonthData.totalPrice) {
      //非连续包月
      this.data.payPrice = this.data.selectMonthData.totalUnitPrice;
      // 省多少钱
      this.data.saveMoney = this.data.selectMonthData.totalPrice - this.data.selectMonthData.totalUnitPrice;
    } else {
      //连续包月
      this.data.payPrice = this.data.selectMonthData.originPrice;
      // 省多少钱
      this.data.saveMoney = 0.0;
    }

    // 有用优惠券
    if (this.data.selectMonthData.hasusablecoupon && this.data.hasUsableCoupon) {
      this.data.payPrice = this.data.payPrice - this.data.par_price;
      this.data.saveMoney = this.data.saveMoney + +this.data.par_price;
    }

    this.setData({
      payPrice: (+this.data.payPrice).toFixed(1),
      saveMoney: this.data.saveMoney.toFixed(1)
    })

  },

  /**
   * [setValue 设置值]
   * @param {[String]} key [键名]
   * @param {[String]} val [键值]
   */
  setValue: function (event) {
    var dataset = event.currentTarget.dataset;
    this.setData(dataset)

    if (dataset.showDuration) {
      this.cnzzCollect('点击其他月份')
    }
  },

  // 获取支付相关配置信息
  _getConfig: function () {
    wx.request({
      url: 'https://vipapi.wps.cn/pay_config/v1/config/member',
      data: {
        csource: 'vip',
        payconfig: 'vip'
      },
      success: function(res) {
        var resp = res.data;
        if (resp.result == 'ok') {
          var data = resp.data;
          this.setData({
            _configData: data
          })
          app.uniform_pay_config = data;
          this._struData();
        }
      }.bind(this)
    })    
  },

  /**
 * [_couponDereplication 优惠券列表数据去重]
 * @param  {[Array]} dataArray [待去重的优惠券列表]
 */
  _couponDereplication: function (dataArray) {
    var arr = [];
    this.data.couponList = [];
    this.data.hasUsableCoupon = false;
    for (var i = 0, len = dataArray.length; i < len; i++) {
      var v = dataArray[i];
      if (inArray(v.name, arr) == -1) {
        if (!this.data.hasUsableCoupon && +v.params.min_pay < +this.data.packPrice) {
          this.data.hasUsableCoupon = true;
        }
        arr.push(v.name);
        this.data.couponList.push(v);
      }
    }

    if (this.data.hasUsableCoupon) {
      this.data.par_min_pay = +this.data.couponList[0].params.min_pay;
      this.data.par_price = +this.data.couponList[0].params.price;
    }

    this.setData({
      hasUsableCoupon: this.data.hasUsableCoupon,
      par_min_pay: this.data.par_min_pay,
      par_price: this.data.par_price,
      couponList: this.data.couponList
    })

    this._couculatePay();
  },

  // 获取支付优惠券列表的
  _getCouponList: function () {
    var that = this;
    wx.request({
      url: 'https://vip.wps.cn/coupon/member/usablelist',
      data: {
        price: +this.data.packPrice
      },
      header: {
        'sid': app.sid
      },
      success: function (res) {
        var resp = res.data;
        if (resp.result == 'ok') {
          that._couponDereplication(resp.data.data);
        }
      }
    })
  },

  // 开通月份数据组装
  _struData: function () {
    var type = this.data._configData.type,
      n, k;

    for (var i = 0, tlen = type.length; i < tlen; i++) {
      n = type[i];
      for (var j = 0, jlen = type[i].time.length; j < jlen; j++) {
        var data = {};
        k = n.time[j];
        if (k == 'contract' || k == 'random') {
          data = {
            unitPrice: (n.discount[k].total_fee).toFixed(1), //次月折扣价
            originPrice: (n.discount[k].cost_fee).toFixed(1), //首月原价
            hasusablecoupon: inArray(k, [].concat(n.enable_coupon)) != -1
          };
        } else {
          data = {
            monthNum: k,
            unitPrice: (n.discount[k].total_fee / k).toFixed(1), //每月折扣价
            totalUnitPrice: n.discount[k].total_fee.toFixed(1), //总折扣价
            totalPrice: n.discount[k].cost_fee.toFixed(1), //总原价
            hasusablecoupon: inArray(k, [].concat(n.enable_coupon)) != -1
          };
        }

        this.data._dataMap[n.id].push(data);
      }
    }

    // 初始化轮播插件，并指定显示某一会员卡片
    //this._swiper(this.data._configData.defaultconfig.id);
    this.selectCard(this.data._configData.defaultconfig.id);
  },

  /**
   * [openLink 打开链接]
   * @param  {[String]} url [链接地址]
   * @param  {[Boolean]} delay [是否要进行延时跳转，默认否]
   * @param  {[Boolean]} isSelf [是否_self方式打开]
   */
  openLink: function (url, delay, isSelf) {
    if (delay && delay === true) {
      setTimeout(function () {
        if (isSelf && isSelf === true) {
          location.href = url
        } else {
          open(url);
        }
      }, 500);
    }
  },

  /**
   * [cnzzCollect cnzz信息收集]
   * @param  {[String]} action [动作]
   */
  cnzzCollect: function (action) {
    // collect.pushCNZZ('H5支付', action);
  },

  //gotoPay 前去支付]
  gotoPay: function () {

    this.cnzzCollect('点击前往支付');
    var payway = 'wx_wap';

    // 非微信浏览器
    // if (!this.is_weixn()) {
    //   payway = 'alipay_wap';
    //   this.cnzzCollect('选择支付宝支付');
    // } else {
    //   payway = 'wx_wap';
    //   this.cnzzCollect('选择微信支付');
    // }

    // 为收集，做的延时处理
    var that = this;
    setTimeout(function () {
      if (!that.data.isLogin) {
        login.jumpLogin();
        return;
      }

      that.data.payway = payway;
      var datamodel = app.datamodel;
      var contract = that.data.selectMonthData.monthNum ? 0 : 1;
      var remark = {
        // openid: app.datamodel.openid
        openid: 'oY73-trNNEGcC8Mlekew7NXda_g0'
      }
      var csource = 'vip';
      var payconfig = '';
      // var csource = util.getQueryStringRegExp('csource') || 'vip';
      // var payconfig = util.getQueryStringRegExp('payconfig');
      var data = {
        memtype: that.data.cardSelected,
        count: that.data.selectMonthData.monthNum ? that.data.selectMonthData.monthNum * 31 : 31,
        payway: that.data.payway,
        prepay: 0,
        remark: datamodel ? JSON.stringify(remark) : '',
        contract: contract,
        sn: (that.data.couponList.length > 0 && that.data.hasUsableCoupon && that.data.selectMonthData.hasusablecoupon) ? that.data.couponList[that.data.couponSelectIndex].sn : '',
        csource: csource,
        payconfig: payconfig,
        apiversion: 2
      };

      if (payway == 'alipay_wap') {

        var aliPayLink = 'https://vip.wps.cn/pay/webpay?memtype=' + data.memtype + '&count=' + data.count + '&payway=' + data.payway + '&prepay=0' + '&remark=' + data.remark + '&contract=' + contract + '&sn=' + data.sn + '&csource=' + csource + '&apiversion=2&payconfig=' + payconfig;

        open(aliPayLink);
      }

      else if (payway == 'wx_wap') {

        // 自动续费
        if (contract == 1) {
          var wxPayLink = 'https://vip.wps.cn/pay/webpay?memtype=' + data.memtype + '&count=' + data.count + '&payway=' + data.payway + '&prepay=0' + '&remark=' + data.remark + '&contract=1&sn=' + data.sn + '&csource=' + csource + '&apiversion=2&payconfig=' + payconfig;
          //location.href = wxPayLink;
        } else {
          // 储存当前地址，支付成功后跳转
          //cookie.set('paySuccessCallBackURL', location.href);
          // 调用预支付接口，前端或者后端调用，返回prepay_id、paySign、appid等
          that.H5prepay(data);
        }
      }
    }, 500);
  },

  //调用预支付接口
  H5prepay: function (data) {
    wx.request({
      url: 'https://vip.wps.cn/pay/webpay',
      data: data,
      method: 'POST',
      header: {
        sid: app.sid
      },
      success: function (res) {
        var resp = res.data;
        if (resp.result == 'ok') {
          wx.requestPayment({
            'timeStamp': resp.data.timeStamp + '', //时间戳
            'nonceStr': resp.data.nonceStr, //随机字符串
            'package': resp.data.package, //订单详情扩展字符串
            'signType': 'MD5', //签名方式
            'paySign': resp.data.paySign, //签名
            'success': function (res) {
            },
            'fail': function (res) {
            }
          })
        }
      }
    })
  },

  /**
   * [isLTV5 判断当前微信版本是否低于5.0]
   * @return {Boolean} [true=低于5.0，false=高于5.0或其他情况]
   */
  isLTV5: function () {
    var arr = [],
      version = '';
    arr = navigator.userAgent.split('/');
    version = arr[arr.length - 1];
    if (+version > 5) {
      return true;
    } else {
      false;
    }
  },

  //查询用户所有的自动续费项目
  getContract: function () {
    var that = this;
    wx.request({
      url: 'https://vip.wps.cn/pay/autorenew/contract',
      header: {
        'sid': app.sid
      },
      success: function (res) {
        var resp = res.data;
        if (resp.result == 'ok') {
          if (resp.data.length != 0) {
            for (var i = 0, len = resp.data.length; i < len; i++) {
              var j = resp.data[i];
              if (j.subject == 'month_card') {
                that.data.contractMap[12] = true;
              }

              else if (j.subject == 'baiyin') {
                that.data.contractMap[20] = true;
              }

              else if (j.subject == 'baijin') {
                that.data.contractMap[40] = true;
              }
            }
          }

          // 获取支付相关配置信息
          that._getConfig();
        }
      }
    })

  },

  //是否是小米pad且为UC浏览器
  _is_MIPad: function () {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('mi pad') != -1 && ua.indexOf('ucbrowser') != -1) {
      return true;
    } else {
      return false;
    }
  },

  //安卓手机中支付宝页面兼容
  _isAndroidAplipay: function () {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('android') != -1 && ua.indexOf('alipayclient') != -1) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * [_swiper 轮播]
   * @param  {[Number]} levelId [等级id]
   */
  _swiper: function (levelId) {
    var map = {
      0: 20,
      1: 12,
      2: 40,
      20: 0,
      12: 1,
      40: 2
    };
    // 初始化
    this.selectCard(levelId);

    var mySwiper = new Swiper('.swiper-container', {
      slideToClickedSlide: true,
      initialSlide: levelId ? map[levelId] : 0,
      onSlideChangeEnd: function (swiper) {
        // 切换会员收集
        this.cnzzCollect('切换会员类型');
        this.selectCard(map[swiper.activeIndex]);
        this.data.activeIndex = swiper.activeIndex;
        this.data.showMonthEsta = true;
      }
    });
  },

  slideChange: function (event) {
    var map = {
      0: 20,
      1: 12,
      2: 40,
      20: 0,
      12: 1,
      40: 2
    };
    // 切换会员收集
    this.cnzzCollect('切换会员类型');
    this.selectCard(map[event.detail.current]);

    this.setData({
      activeIndex: event.detail.current,
      showMonthEsta: true
    })
  },

  //点击缓冲
  isRepeatClick: function () {

    this.gotoPay();
    return;

    var cookie = document.cookie;

    var cookieArr = document.cookie.split(";");

    var reClick = false;


    for (var i = 0, len = cookieArr.length; i < len; i++) {
      if (cookieArr[i].indexOf("reClick=") != -1) {
        reClick = true;
      }
    }

    // 5秒的点击缓冲
    if (!reClick) {
      var d = new Date();
      d.setTime(d.getTime() + (5 * 1000));
      var expires = "expires=" + d.toGMTString();
      var reClick = '123'
      document.cookie = "reClick=" + reClick + '; ' + expires;

      this.gotoPay();
    } else {

    }
  },

  //点击使用优惠券
  useCoupon: function () {
    var that = this;
    //登录校验
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        if (that.data.couponList.length > 0 && that.data.hasUsableCoupon && that.data.selectMonthData.hasusablecoupon) {
          that.setData({
            showCoupon: true
          })
          //that.data.cnzzCollect('点击优惠券')
        }
      },
      fail: function () {
        //登录态过期
        //wx.login() //重新登录
      }
    })
  },

  onLoad: function () {


    // wx.request({
    //   url: 'https://vip.wps.cn/userinfo',
    //   header: {
    //     'sid': app.sid
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })

    wx.login({
      success: function (res) {
        // console.log(res);
        if (res.code) {
          //发起网络请求
          // wx.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session',
          //   data: {
          //     appid: 'wxe66629a225dbd0ef',
          //     secret: '02b1c831acdca2f351f01dc56f3fc630',
          //     js_code: res.code,
          //     grant_type: 'authorization_code'
          //   },
          //   success: function (res) {
          //     console.log(res.data)
          //   }
          // })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });

    //初始化
    this._init()


    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})
