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
     * @name admin-supply-partner-add.controller:SupplyPartnerAddController
     *
     * @description
     * Provides methods for Add Supply Partner modal. Allows returning to previous states and saving
     * supply partner.
     */
    angular
        .module('admin-supply-partner-add')
        .controller('SupplyPartnerAddController', SupplyPartnerAddController);

    SupplyPartnerAddController.$inject = [
        'confirmService', 'SupplyPartnerRepository', 'stateTrackerService', '$state',
        'loadingModalService', 'notificationService', 'messageService'
    ];

    function SupplyPartnerAddController(confirmService, SupplyPartnerRepository, stateTrackerService,
                                        $state, loadingModalService, notificationService,
                                        messageService) {
        var vm = this;

        vm.$onInit = onInit;
        vm.save = save;
        vm.goToPreviousState = stateTrackerService.goToPreviousState;

        /**
         * @ngdoc property
         * @propertyOf admin-supply-partner-add.controller:SupplyPartnerAddController
         * @name supplyPartner
         * @type {Array}
         *
         * @description
         * The following property contains details of supply partner that will be created.
         */
        vm.supplyPartner = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-add.controller:SupplyPartnerAddController
         * @name $onInit
         *
         * @description
         * Initialization method of the SupplyPartnerAddController.
         */
        function onInit() {
            vm.supplyPartner = {};
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-add.controller:SupplyPartnerAddController
         * @name save
         *
         * @description
         * Saves the supply partner and takes user back to the previous state.
         */
        function save() {
            return doSave().then(function(response) {
                var confirmMessage = messageService.get('adminSupplyPartnerAdd.message.doYouWantToAddAssociations');

                confirmService.confirm(confirmMessage,
                    'adminSupplyPartnerAdd.button.yesAddAssociation',
                    'adminSupplyPartnerAdd.button.no').then(function() {
                    $state.go('openlmis.administration.supplyPartners.edit', {
                        id: response.id
                    });
                });
            });
        }

        function doSave() {
            loadingModalService.open();
            return new SupplyPartnerRepository().create(vm.supplyPartner)
                .then(function(supplyPartner) {
                    notificationService.success('adminSupplyPartnerAdd.message.supplyPartnerHasBeenSaved');
                    stateTrackerService.goToPreviousState();
                    return supplyPartner;
                })
                .catch(function() {
                    notificationService.error('adminSupplyPartnerAdd.message.failedToSaveSupplyPartner');
                    loadingModalService.close();
                });
        }
    }

})();
