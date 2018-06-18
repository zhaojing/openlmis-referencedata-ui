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
        .module('admin-facility-programs')
        .config(routes);

    routes.$inject = ['modalStateProvider'];

    function routes(modalStateProvider) {
        modalStateProvider.state('openlmis.administration.facilities.facility.programs', {
            controller: 'FacilityViewController',
            controllerAs: 'vm',
            parentResolves: ['facility'],
            templateUrl: 'admin-facility-programs/facility-programs.html',
            url: '/programs',
            resolve: {
                facilityTypes: function(facilityTypeService) {
                    return facilityTypeService.query({
                        active: true
                    })
                    .then(function(response) {
                        return response.content;
                    });
                },
                geographicZones: function($q, geographicZoneService) {
					          var deferred = $q.defer();

					          geographicZoneService.getAll().then(function(response) {
						            deferred.resolve(response.content);
					          }, deferred.reject);

					          return deferred.promise;
				        },
                facilityOperators: function(facilityOperatorService) {
				            return facilityOperatorService.getAll();
				        },
                programs: function(programService) {
                    return programService.getAll();
                }
            }
        });
    }

})();
