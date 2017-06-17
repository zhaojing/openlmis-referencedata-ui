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

    service.$inject = ['facilityFactory', 'programService', 'localStorageFactory', 'authorizationService', '$q', '$filter', 'REQUISITION_RIGHTS', 'facilityService'];

    function service(facilityFactory, programService, localStorageFactory, authorizationService, $q, $filter, REQUISITION_RIGHTS, facilityService) {
        var userId, promises, data,
            HOME_FACILITY = 'homeFacility',
            HOME_PROGRAMS = 'homePrograms',
            SUPERVISED_PROGRAMS = 'supervisedPrograms'

        this.load = load;
        this.clear = clear;
        this.isHomeFacilityReady = isReady(HOME_FACILITY);
        this.areHomeProgramsReady = isReady(HOME_PROGRAMS);
        this.areSupervisedProgramsReady = isReady(SUPERVISED_PROGRAMS);
        this.areFacilitiesReady = isReady();
        this.getHomeFacility = get(HOME_FACILITY);
        this.getHomePrograms = get(HOME_PROGRAMS);
        this.getSupervisedProgram = get(SUPERVISED_PROGRAMS);
        this.getFacilities = get();

        function load() {
            userId = authorizationService.getUser().user_id;
            promises = {};
            data = {};

            cache(HOME_FACILITY, facilityFactory.getUserHomeFacility());

            var promise = $q.all([
                cache(HOME_PROGRAMS, programService.getUserPrograms(userId, true)),
                cache(SUPERVISED_PROGRAMS, programService.getUserPrograms(userId, false))
            ]).then(function(programLists) {
                angular.forEach($filter('unique')(
                    programLists[0].concat(programLists[1]), 'id'
                ), cacheFacilities);
            });
        }

        function clear() {
            data = undefined;
            promises = undefined;
            userId = undefined;
        }

        function cache(name, promise) {
            promises[name] = promise

            promise.then(function(result) {
                data[name] = result;
                promises[name] = undefined;
            });

            return promise;
        }

        function get(name) {
            return function(id) {
                if (!id) id = name;
                return promises[id] ? promises[id] : data[id];
            };
        }

        function isReady(name) {
            return function(id) {
                return !promises[id ? id : name];
            };
        }

        function cacheFacilities(program) {
            var facilityPromises = getFacilityListsPromises(program.id);

            if(facilityPromises.length > 0) {
                var deferred = $q.defer();

                cache(program.id, deferred.promise);

                $q.all(facilityPromises).then(function (facilityList) {
                    var facilities;

                    if(promises.length > 1) {
                        facilities = facilityList[0].concat(facilityList[1]);
                    } else {
                        facilities = facilityList[0];
                    }

                    deferred.resolve(facilities);
                }, deferred.reject);
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
