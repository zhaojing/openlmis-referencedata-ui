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
     * @name view-items-modal.controller:ViewItemsModalController
     *
     * @description
     * Manages View Items Modal.
     */
    angular
        .module('admin-supply-partner-edit')
        .controller('ViewItemsModalController', controller);

    controller.$inject = ['modalDeferred', 'titleLabel', 'items'];

    function controller(modalDeferred, titleLabel, items) {
        var vm = this;

        vm.$onInit = onInit;
        vm.close = modalDeferred.reject;
        vm.search = search;
        vm.getName = getName;
        vm.getCode = getCode;

        /**
         * @ngdoc property
         * @propertyOf view-items-modal.controller:ViewItemsModalController
         * @name titleLabel
         * @type {Array}
         *
         * @description
         * Holds the label of the modal title.
         */
        vm.titleLabel = undefined;

        /**
         * @ngdoc property
         * @propertyOf view-items-modal.controller:ViewItemsModalController
         * @name items
         * @type {Array}
         *
         * @description
         * Holds a list of available items.
         */
        vm.items = undefined;

        /**
         * @ngdoc property
         * @propertyOf view-items-modal.controller:ViewItemsModalController
         * @name searchText
         * @type {String}
         *
         * @description
         * Holds text entered in product search box.
         */
        vm.searchText = undefined;

        /**
         * @ngdoc method
         * @methodOf view-items-modal.controller:ViewItemsModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the ViewItemsModalController.
         */
        function onInit() {
            vm.titleLabel = titleLabel;
            vm.items = items;
            vm.searchText = '';
            vm.search();
        }

        /**
         * @ngdoc method
         * @methodOf view-items-modal.controller:ViewItemsModalController
         * @name search
         *
         * @description
         * Refreshes the item list so the dialog box shows only relevant items.
         */
        function search() {
            if (vm.searchText) {
                vm.filteredItems = vm.items.filter(searchByCodeAndName);
            } else {
                vm.filteredItems = vm.items;
            }
        }

        function searchByCodeAndName(item) {
            var searchText = vm.searchText.toLowerCase();
            var foundInName = getName(item)
                .toLowerCase()
                .contains(searchText);
            var foundInCode = getCode(item)
                .toLowerCase()
                .startsWith(searchText);

            return foundInName || foundInCode;
        }

        /**
         * @ngdoc method
         * @methodOf view-items-modal.controller:ViewItemsModalController
         * @name getName
         *
         * @description
         * Get the item name.
         *
         * @param {Object} item a single item from the items list.
         */
        function getName(item) {
            return item.name || item.fullProductName;
        }

        /**
         * @ngdoc method
         * @methodOf view-items-modal.controller:ViewItemsModalController
         * @name getCode
         *
         * @description
         * Get the item code.
         *
         * @param {Object} item a single item from the items list.
         */
        function getCode(item) {
            return item.code || item.productCode;
        }

    }

})();
