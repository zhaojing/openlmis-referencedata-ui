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
     * @name select-products-modal.controller:SelectProductsModalController
     *
     * @description
     * Manages Select Products Modal.
     */
    angular
        .module('select-products-modal')
        .controller('SelectProductsModalController', controller);

    controller.$inject = ['orderables', '$state', 'selectProductsModalService', 'external', '$stateParams'];

    function controller(orderables, $state, selectProductsModalService, external, $stateParams) {
        var vm = this;

        vm.$onInit = onInit;
        vm.selectProducts = selectProductsModalService.resolve;
        vm.close = selectProductsModalService.reject;
        vm.search = search;

        /**
         * @ngdoc method
         * @methodOf select-products-modal.controller:SelectProductsModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the SelectProductsModalController.
         */
        function onInit() {
            vm.orderables = orderables;
            vm.selections = selectProductsModalService.getSelections();
            vm.external = external;
            vm.code = $stateParams.code;
            vm.name = $stateParams.name;
        }

        /**
         * @ngdoc method
         * @methodOf select-products-modal.controller:SelectProductsModalController
         * @name search
         *
         * @description
         * Refreshes the product list so the add product dialog box shows only relevant products.
         */
        function search() {
            var stateParams = angular.copy($stateParams);
            stateParams.code = vm.code;
            stateParams.name = vm.name;
            $state.go('.', stateParams, {
                reload: $state.$current.name,
                notify: false
            });
        }

    }

})();
