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
     * @ngdoc service
     * @name admin-supply-partner-add.AdminSupplyPartnerAddService
     *
     * @description
     * Prepared Supply Partner object to be displayable by the Add Supply Partner page.
     */
    angular
        .module('admin-supply-partner-add')
        .factory('AdminSupplyPartnerAddService', AdminSupplyPartnerAddService);

    AdminSupplyPartnerAddService.$inject = [
        'SupplyPartner', 'SupplyPartnerRepository', 'loadingModalService', 'stateTrackerService',
        'notificationService', '$q', 'confirmService', 'messageService', '$state'
    ];

    function AdminSupplyPartnerAddService(SupplyPartner, SupplyPartnerRepository, loadingModalService,
                                          stateTrackerService, notificationService, $q, confirmService,
                                          messageService, $state) {

        AdminSupplyPartnerAddService.prototype.initSupplyPartner = initSupplyPartner;

        return AdminSupplyPartnerAddService;

        function AdminSupplyPartnerAddService() {
            this.repository = new SupplyPartnerRepository();
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-add.AdminSupplyPartnerAddService
         * @name createSupplyPartner
         *
         * @description
         * Creates an empty Supply Partner object with methods decorated with loading modal, confirmation modal and
         * notifications.
         *
         * @return {SupplyPartner}     the new Supply Partner
         */
        function initSupplyPartner() {
            var supplyPartner = new SupplyPartner({}, this.repository);
            decorateCreate(supplyPartner);

            return $q.resolve(supplyPartner);
        }

        function decorateCreate(supplyPartner) {
            var originalCreate = supplyPartner.create;

            supplyPartner.create = function() {
                loadingModalService.open();
                return originalCreate.apply(supplyPartner, arguments)
                    .then(function(supplyPartner) {
                        notificationService.success('adminSupplyPartnerAdd.message.supplyPartnerHasBeenSaved');
                        stateTrackerService.goToPreviousState();
                        return supplyPartner;
                    })
                    .then(function(supplyPartner) {
                        var confirmMessage = messageService
                            .get('adminSupplyPartnerAdd.message.doYouWantToAddAssociations');

                        return confirmService.confirm(confirmMessage,
                            'adminSupplyPartnerAdd.button.yesAddAssociation',
                            'adminSupplyPartnerAdd.button.no')
                            .then(function() {
                                $state.go('openlmis.administration.supplyPartners.edit', {
                                    id: supplyPartner.id
                                });

                                return supplyPartner;
                            })
                            .catch(function() {
                                return supplyPartner;
                            });
                    })
                    .catch(function(error) {
                        notificationService.error('adminSupplyPartnerAdd.message.failedToSaveSupplyPartner');
                        return $q.reject(error);
                    })
                    .finally(function() {
                        loadingModalService.close();
                    });
            };
        }

    }

})();
