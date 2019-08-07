app.factory("Data", ['$http',// 'toaster',
    function ($http) { //}, toaster) { // This service connects to our REST API

        //var serviceBase1 = '/emon/www/server/'  //no intenet / chrome running only / xampp
        var serviceBase1 = 'https://test-server-shinaska109.c9users.io/testserver/emon/www/server/' //cloud pero di mugana
        //var serviceBase1 = 'http://192.168.0.40/emonitor/www/server/' //local with internet
        
        var obj = {};
        /*
         * obj.toast = function (data) {
         * toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
         * }
         */

        obj.get = function (q) {
            //window.alert("OLAAA at get");
            return $http.get(serviceBase1 + q).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            //window.alert("object: " + object.user_username);
            return $http.post(serviceBase1 + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase1 + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase1 + q).then(function (results) {
                return results.data;
            });
        };
        /*
        obj.loginUser = function (user) {
            window.alert("OLAAA at loginUser: " + user.user_username);
            return $http.post(serviceBase1 + 'login', user).then(function (results) {
                return results.data;
            });
        };
        */

        return obj;
}]);
