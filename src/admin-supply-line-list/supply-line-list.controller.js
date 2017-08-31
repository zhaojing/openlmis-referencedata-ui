/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name admin-supply-line-list.controller:SupplyLineListController
     *
     * @description
     * Controller for managing supply line list screen.
     */
    angular
        .module('admin-supply-line-list')
        .controller('SupplyLineListController', controller);

    controller.$inject = ['$state', '$stateParams', 'supplyLines', 'warehouses'];

    function controller($state, $stateParams, supplyLines, warehouses) {
        var vm = this;

        vm.$onInit = onInit;
        vm.search = search;

        /**
         * @ngdoc property
         * @propertyOf admin-supply-line-list.controller:SupplyLineListController
         * @name supplyLines
         * @type {Array}
         *
         * @description
         * Contains filtered supply lines.
         */
        vm.supplyLines = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-supply-line-list.controller:SupplyLineListController
         * @name warehouses
         * @type {Array}
         *
         * @description
         * Contains list of all warehouses.
         */
        vm.warehouses = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-supply-line-list.controller:SupplyLineListController
         * @name supplyingFacility
         * @type {String}
         *
         * @description
         * Contains supplying facility code param for searching supply lines.
         */
        vm.supplyingFacility = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-supply-line-list.controller:SupplyLineListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating SupplyLineListController.
         */
        function onInit() {
            vm.supplyLines = supplyLines;
            vm.warehouses = warehouses;
            vm.supplyingFacility = $stateParams.supplyingFacility;
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-line-list.controller:SupplyLineListController
         * @name search
         *
         * @description
         * Reloads page with new search parameters.
         */
        function search() {
            var stateParams = angular.copy($stateParams);

            stateParams.supplyingFacility = vm.supplyingFacility;

            $state.go('openlmis.administration.supplyLines', stateParams, {
                reload: true
            });
        }
    }

})();