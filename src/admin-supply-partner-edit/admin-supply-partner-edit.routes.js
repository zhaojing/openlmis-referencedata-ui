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

    angular.module('admin-supply-partner-edit').config(routes);

    routes.$inject = ['$stateProvider', 'modalStateProvider', 'ADMINISTRATION_RIGHTS'];

    function routes($stateProvider, modalStateProvider, ADMINISTRATION_RIGHTS) {

        $stateProvider.state('openlmis.administration.supplyPartners.edit', {
            label: 'adminSupplyPartnerEdit.viewSupplyPartner',
            url: '/:id',
            accessRights: [ADMINISTRATION_RIGHTS.SUPPLY_PARTNERS_MANAGE],
            views: {
                '@openlmis': {
                    controller: 'SupplyPartnerEditController',
                    templateUrl: 'admin-supply-partner-edit/supply-partner-edit.html',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                supplyPartner: function(AdminSupplyPartnerEditService, $stateParams) {
                    return new AdminSupplyPartnerEditService().getSupplyPartner($stateParams.id);
                },
                associations: function(paginationService, supplyPartner, $stateParams) {
                    return paginationService.registerList(null, $stateParams, function() {
                        return supplyPartner.associations;
                    });
                }
            }
        });

        modalStateProvider.state('openlmis.administration.supplyPartners.edit.association', {
            url: '/assocation?programId&supervisoryNodeId',
            templateUrl: 'admin-supply-partner-edit/association-modal.html',
            controller: 'AssociationModalController',
            controllerAs: 'vm',
            parentResolves: ['supplyPartner'],
            resolve: {
                supplyPartnerAssociationService: function(SupplyPartnerAssociationService) {
                    return new SupplyPartnerAssociationService();
                },
                originalAssociation: function(supplyPartnerAssociationService, $stateParams, supplyPartner) {
                    return supplyPartnerAssociationService.getAssociation(supplyPartner, $stateParams);
                },
                programs: function(programService) {
                    return programService.getAll();
                },
                facilities: function(originalAssociation, supervisoryNodes, supplyPartnerAssociationService) {
                    return supplyPartnerAssociationService.getFacilities(originalAssociation, supervisoryNodes);
                },
                supervisoryNodes: function(SupervisoryNodeResource) {
                    return new SupervisoryNodeResource().getAll();
                },
                orderables: function(supplyPartnerAssociationService, facilities, originalAssociation, programs) {
                    return supplyPartnerAssociationService.getOrderables(originalAssociation, facilities, programs);
                }
            }
        });
    }
})();
