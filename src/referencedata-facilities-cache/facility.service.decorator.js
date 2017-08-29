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
     * @name referencedata-facilities-cache.facilityService
     *
     * @description
     * Decorates methods to the facilityService, making it so the minimal
     * facility list is loaded once.
     */    
    angular.module('referencedata-facilities-cache')
        .config(config);

    config.$inject = ['$provide'];

    function config($provide) {
        $provide.decorator('facilityService', decorator);
    }

    decorator.$inject = ['$delegate', '$q', 'localStorageFactory'];
    function decorator($delegate, $q, localStorageFactory) {
        var originalGetAllMinimal = $delegate.getAllMinimal,
            minimalFacilitiesCache = localStorageFactory('referencedataMinimalFacilities');

            $delegate.getAllMinimal = cachedGetAllMinimal;
            $delegate.clearMinimalFacilitiesCache = clearCache;

        return $delegate;

        /**
         * @ngdoc method
         * @methodOf referencedata-facilities-cache.facilityService
         * @name getAllMinimal
         *
         * @description
         * Gets a minimal representation of all facilities from the
         * referencedata service, which is then stored and only retrived from
         * the user's browser.
         */
        function cachedGetAllMinimal() {
            var cachedFacilities = minimalFacilitiesCache.getAll();

            if(cachedFacilities.length > 0) {
                return $q.resolve(cachedFacilities);
            } else {
                return originalGetAllMinimal.apply($delegate, arguments)
                .then(function(facilities) {
                    facilities.forEach(function(facility) {
                        minimalFacilitiesCache.put(facility);
                    });

                    return facilities;
                });
            }
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-facilities-cache.facilityCacheService
         * @name clearMinimalFacilitiesCache
         *
         * @description
         * Deletes any facilities stored in the user's browser cache.
         */
        function clearCache() {
            minimalFacilitiesCache.clearAll();
        }
    }


})();
