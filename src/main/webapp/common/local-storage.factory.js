(function() {

    'use strict';

    angular
        .module('openlmis-core')
        .factory('localStorageFactory', factory);

    factory.$inject = ['$localStorage'];
    function factory($localStorage) {

        return LocalStorageFactory;

        function LocalStorageFactory(resourceName) {
            if(!$localStorage[resourceName]) $localStorage[resourceName] = {};
            var resource = $localStorage[resourceName],
                storage = {
                    get: get,
                    getAll: getAll,
                    put: put,
                    clearAll: clearAll
                };

            return storage;

            function get(id) {
                return resource[id];
            }

            function getAll() {
                var items = [];
                angular.forEach(resource, function(item) {
                    items.push(item);
                });
                return items;
            }

            function put(item) {
                var index;
                if(!item.id) index = generateIndex();
                else index = item.id;
                resource[index] = item;
                return index;
            }

            function clearAll() {
                $localStorage[resourceName] = {};
                resource = {};
            }

            function generateIndex() {
                var index;
                do {
                    index = Math.random();
                }
                while(resource[index]);
                return index;
            }
        }
    }
})();
