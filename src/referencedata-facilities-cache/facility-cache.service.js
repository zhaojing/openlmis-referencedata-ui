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
     * @name referencedata-facilities-cache.facilityCacheService
     *
     * @description
     * Triggers the facility service to store a minimal list of facilities
     * until the user logs out.
     *
     * This service will stop a state change from happening until the facilites
     * cache has been created.
     */

    angular.module('referencedata-facilities-cache')
        .service('facilityCacheService', service);

    service.$inject = ['$q', '$rootScope', 'localStorageFactory', 'facilityService', '$urlRouter'];

    function service($q, $rootScope, localStorageFactory, facilityService, $urlRouter) {
        var cachingFacilitiesPromise;

        this.initialize = initialize;

        /**
         * @ngdoc method
         * @methodOf referencedata-facilities-cache.facilityCacheService
         * @name initialize
         *
         * @description
         * Sets up listenters for events in the service.
         */
        function initialize() {
            $rootScope.$on('openlmis-auth.login', cacheFacilities);
            $rootScope.$on('openlmis-auth.logout', removeFacilitiesCache);
            $rootScope.$on('$stateChangeStart', pauseIfLoading);
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-facilities-cache.facilityCacheService
         * @name cacheFacilities
         *
         * @description
         * Runs facilityService.getAllMinimal, which has been modified to store
         * the recieved list in the browsers cache.
         *
         * The main part of this function manages a promise, which is used to
         * block state changes while the facility list is being downloaded.
         */
        function cacheFacilities() {
            if(!cachingFacilitiesPromise) {
                cachingFacilitiesPromise = $q.defer();
                facilityService.getAllMinimal()
                .finally(function(){
                    cachingFacilitiesPromise.resolve();
                    cachingFacilitiesPromise = undefined;
                });
            }
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-facilities-cache.facilityCacheService
         * @name removeFacilitiesCache
         *
         * @description
         * Removes the facility cache.
         */
        function removeFacilitiesCache() {
            facilityService.clearMinimalFacilitiesCache();
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-facilities-cache.facilityCacheService
         * @name pauseIfLoading
         *
         * @param {Object} event State change event from $stateChangeStart
         *
         * @description
         * Cancels any state changes while the caching promise is loading. After
         * loading is complete, the browser is directed to the current state.
         */
        function pauseIfLoading(event) {
            if(cachingFacilitiesPromise) {
                event.preventDefault();

                cachingFacilitiesPromise.then(function(){
                    $urlRouter.sync();
                });
            }
        }
    }

})();