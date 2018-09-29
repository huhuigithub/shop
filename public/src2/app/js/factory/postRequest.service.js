/**
 * @desc   post请求
 * @author zhangguangshang on 2016/12/1.
 * @update zhangguangshang on 2016/12/3.
 */
angular
  .module('mishop')
  .factory('postRequestService', postRequestService);
/**
 *  @method postRequestService.
 *  @params (接口地址, 请求参数).
 *  @return $http.
 *  @author zhangguangshang 2016/12/01.
 *  @update zhangguangshang 2016//12/01.
 */
function postRequestService($http) {
  var doRequest = function (data) {
    return $http({
      method: 'POST',
      url: 'http://127.0.0.1:3200/upload',
      params: data,
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
      }
    })
  };

  return {
    http: function (data) {
      return doRequest(data);
    }
  }
}
