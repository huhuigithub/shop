/**
 * @desc   service.
 * @author zhangguangshang 2016//11/29.
 * @update zhangguangshang 2016//11//03.
 */
angular
  .module('mishop')
  .factory('jsonpRequestService', jsonpRequestService);
/**
 *  @method jsonpRequestService.
 *  @params (请求参数).
 *  @return $http.
 *  @author zhangguangshang 2016/11/30.
 *  @update zhangguangshang 2016//11/30.
 */
function jsonpRequestService($http) {
  var doRequest = function (params) {
    return $http({
      method: 'JSONP',
      //url: 'http://192.168.31.142:8080/siep_news_net/searchNews.jsp',
      url: 'http://siep.suzhouluopan.com/wechatSz/select.jsp',
      params: params
    })
  };

  return  {
    http: function (params) {
      return doRequest(params);
    }
  }
}
