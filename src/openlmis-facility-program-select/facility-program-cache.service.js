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
     * @name openlmis-facility-program-select.facilityProgramCacheService
     *
     * @description
     * Service responsible for caching programs and facilities used by the
     * openlmis-facility-program-select component.
     */
    angular
        .module('openlmis-facility-program-select')
        .service('facilityProgramCacheService', service);

    service.$inject = [
        'facilityFactory', 'programService', 'authorizationService', '$q', '$filter',
        'REQUISITION_RIGHTS', 'facilityService', 'cacheService', 'CACHE_KEYS'
    ];

    function service(facilityFactory, programService, authorizationService, $q, $filter, REQUISITION_RIGHTS,
                     facilityService, cacheService, CACHE_KEYS) {

        var deferred = $q.defer(),
            ready = false,
            modulesWithRights = {};

        this.load = load;
        this.clear = clear;
        this.whenReady = whenReady;
        this.isReady = isReady;
        this.pushRightsForModule = pushRightsForModule;

        /**
         * @ngdoc method
         * @methodOf openlmis-facility-program-select.facilityProgramCacheService
         * @name pushRightsForModule
         *
         * @description
         * Module can load set of rights that will be used to fetch supervised facilities.
         *
         * @param {String} moduleName name that will be used to get specified rights
         * @param {Array}  rightArray array of rights
         */
        function pushRightsForModule(moduleName, rightArray) {
            modulesWithRights[moduleName] = rightArray;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-facility-program-select.facilityProgramCacheService
         * @name load
         *
         * @description
         * Loads all the data required by the component and caches them in memory. The objects that
         * will be stored are home facility, home programs, supervised programs and a list of
         * facility for each program.
         */
        function load() {
            cacheService.cache(CACHE_KEYS.HOME_FACILITY, facilityFactory.getUserHomeFacility());

            var promises = [];
            $q.all(cachePrograms()).then(function(programLists) {
                angular.forEach($filter('unique')(
                    programLists[0].concat(programLists[1]), 'id'
                ), function(program) {
                    var promise = cacheFacilities(program);

                    if (promise) {
                        promises.push(promise);
                    }
                });

                $q.all(promises).then(function() {
                    ready = true;
                    deferred.resolve();
                }, deferred.reject);
            }, deferred.reject);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-facility-program-select.facilityProgramCacheService
         * @name clear
         *
         * @description
         * Removes all the stored data from the memory cache.
         */
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

        /**
         * @ngdoc method
         * @methodOf openlmis-facility-program-select.facilityProgramCacheService
         * @name whenReady
         *
         * @description
         * Returns a promise that resolves when all the required data has been requested. This
         * doesn't necessarily mean that the data has been already downloaded.
         *
         * @return {Promise}    the promise resolved when all data has been requested
         */
        function whenReady() {
            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-facility-program-select.facilityProgramCacheService
         * @name isReady
         *
         * @description
         * Returns information whether all the required data has been requested. This doesn't
         * necessarily mean that the data has been already downloaded.
         *
         * @return {Promise}    the promise resolved when all data has been requested
         */
        function isReady() {
            return ready;
        }

        function cachePrograms() {
            var userId = authorizationService.getUser().user_id;

            if (userId) {
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
        }

        function cacheFacilities(program) {
            var modulesAndPromises = getFacilityListsPromises(program.id);

            if (modulesAndPromises.promises.length > 0) {
                var promise = $q.all(modulesAndPromises.promises);

                cacheService.cache(program.id, promise, function(facilityList) {
                    var facilitiesObject = {};

                    angular.forEach(facilityList, function(facilities, index) {
                        var moduleName = modulesAndPromises.modules[index];

                        if (facilitiesObject[moduleName]) {
                            var uniqueFacilities = $filter('unique')(facilitiesObject[modulesAndPromises.modules[index]].concat(facilities), 'id');
                            facilitiesObject[modulesAndPromises.modules[index]] = uniqueFacilities;
                        } else {
                            facilitiesObject[modulesAndPromises.modules[index]] = facilities;
                        }
                    });

                    return facilitiesObject;
                });

                return promise;
            }

            return $q.when([]);
        }

        function getFacilityListsPromises(programId) {
            var userId = authorizationService.getUser().user_id,
                promises = [],
                modules = [];

            if (userId) {
                angular.forEach(modulesWithRights, function(moduleRights, moduleName) {
                    angular.forEach(moduleRights, function(right) {
                        var rightId = getRightId(right);
                        if (rightId) {
                            modules.push(moduleName);
                            promises.push(facilityService.getUserSupervisedFacilities(
                                userId,
                                programId,
                                rightId
                            ));
                        }
                    });
                });
            }

            return {
                modules: modules,
                promises: promises
            };
        }

        function getRightId(rightName) {
            var right = authorizationService.getRightByName(rightName);
            return right ? right.id : undefined;
        }
    }

})();
