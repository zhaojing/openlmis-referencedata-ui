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
        .module('admin-orderable-ftap-add')
        .config(adminOrderableFtapAddRoutes);

    adminOrderableFtapAddRoutes.$inject = ['modalStateProvider', 'ADMINISTRATION_RIGHTS'];

    function adminOrderableFtapAddRoutes(modalStateProvider, ADMINISTRATION_RIGHTS) {

        modalStateProvider.state('openlmis.administration.orderables.edit.ftaps.add', {
            controller: 'OrderableAddEditFtapsController',
            controllerAs: 'vm',
            templateUrl: 'admin-orderable-ftap-add/orderable-ftap-add.html',
            url: '/add',
            accessRights: [
                ADMINISTRATION_RIGHTS.FACILITY_APPROVED_ORDERABLES_MANAGE
            ],
            parentResolves: ['programs', 'canEdit'],
            resolve: {
                successNotificationKey: function() {
                    return 'adminOrderableFtapAdd.ftapHasBeenCreatedSuccessfully';
                },
                errorNotificationKey: function() {
                    return 'adminOrderableFtapAdd.failedToCreateFtap';
                },
                facilityTypeApprovedProduct: function(orderable) {
                    return {
                        orderable: orderable,
                        active: true
                    };
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