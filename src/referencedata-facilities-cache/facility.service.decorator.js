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

    // Adds offline cache to minimal facility representation
    // So that minimal can be called, and it will return a list
    // in a promise... screens programmed against this will still
    // work .. even if caching is removed...
    // 
    
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

        function clearCache() {
            minimalFacilitiesCache.clearAll();
        }
    }


})();
