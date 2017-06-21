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

describe('facilityProgramCacheService', function() {

    //Could use more tests...

    var facilityProgramCacheService, cacheService, facilityFactory, CACHE_KEYS, $q,
        authorizationService, programService, $rootScope, REQUISITION_RIGHTS, facilityService;

    beforeEach(function() {
        module('openlmis-facility-program-select');

        inject(function($injector) {
            facilityProgramCacheService = $injector.get('facilityProgramCacheService');
            cacheService = $injector.get('cacheService');
            facilityFactory = $injector.get('facilityFactory');
            CACHE_KEYS = $injector.get('CACHE_KEYS');
            $q = $injector.get('$q');
            authorizationService = $injector.get('authorizationService');
            programService = $injector.get('programService');
            $rootScope = $injector.get('$rootScope');
            REQUISITION_RIGHTS = $injector.get('REQUISITION_RIGHTS');
            facilityService = $injector.get('facilityService');
        });
    });

    describe('load', function() {

        var user;

        beforeEach(function() {
            user = {
                user_id: 'user-id'
            };

            spyOn(cacheService, 'cache').andCallFake(function(name, promise) {
                return promise;
            });
            spyOn(authorizationService, 'getUser').andReturn(user);
            spyOn(programService, 'getUserPrograms');
            spyOn(facilityService, 'getUserSupervisedFacilities');
        });

        it('should cache home facility', function() {
            var promise = $q.when();

            spyOn(facilityFactory, 'getUserHomeFacility').andReturn(promise);

            facilityProgramCacheService.load();

            expect(cacheService.cache).toHaveBeenCalledWith(
                CACHE_KEYS.HOME_FACILITY,
                promise
            );
        });

        it('should cache home programs', function() {
            var homePrograms = $q.when(),
                supervisedPrograms = $q.when();

            programService.getUserPrograms.andReturn(homePrograms);

            facilityProgramCacheService.load();

            expect(programService.getUserPrograms).toHaveBeenCalledWith(
                user.user_id,
                true
            );

            expect(cacheService.cache).toHaveBeenCalledWith(
                CACHE_KEYS.HOME_PROGRAMS,
                homePrograms
            );
        });

        it('should cache supervisedPrograms', function() {
            var supervisedPrograms = $q.when();

            programService.getUserPrograms.andReturn(supervisedPrograms);

            facilityProgramCacheService.load();

            expect(programService.getUserPrograms).toHaveBeenCalledWith(
                user.user_id,
                false
            );

            expect(cacheService.cache).toHaveBeenCalledWith(
                CACHE_KEYS.HOME_PROGRAMS,
                supervisedPrograms
            );
        });

    });

});
