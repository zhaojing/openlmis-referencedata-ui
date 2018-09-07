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

describe('Facility service minimal decorator', function() {

    var facilityService, $rootScope, originalGetAllMinimalSpy, LocalDatabase, MinimalFacilityDataBuilder,
        minimalFacilities, $q;

    beforeEach(function() {
        angular.module('test-utils', ['referencedata-facility'])
            .config(function($provide) {
                $provide.decorator('facilityService', function($delegate) {
                    originalGetAllMinimalSpy = jasmine.createSpy('originalGetAllMinimal');
                    $delegate.getAllMinimal = originalGetAllMinimalSpy;
                    return $delegate;
                });
            });

        module('test-utils');
        module('referencedata-facilities-cache');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            facilityService = $injector.get('facilityService');
            LocalDatabase = $injector.get('LocalDatabase');
            MinimalFacilityDataBuilder = $injector.get('MinimalFacilityDataBuilder');
        });

        minimalFacilities = [
            new MinimalFacilityDataBuilder().build(),
            new MinimalFacilityDataBuilder().build(),
            new MinimalFacilityDataBuilder().build()
        ];

        spyOn(LocalDatabase.prototype, 'putAll');
        spyOn(LocalDatabase.prototype, 'getAll');
        spyOn(LocalDatabase.prototype, 'get');
        spyOn(LocalDatabase.prototype, 'removeAll');
    });

    describe('cacheAllMinimal', function() {

        var fetchDeferred, removeDeferred, putDeferred;

        beforeEach(function() {
            originalGetAllMinimalSpy.andReturn($q.resolve(minimalFacilities));
            LocalDatabase.prototype.removeAll.andReturn($q.resolve());
            LocalDatabase.prototype.putAll.andReturn($q.resolve());
        });

        it('should cache on the first call', function() {
            //the calls order is important thus using deferred instead of $q.resolve and $q.reject
            fetchDeferred = $q.defer();
            removeDeferred = $q.defer();
            putDeferred = $q.defer();

            LocalDatabase.prototype.putAll.andReturn(putDeferred.promise);
            LocalDatabase.prototype.removeAll.andReturn(removeDeferred.promise);

            originalGetAllMinimalSpy.andReturn(fetchDeferred.promise);

            var success;
            facilityService.cacheAllMinimal()
                .then(function() {
                    success = true;
                });
            $rootScope.$apply();

            expect(originalGetAllMinimalSpy).toHaveBeenCalled();
            expect(LocalDatabase.prototype.removeAll).not.toHaveBeenCalled();
            expect(LocalDatabase.prototype.putAll).not.toHaveBeenCalled();

            fetchDeferred.resolve(minimalFacilities);
            $rootScope.$apply();

            expect(LocalDatabase.prototype.removeAll).toHaveBeenCalled();
            expect(LocalDatabase.prototype.putAll).not.toHaveBeenCalled();

            removeDeferred.resolve();
            $rootScope.$apply();

            expect(LocalDatabase.prototype.putAll).toHaveBeenCalledWith(minimalFacilities);

            expect(success).toBeUndefined();

            putDeferred.resolve();
            $rootScope.$apply();

            expect(success).toBe(true);
        });

        it('should reject if fetching fails', function() {
            originalGetAllMinimalSpy.andReturn($q.reject());

            var rejected;
            facilityService.cacheAllMinimal()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

        it('should reject if database fails to clear', function() {
            LocalDatabase.prototype.removeAll.andReturn($q.reject());

            var rejected;
            facilityService.cacheAllMinimal()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

        it('should reject if database fails to save', function() {
            LocalDatabase.prototype.putAll.andReturn($q.reject());

            var rejected;
            facilityService.cacheAllMinimal()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

        it('should attempt to fetch the facilities if the first attempt fails', function() {
            LocalDatabase.prototype.putAll.andReturn($q.reject());

            facilityService.cacheAllMinimal();
            $rootScope.$apply();

            LocalDatabase.prototype.putAll.andReturn($q.resolve());

            var success;
            facilityService.cacheAllMinimal()
                .then(function() {
                    success = true;
                });
            $rootScope.$apply();

            expect(success).toBe(true);
        });

        it('should not fetch data twice for following requests', function() {
            facilityService.cacheAllMinimal();

            originalGetAllMinimalSpy.reset();

            var success;
            facilityService.cacheAllMinimal()
                .then(function() {
                    success = true;
                });
            $rootScope.$apply();

            expect(success).toBe(true);
            expect(originalGetAllMinimalSpy).not.toHaveBeenCalled();
        });

        it('should not fetch data if it already is cached', function() {
            facilityService.cacheAllMinimal();
            $rootScope.$apply();

            originalGetAllMinimalSpy.reset();

            var success;
            facilityService.cacheAllMinimal()
                .then(function() {
                    success = true;
                });
            $rootScope.$apply();

            expect(success).toBe(true);
            expect(originalGetAllMinimalSpy).not.toHaveBeenCalled();
        });

        it('should re-fetch the data after re-logging', function() {
            facilityService.cacheAllMinimal();
            $rootScope.$apply();

            originalGetAllMinimalSpy.reset();

            facilityService.clearMinimalFacilitiesCache();
            $rootScope.$apply();

            var success;
            facilityService.cacheAllMinimal()
                .then(function() {
                    success = true;
                });
            $rootScope.$apply();

            expect(success).toBe(true);
            expect(originalGetAllMinimalSpy).toHaveBeenCalled();
        });

    });

    describe('getAllMinimal', function() {

        beforeEach(function() {
            spyOn(facilityService, 'cacheAllMinimal').andReturn($q.resolve());
            LocalDatabase.prototype.getAll.andReturn($q.resolve(minimalFacilities));
        });

        it('should return cached facilities', function() {
            var result;
            facilityService.getAllMinimal()
                .then(function(minimalFacilities) {
                    result = minimalFacilities;
                });
            $rootScope.$apply();

            expect(result).toEqual(minimalFacilities);
        });

        it('should reject if caching fails', function() {
            facilityService.cacheAllMinimal.andReturn($q.reject());

            var rejected;
            facilityService.getAllMinimal()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
            expect(facilityService.cacheAllMinimal).toHaveBeenCalled();
        });

    });

    describe('getMinimal', function() {

        beforeEach(function() {
            spyOn(facilityService, 'cacheAllMinimal').andReturn($q.resolve());
            LocalDatabase.prototype.get.andReturn($q.resolve(minimalFacilities[0]));
        });

        it('should return cached facilities', function() {
            var result;
            facilityService.getMinimal()
                .then(function(minimalFacility) {
                    result = minimalFacility;
                });
            $rootScope.$apply();

            expect(result).toEqual(minimalFacilities[0]);
        });

        it('should reject if caching fails', function() {
            facilityService.cacheAllMinimal.andReturn($q.reject());

            var rejected;
            facilityService.getMinimal()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
            expect(facilityService.cacheAllMinimal).toHaveBeenCalled();
        });

    });

    describe('clearMinimalFacilitiesCache', function() {

        it('should clear the database', function() {
            LocalDatabase.prototype.removeAll.andReturn($q.resolve());

            facilityService.clearMinimalFacilitiesCache();

            expect(LocalDatabase.prototype.removeAll).toHaveBeenCalled();
        });

        it('should resolve once the database is cleared', function() {
            var deferred = $q.defer();
            LocalDatabase.prototype.removeAll.andReturn(deferred.promise);

            var success;
            facilityService.clearMinimalFacilitiesCache()
                .then(function() {
                    success = true;
                });
            $rootScope.$apply();

            expect(success).toBeFalsy();

            deferred.resolve();
            $rootScope.$apply();

            expect(success).toBe(true);
        });

        it('should reject if database fail to clear', function() {
            LocalDatabase.prototype.removeAll.andReturn($q.reject());

            var rejected;
            facilityService.clearMinimalFacilitiesCache()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

});