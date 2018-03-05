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
        .module('admin-facility-type-edit')
        .config(routes);

    routes.$inject = ['modalStateProvider', 'ADMINISTRATION_RIGHTS'];

    function routes(modalStateProvider, ADMINISTRATION_RIGHTS) {
        modalStateProvider.state('openlmis.administration.facilityTypes.edit', {
            controller: 'FacilityTypeEditController',
            controllerAs: 'vm',
            templateUrl: 'admin-facility-type-edit/facility-type-edit.html',
            url: '/edit/:id',
            accessRights: [ADMINISTRATION_RIGHTS.FACILITIES_MANAGE],
            resolve: {
                facilityType: function($stateParams, facilityTypeService) {
                    if ($stateParams.id) {
                        return facilityTypeService.get($stateParams.id);
                    }
                    return undefined;
                }
            },
            parentResolves: []
        });
    }
})();
