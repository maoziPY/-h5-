//index.js
//获取应用实例
var app = getApp()
app.datamodel = {
  "openid": "",
  "userinfo": "",
  "uniform_pay_config": {
    "defaultconfig": {
      "advert": "超级会员限时3折",
      "id": 20,
      "payway": "wx_qrcode",
      "random_month": 6,
      "recommendid": 20,
      "service_name": "服务条款",
      "service_url": "https://vip.wps.cn/agreement/",
      "term_name": "查看特权",
      "term_url": "",
      "time": 12
    },
    "discount": {
      "12": [
        {
          "discount": 0.75,
          "max": "contract",
          "mini": "contract"
        },
        {
          "discount": 0.3,
          "max": 999,
          "mini": 12
        },
        {
          "discount": 0.5,
          "max": 11,
          "mini": 6
        },
        {
          "discount": 0.6,
          "max": 5,
          "mini": 3
        },
        {
          "discount": 1,
          "max": 2,
          "mini": 1
        }
      ],
      "20": [
        {
          "discount": 0.46,
          "max": "contract",
          "mini": "contract"
        },
        {
          "discount": 0.35,
          "max": 999,
          "mini": 12,
          "sales": "限时5折"
        },
        {
          "discount": 0.6,
          "max": 11,
          "mini": 6
        },
        {
          "discount": 0.6,
          "max": 5,
          "mini": 3
        },
        {
          "discount": 1,
          "max": 2,
          "mini": 1
        }
      ],
      "40": [
        {
          "discount": 0.7,
          "max": "contract",
          "mini": "contract"
        },
        {
          "discount": 0.35,
          "max": 999,
          "mini": 12,
          "sales": "限时5折"
        },
        {
          "discount": 0.65,
          "max": 5,
          "mini": 3
        },
        {
          "discount": 0.6,
          "max": 11,
          "mini": 6
        }
      ]
    },
    "payway": [
      "zfb_qrcode",
      "wx_qrcode",
      "daomi"
    ],
    "type": [
      {
        "default_time": 12,
        "discount": {
          "1": {
            "angle": "",
            "cost_fee": 15,
            "total_fee": 15
          },
          "3": {
            "angle": "6.5折",
            "cost_fee": 45,
            "total_fee": 29
          },
          "12": {
            "angle": "5折",
            "cost_fee": 180,
            "total_fee": 89
          },
          "24": {
            "angle": "5折",
            "cost_fee": 360,
            "total_fee": 169
          },
          "contract": {
            "angle": "次月6折",
            "cost_fee": 15,
            "total_fee": 9
          }
        },
        "enable_coupon": [
          1,
          3,
          12,
          24
        ],
        "hideMemberComparison": "true",
        "id": 20,
        "name": "WPS会员",
        "payunit": "个月",
        "privilegeHtml": "wpsPrivilegeHtml",
        "privilege_ad": "尊享21项办公特权",
        "property": "WPS会员提供高质量办公服务，尊享21项办公特权！",
        "time": [
          "contract",
          12,
          3,
          24
        ],
        "type": "baiyin",
        "typeunit": "月",
        "unitprice": 15
      },
      {
        "default_time": 12,
        "discount": {
          "1": {
            "angle": "",
            "cost_fee": 20,
            "total_fee": 19.9
          },
          "3": {
            "angle": "6.5折",
            "cost_fee": 60,
            "total_fee": 39.9
          },
          "12": {
            "angle": "5折",
            "cost_fee": 240,
            "total_fee": 119
          },
          "contract": {
            "angle": "推荐",
            "cost_fee": 20,
            "total_fee": 15
          }
        },
        "enable_coupon": [
          12
        ],
        "hideMemberComparison": "true",
        "id": 12,
        "name": "稻壳会员",
        "payunit": "个月",
        "privilege_ad": "模板免费下载",
        "property": "稻壳会员提供优质办公资源，涵盖模板、学习资料等，轻松制霸校园职场！",
        "time": [
          "contract",
          12,
          3,
          1
        ],
        "type": "month_card",
        "typeunit": "月",
        "unitprice": 20
      },
      {
        "angle": "",
        "angle_class": "forsale_rcm",
        "default_time": 12,
        "disable_coupon": [
          12,
          3,
          1,
          "contract"
        ],
        "discount": {
          "1": {
            "angle": "",
            "cost_fee": 30,
            "total_fee": 30
          },
          "3": {
            "angle": "6.5折",
            "cost_fee": 90,
            "total_fee": 59
          },
          "12": {
            "angle": "5折",
            "cost_fee": 360,
            "total_fee": 179
          },
          "contract": {
            "angle": "次月7折",
            "cost_fee": 30,
            "total_fee": 21
          }
        },
        "hideMemberComparison": "true",
        "id": 40,
        "name": "超级会员",
        "payunit": "个月",
        "privilege_ad": "免费下载模板",
        "property": "包含WPS会员和稻壳会员的所有特权！",
        "time": [
          "contract",
          12,
          3,
          1
        ],
        "type": "baijin",
        "typeunit": "月",
        "unitprice": 30
      }
    ]
  },
  "code": ""
}

var login = require('controllers/login.js')


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
    expire_time: app.datamodel.userinfo ? app.datamodel.userinfo.vip.expire_time * 1000 : '',
    // 连续包月
    contractMap: {
      12: false,
      20: false,
      40: false
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  _init: function () {
    this.data.isLogin = login.checkLogin();

    //_checkJump();

    if (this.data.isLogin) {
      // 查询用户所有的自动续费项目
      //getContract();

      // 判断会员等级，显示对应图标
      //_checkLevel();
    }

    if (!this.data.isLogin) {
      // 获取支付相关配置信息
      //_getConfig();
    }

    if (this.data.isLogin) {
      // 获取用户信息
      //_getUserInfo();
    }

    // 页面展示量收集
    // cnzzCollect('页面展示量ALL');
    // cnzzCollect('页面展示量+' + util.getQueryStringRegExp('csource'));
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
    var enabled = this.data.userinfo.vip.enabled;
    if (enabled.length == 0) {
      this.data.expire_time = false;
    }
    avalon.each(enabled, function (i, j) {
      if (j.memberid == 40) {
        this.data.isL40 = true;
      }
      else if (j.memberid == 20) {
        this.data.isL20 = true;
      }
      else if (j.memberid == 12) {
        this.data.isL12 = true;
      }
    })
  },

  // 获取用户信息
  _getUserInfo: function () {
    dataServices.get('vip').getUserinfo({ data: {} }).done(function (resp) {
      if (resp.result == 'ok') {
        this.data.myLevel = resp.data.vip.memberid;
      }
    });
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
    this.data.monthList = [];
    this.data.monthList = this.data._dataMap[mapId];

    // 连续包月判断
    if (this.data.contractMap[mapId] == true) {
      avalon.each(this.data.monthList, function (i, j) {
        if (j.monthNum == undefined) {
          avalon.Array.removeAt(this.data.monthList, i)
          return false
        }
      });
    }

    this.data.cardSelected = mapId;

    // 默认选中第一个
    this.selectPack(0);

    this.data.showDuration = false;
    this.data.showMonthEstaSelect = false;
    this.data.selectIndex = 0;
  },

  /**
   * [selectPack 选中套餐]
   * @param  {[Number]} index     [套餐下标]
   * @param  {[String]} packPrice [套餐价格]
   * @param  {[Boolean]} fromDuration [是否从开通时长进来的，默认为否]
   * @return {[type]}           [description]
   */
  selectPack: function (index, packPrice, fromDuration) {
    var data = $.extend(true, {}, this.data.monthList.$model[index]);
    this.data.selectMonthData = data;

    if (fromDuration && fromDuration === true) {
      this.data.showMonthEsta = false;
      this.data.showMonthEstaSelect = true;
      this.data.showDuration = false;
    }

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
  },

  /**
   * [selectCoupon 选中优惠券]
   * @param  {[Number]} idnex [选中的优惠券下标]
   * @param  {[String]} min_pay [满多少]
   * @param  {[String]} price [减多少]
   * @param  {[String]} price [优惠券sn码]
   */
  selectCoupon: function (index, min_pay, price, couponSn) {
    if (+min_pay > +this.data.packPrice) {
      return;
    }
    this.data.couponSelectIndex = index;
    this.data.par_min_pay = min_pay;
    this.data.par_price = price;
    this.data.showCoupon = false;
    this.data.couponSn = couponSn;
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

  },

  /**
   * [setValue 设置值]
   * @param {[String]} key [键名]
   * @param {[String]} val [键值]
   */
  setValue: function (key, val) {
    model[key] = val
  },

  // 获取支付相关配置信息
  _getConfig: function () {

    var data = app.datamodel.uniform_pay_config;
    this.data._configData = data;
    this._struData();
  },

  // 获取支付优惠券列表的
  // _getCouponList: function () {
  //   var data = {
  //     price: +this.data.packPrice
  //   },
  //     dataServices.get('vip').couponList({ data: data }).done(function (resp) {
  //       if (resp.result == 'ok') {
  //         this._couponDereplication(resp.data.data);
  //       }
  //     });
  // },

  /**
   * [_couponDereplication 优惠券列表数据去重]
   * @param  {[Array]} dataArray [待去重的优惠券列表]
   */
  _couponDereplication: function (dataArray) {
    var arr = [];
    this.data.couponList = [];
    this.data.hasUsableCoupon = false;
    avalon.each(dataArray, function (i, v) {
      if ($.inArray(v.name, arr) == -1) {
        if (!this.data.hasUsableCoupon && +v.params.min_pay < +this.data.packPrice) {
          this.data.hasUsableCoupon = true;
        }
        arr.push(v.name);
        this.data.couponList.push(v);
      }
    });

    if (this.data.hasUsableCoupon) {
      this.data.par_min_pay = +this.data.couponList[0].params.min_pay;
      this.data.par_price = +this.data.couponList[0].params.price;
    }

    this._couculatePay();
  },

  // 开通月份数据组装
  _struData: function () {
    avalon.each(this.data._configData.type, function (i, n) {
      avalon.each(n.time, function (j, k) {
        var data = {};
        if (k == 'contract' || k == 'random') {
          data = {
            unitPrice: (n.discount[k].total_fee).toFixed(1), //次月折扣价
            originPrice: (n.discount[k].cost_fee).toFixed(1), //首月原价
            hasusablecoupon: $.inArray(k, [].concat(n.enable_coupon)) != -1
          };
        } else {
          data = {
            monthNum: k,
            unitPrice: (n.discount[k].total_fee / k).toFixed(1), //每月折扣价
            totalUnitPrice: n.discount[k].total_fee.toFixed(1), //总折扣价
            totalPrice: n.discount[k].cost_fee.toFixed(1), //总原价
            hasusablecoupon: $.inArray(k, [].concat(n.enable_coupon)) != -1
          };
        }

        this.data._dataMap[n.id].push(data);
      });
    });

    // 初始化轮播插件，并指定显示某一会员卡片
    this._swiper(this.data._configData.defaultconfig.id);
  },

  /**
   * [openLink 打开链接]
   * @param  {[String]} url [链接地址]
   * @param  {[Boolean]} delay [是否要进行延时跳转，默认否]
   * @param  {[Boolean]} isSelf [是否_self方式打开]
   */
  openLink: function (url, delay, isSelf) {
    console.log('openlink');
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
    console.log('coolect');
    collect.pushCNZZ('H5支付', action);
  },

  //gotoPay 前去支付]
  gotoPay: function () {

    this.cnzzCollect('点击前往支付');
    var payway = '';

    // 非微信浏览器
    if (!this.data.is_weixn()) {
      payway = 'alipay_wap';
      this.cnzzCollect('选择支付宝支付');
    } else {
      payway = 'wx_wap';
      this.cnzzCollect('选择微信支付');
    }

    // 为收集，做的延时处理
    setTimeout(function () {
      if (!this.data.isLogin) {
        login.jumpLogin();
        return;
      }

      this.data.payway = payway;
      var datamodel = window.datamodel;
      var contract = this.data.selectMonthData.monthNum ? 0 : 1;
      var remark = {
        openid: app.datamodel.openid
      }
      var csource = util.getQueryStringRegExp('csource') || 'vip';
      var payconfig = util.getQueryStringRegExp('payconfig');
      var data = {
        memtype: this.data.cardSelected,
        count: this.data.selectMonthData.monthNum ? this.data.selectMonthData.monthNum * 31 : 31,
        payway: this.data.payway,
        prepay: 0,
        remark: datamodel ? JSON.stringify(remark) : '',
        contract: contract,
        sn: (this.data.couponList.length > 0 && this.data.hasUsableCoupon && this.data.selectMonthData.hasusablecoupon) ? this.data.couponList[this.data.couponSelectIndex].sn : '',
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
          location.href = wxPayLink;
        } else {
          // 储存当前地址，支付成功后跳转
          cookie.set('paySuccessCallBackURL', location.href);
          // 调用预支付接口，前端或者后端调用，返回prepay_id、paySign、appid等
          this.H5prepay(data);
        }
      }
    }, 500);
  },

  //调用预支付接口
  H5prepay: function (data) {
    dataServices.get('vip').wxpay({ data: data }).done(function (resp) {
      if (resp.result == 'ok') {

        this.data.postData = {
          'appId': resp.data.appId, //公众号id
          'timeStamp': resp.data.timeStamp + '', //时间戳
          'nonceStr': resp.data.nonceStr, //随机字符串
          'package': resp.data.package, //订单详情扩展字符串
          'signType': 'MD5', //签名方式
          'paySign': resp.data.paySign, //签名
        };

        // h5准备调起支付API
        onBridgebefore();
      }
    });
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
    dataServices.get('vip').getContract({ data: {} }).done(function (resp) {
      if (resp.result == 'ok') {
        if (resp.data.length != 0) {
          avalon.each(resp.data, function (i, j) {
            if (j.subject == 'month_card') {
              this.data.contractMap[12] = true;
            }

            else if (j.subject == 'baiyin') {
              this.data.contractMap[20] = true;
            }

            else if (j.subject == 'baijin') {
              this.data.contractMap[40] = true;
            }
          });
        }

        // 获取支付相关配置信息
        this._getConfig();
      }
    });
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
        this.data.cnzzCollect('切换会员类型');
        this.data.selectCard(map[swiper.activeIndex]);
        this.data.activeIndex = swiper.activeIndex;
        this.data.showMonthEsta = true;
      }
    });
  },

  //点击缓冲
  isRepeatClick: function () {

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

  onLoad: function () {
    console.log('onLoad')

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
