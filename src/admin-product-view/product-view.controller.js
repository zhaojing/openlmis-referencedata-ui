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
     * @name admin-product-view.controller:ProductViewController
     *
     * @description
     * Controller for managing product view screen.
     */
    angular
        .module('admin-product-view')
        .controller('ProductViewController', controller);

    controller.$inject = ['$state', 'product'];

    function controller($state, product) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToProductList = goToProductList;

        /**
         * @ngdoc property
         * @propertyOf admin-product-view.controller:ProductViewController
         * @name product
         * @type {Object}
         *
         * @description
         * Contains product object.
         */
        vm.product = undefined;

        /**
         * @ngdoc method
         * @propertyOf admin-product-view.controller:ProductViewController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating ProductListController.
         */
        function onInit() {
            vm.product = product;
        }

        /**
         * @ngdoc method
         * @methodOf admin-product-list.controller:ProductListController
         * @name goToProductList
         *
         * @description
         * Redirects to product list screen.
         */
        function goToProductList() {
            $state.go('^', {}, {
                reload: true
            });
        }
    }
})();
