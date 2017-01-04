(function() {

    "use strict";

    angular.module('openlmis-dashboard').config(routes);

    routes.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routes($stateProvider, $urlRouterProvider) {

        $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'dashboard/home.html',
            priority: 2,
            showInNavigation: true,
            label: 'link.home'
        });

    }

})();
