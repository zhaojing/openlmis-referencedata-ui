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
     * @name admin-supply-partner-edit.controller:SupplyPartnerEditController
     *
     * @description
     * Controller for managing supply partner edit screen.
     */
    angular
        .module('admin-supply-partner-edit')
        .controller('SupplyPartnerEditController', controller);

    controller.$inject = ['$state', 'supplyPartner', 'associations', 'viewItemsModalService'];

    function controller($state, supplyPartner, associations, viewItemsModalService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToSupplyPartnerList = goToSupplyPartnerList;
        vm.viewFacilities = viewFacilities;
        vm.viewOrderables = viewOrderables;

        /**
         * @ngdoc property
         * @propertyOf admin-supply-partner-edit.controller:SupplyPartnerEditController
         * @name supplyPartner
         * @type {Object}
         *
         * @description
         * Contains supply partner object.
         */
        vm.supplyPartner = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-supply-partner-edit.controller:SupplyPartnerEditController
         * @name associations
         * @type {Array}
         *
         * @description
         * Contains paginated list of all associations of supply partner object.
         */
        vm.associations = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-supply-partner-edit.controller:SupplyPartnerEditController
         * @name associationsPage
         * @type {Array}
         *
         * @description
         * Contains current page of associations.
         */
        vm.associationsPage = undefined;

        /**
         * @ngdoc method
         * @propertyOf admin-supply-partner-edit.controller:SupplyPartnerEditController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating SupplyPartnerEditController.
         */
        function onInit() {
            vm.supplyPartner = supplyPartner;
            vm.associations = associations;
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.controller:SupplyPartnerEditController
         * @name goToSupplyPartnerList
         *
         * @description
         * Redirects to supply partner list screen.
         */
        function goToSupplyPartnerList() {
            $state.go('^', {}, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.controller:SupplyPartnerEditController
         * @name viewFacilities
         *
         * @description
         * Shows associated facilities.
         */
        function viewFacilities(associationIndex) {
            return viewItemsModalService.show({
                titleLabel: 'adminSupplyPartnerEdit.associatedFacilities',
                items: vm.associations[associationIndex].facilities
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.controller:SupplyPartnerEditController
         * @name viewOrderables
         *
         * @description
         * Shows associated orderables.
         */
        function viewOrderables(associationIndex) {
            return viewItemsModalService.show({
                titleLabel: 'adminSupplyPartnerEdit.associatedProducts',
                items: vm.associations[associationIndex].orderables
            });
        }
    }
})();
