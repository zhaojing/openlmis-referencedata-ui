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
     * @name admin-supply-partner-edit.AdminSupplyPartnerEditService
     *
     * @description
     * Prepared Supply Partner object to be displayable by the Edit Supply Partner page.
     */
    angular
        .module('admin-supply-partner-edit')
        .factory('AdminSupplyPartnerEditService', AdminSupplyPartnerEditService);

    AdminSupplyPartnerEditService.$inject = [
        'SupplyPartnerRepository', 'loadingModalService', 'notificationService', '$q', 'confirmService', '$state'
    ];

    function AdminSupplyPartnerEditService(SupplyPartnerRepository, loadingModalService, notificationService, $q,
                                           confirmService, $state) {

        AdminSupplyPartnerEditService.prototype.getSupplyPartner = getSupplyPartner;

        return AdminSupplyPartnerEditService;

        function AdminSupplyPartnerEditService() {
            this.repository = new SupplyPartnerRepository();
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.AdminSupplyPartnerEditService
         * @name getSupplyPartner
         *
         * @description
         * Returns a Supply Partner object with methods decorated with loading modal, confirmation modal and
         * notifications.
         *
         * @param  {string}        id  the ID of the Supply Partner
         * @return {SupplyPartner}     the Supply Partner
         */
        function getSupplyPartner(id) {
            return this.repository.get(id)
                .then(function(supplyPartner) {
                    decorateSave(supplyPartner);
                    decorateRemoveAssociation(supplyPartner);
                    return supplyPartner;
                });
        }

        function decorateSave(supplyPartner) {
            var originalSave = supplyPartner.save;

            supplyPartner.save = function() {
                loadingModalService.open();
                return originalSave.apply(supplyPartner, arguments)
                    .then(function(supplyPartner) {
                        notificationService.success('adminSupplyPartnerEdit.supplyPartnerUpdatedSuccessfully');
                        $state.go('openlmis.administration.supplyPartners', {}, {
                            reload: true
                        });
                        return supplyPartner;
                    })
                    .catch(function(error) {
                        notificationService.error('adminSupplyPartnerEdit.failedToUpdateSupplyPartner');
                        loadingModalService.close();
                        return $q.reject(error);
                    });
            };
        }

        function decorateRemoveAssociation(supplyPartner) {
            return decorateRemovalAction(supplyPartner, {
                actionName: 'removeAssociation',
                confirmMessage: 'adminSupplyPartnerEdit.confirmAssociationRemoval',
                confirmButtonLabel: 'adminSupplyPartnerEdit.removeAssociation'
            });
        }

        function decorateRemovalAction(supplyPartner, config) {
            var originalAction = supplyPartner[config.actionName];
            supplyPartner[config.actionName] = function() {
                var args = arguments;
                return confirmService.confirmDestroy(config.confirmMessage, config.confirmButtonLabel)
                    .then(function() {
                        loadingModalService.open();
                        return originalAction.apply(supplyPartner, args);
                    })
                    .catch(function(error) {
                        return $q.reject(error);
                    })
                    .finally(function() {
                        loadingModalService.close();
                    });
            };
        }

    }

})();