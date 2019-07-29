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

    angular
        .module('admin-orderable-ftap-edit')
        .config(adminOrderableFtapEditRoutes);

    adminOrderableFtapEditRoutes.$inject = ['modalStateProvider', 'ADMINISTRATION_RIGHTS'];

    function adminOrderableFtapEditRoutes(modalStateProvider, ADMINISTRATION_RIGHTS) {

        modalStateProvider.state('openlmis.administration.orderables.edit.ftaps.edit', {
            controller: 'OrderableAddEditFtapsController',
            controllerAs: 'vm',
            templateUrl: 'admin-orderable-ftap-edit/orderable-ftap-edit.html',
            url: '/:ftapId',
            accessRights: [
                ADMINISTRATION_RIGHTS.FACILITY_APPROVED_ORDERABLES_MANAGE,
                ADMINISTRATION_RIGHTS.ORDERABLES_MANAGE
            ],
            areAllRightsRequired: false,
            parentResolves: ['programs', 'canEdit'],
            resolve: {
                successNotificationKey: function() {
                    return 'adminOrderableFtapEdit.ftapHasBeenUpdatedSuccessfully';
                },
                errorNotificationKey: function() {
                    return 'adminOrderableFtapEdit.failedToUpdateFtap';
                },
                facilityTypeApprovedProduct: function($stateParams, FacilityTypeApprovedProductResource, ftaps) {
                    var ftap = _.findWhere(ftaps, {
                        id: $stateParams.ftapId
                    });

                    return ftap ?
                        angular.copy(ftap) :
                        new FacilityTypeApprovedProductResource().get($stateParams.ftapId);
                },
                facilityTypes: function(FacilityTypeResource) {
                    return new FacilityTypeResource().query()
                        .then(function(facilityTypes) {
                            return facilityTypes.content;
                        });
                },
                programOrderables: function(programs, orderable) {
                    return programs.reduce(function(programOrderables, program) {
                        orderable.programs.forEach(function(programOrderable) {
                            if (programOrderable.programId === program.id) {
                                programOrderables.push(program);
                            }
                        });
                        return programOrderables;
                    }, []);
                }
            }
        });

    }

})();