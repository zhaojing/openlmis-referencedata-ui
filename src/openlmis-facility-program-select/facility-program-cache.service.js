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
        .module('openlmis-facility-program-select')
        .service('facilityProgramCacheService', service);

    service.$inject = [
        'facilityFactory', 'programService', 'authorizationService', '$q', '$filter',
        'REQUISITION_RIGHTS', 'facilityService', 'cacheService', 'CACHE_KEYS'
    ];

    function service(facilityFactory, programService, authorizationService, $q, $filter,
                     REQUISITION_RIGHTS, facilityService, cacheService, CACHE_KEYS) {

        var userId;

        this.load = load;
        this.clear = clear;

        function load() {
            userId = authorizationService.getUser().user_id;

            cacheService.cache(CACHE_KEYS.HOME_FACILITY, facilityFactory.getUserHomeFacility());

            $q.all(cachePrograms()).then(function(programLists) {
                angular.forEach($filter('unique')(
                    programLists[0].concat(programLists[1]), 'id'
                ), cacheFacilities);
            });
        }

        function clear() {
            $q.all([
                $q.when(cacheService.get(CACHE_KEYS.HOME_PROGRAMS)),
                $q.when(cacheService.get(CACHE_KEYS.SUPERVISED_PROGRAMS))
            ]).then(function(programLists) {
                angular.forEach($filter('unique')(
                    programLists[0].concat(programLists[1]), 'id'
                ), function(program) {
                    cacheService.clear(program.id);
                });
            });

            cacheService.clear(CACHE_KEYS.HOME_PROGRAMS);
            cacheService.clear(CACHE_KEYS.SUPERVISED_PROGRAMS);
            cacheService.clear(CACHE_KEYS.HOME_FACILITY);
        }

        function cachePrograms() {
            return [
                cacheService.cache(
                    CACHE_KEYS.HOME_PROGRAMS,
                    programService.getUserPrograms(userId, true)
                ),
                cacheService.cache(
                    CACHE_KEYS.SUPERVISED_PROGRAMS,
                    programService.getUserPrograms(userId, false)
                )
            ];
        }

        function cacheFacilities(program) {
            var promises = getFacilityListsPromises(program.id);

            if(promises.length > 0) {
                cacheService.cache(program.id, $q.all(promises), function (facilityList) {
                    var facilities;

                    if(promises.length > 1) {
                        facilities = facilityList[0].concat(facilityList[1]);
                    } else {
                        facilities = facilityList[0];
                    }

                    return facilities;
                });
            }
        }

        function getFacilityListsPromises(programId) {
            var authorizeRightId = getRightId(REQUISITION_RIGHTS.REQUISITION_AUTHORIZE),
                createRightId = getRightId(REQUISITION_RIGHTS.REQUISITION_CREATE),
                promises = [];

            if(createRightId) {
                promises.push(facilityService.getUserSupervisedFacilities(
                    userId,
                    programId,
                    createRightId
                ));
            }
            if(authorizeRightId) {
                promises.push(facilityService.getUserSupervisedFacilities(
                    userId,
                    programId,
                    authorizeRightId
                ));
            }

            return promises;
        }

        function getRightId(rightName) {
            var right = authorizationService.getRightByName(rightName);
            return right ? right.id : undefined;
        }
    }

})();
