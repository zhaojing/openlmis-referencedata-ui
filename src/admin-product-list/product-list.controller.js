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
     * @name admin-product-list.controller:ProductListController
     *
     * @description
     * Controller for managing product list screen.
     */
	angular
		.module('admin-product-list')
		.controller('ProductListController', controller);

	controller.$inject = ['$state', '$stateParams', 'products', 'programs'];

	function controller($state, $stateParams, products, programs) {
		var vm = this;

        vm.$onInit = onInit;
        vm.search = search;

        /**
         * @ngdoc property
         * @propertyOf admin-product-list.controller:ProductListController
         * @name products
         * @type {Array}
         *
         * @description
         * Contains filtered products.
         */
		vm.products = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-product-list.controller:ProductListController
         * @name programs
         * @type {Array}
         *
         * @description
         * Contains list of all programs.
         */
		vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-product-list.controller:ProductListController
         * @name code
         * @type {String}
         *
         * @description
         * Contains code param for searching products.
         */
		vm.code = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-product-list.controller:ProductListController
         * @name name
         * @type {String}
         *
         * @description
         * Contains name param for searching products.
         */
		vm.name = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-product-list.controller:ProductListController
         * @name program
         * @type {String}
         *
         * @description
         * Contains program code param for searching products.
         */
        vm.program = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-product-list.controller:ProductListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating ProductListController.
         */
        function onInit() {
			vm.products = products;
			vm.programs = programs;
            vm.code = $stateParams.code;
    		vm.name = $stateParams.name;
            vm.program = $stateParams.program;
        }

		/**
         * @ngdoc method
         * @methodOf admin-product-list.controller:ProductListController
         * @name search
         *
         * @description
         * Reloads page with new search parameters.
         */
		function search() {
			var stateParams = angular.copy($stateParams);

			stateParams.code = vm.code;
			stateParams.name = vm.name;
            stateParams.program = vm.program;

			$state.go('openlmis.administration.products', stateParams, {
				reload: true
			});
		}
	}

})();
