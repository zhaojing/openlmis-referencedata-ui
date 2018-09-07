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

    var facilityProgramCacheService, $q, $rootScope, authorizationService, programService,
        facilityService, currentUserService, permissionService, referencedataUser,
        user, loadPromise, programs, facilities;

    beforeEach(function() {
        module('openlmis-facility-program-select');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            facilityProgramCacheService = $injector.get('facilityProgramCacheService');
            authorizationService = $injector.get('authorizationService');
            programService = $injector.get('programService');
            facilityService = $injector.get('facilityService');
            permissionService = $injector.get('permissionService');
            currentUserService = $injector.get('currentUserService');
        });

        user = {
            user_id: 'user-id'
        };

        referencedataUser = {
            homeFacilityId: 'facility-1'
        };

        programs = [
            {
                id: 'program-1',
                name: 'program-1-name'
            },
            {
                id: 'program-2',
                name: 'program-2-name'
            },
            {
                id: 'program-3',
                name: 'program-3-name'
            }
        ];

        facilities = [
            {
                id: 'facility-1',
                name: 'facility-1-name'
            },
            {
                id: 'facility-2',
                name: 'facility-2-name'
            }
        ];

        var permissions = [
            {
                right: 'right-1',
                programId: 'program-1',
                facilityId: 'facility-1'
            },
            {
                right: 'right-1',
                programId: 'program-2',
                facilityId: 'facility-2'
            },
            {
                right: 'right-1',
                programId: 'program-3',
                facilityId: 'facility-2'
            },
            {
                right: 'right-2',
                programId: 'program-2',
                facilityId: 'facility-1'
            }
        ];

        spyOn(authorizationService, 'getUser').andReturn(user);
        spyOn(programService, 'getUserPrograms').andReturn($q.when(programs));
        spyOn(facilityService, 'getAllMinimal').andReturn($q.when(facilities));
        spyOn(permissionService, 'load').andReturn($q.when(permissions));
        spyOn(currentUserService, 'getUserInfo').andReturn($q.when(referencedataUser));

        facilityProgramCacheService.pushRightsForModule('module', ['right-1']);
        loadPromise = facilityProgramCacheService.loadData('module');
        $rootScope.$apply();
    });

    describe('load', function() {

        it('should return promise', function() {
            expect(loadPromise.then).not.toBe(undefined);
        });

        it('should call facilityService', function() {
            expect(facilityService.getAllMinimal).toHaveBeenCalled();
        });

        it('should call authorizationService', function() {
            expect(authorizationService.getUser).toHaveBeenCalled();
        });

        it('should call programService', function() {
            expect(programService.getUserPrograms).toHaveBeenCalledWith(user.user_id);
        });

        it('should call permissionService', function() {
            expect(permissionService.load).toHaveBeenCalledWith(user.user_id);
        });

        it('should call currentUserService', function() {
            expect(currentUserService.getUserInfo).toHaveBeenCalled();
        });

        it('should reject promise if request fails', function() {
            var result;

            currentUserService.getUserInfo.andReturn($q.reject());

            facilityProgramCacheService.loadData()
            .then(function() {
                result = 'resolved';
            })
            .catch(function() {
                result = 'rejected';
            });
            $rootScope.$apply();

            expect(currentUserService.getUserInfo).toHaveBeenCalled();
            expect(result).toEqual('rejected');
        });
    });

    describe('getUserHomeFacility', function() {

        it('should return home facility', function() {
            expect(facilityProgramCacheService.getUserHomeFacility()).toEqual(facilities[0]);
        });
    });

    describe('getUserPrograms', function() {

        it('should return supervised programs if isSupervised is true', function() {
            expect(facilityProgramCacheService.getUserPrograms(true).length).toEqual(2);
            expect(facilityProgramCacheService.getUserPrograms(true)).toContain(programs[1]);
            expect(facilityProgramCacheService.getUserPrograms(true)).toContain(programs[2]);
        });

        it('should return home facility programs if isSupervised is false', function() {
            expect(facilityProgramCacheService.getUserPrograms(false)).toEqual([programs[0]]);
        });

        it('should return supervised programs if isSupervised is true and user does not have a home facility', function() {
            referencedataUser.homeFacilityId = null;
            loadPromise = facilityProgramCacheService.loadData('module');
            $rootScope.$apply();

            expect(facilityProgramCacheService.getUserPrograms(true)).toEqual(programs);
        });

        it('should return an empty list if isSupervised is false and user does not have a home facility', function() {
            referencedataUser.homeFacilityId = null;
            loadPromise = facilityProgramCacheService.loadData('module');
            $rootScope.$apply();

            expect(facilityProgramCacheService.getUserPrograms(false)).toEqual([]);
        });
    });

    describe('getSupervisedFacilities', function() {

        beforeEach(function() {
            facilityProgramCacheService.pushRightsForModule('module', ['right-1']);
            facilityProgramCacheService.pushRightsForModule('module-2', ['right-1', 'right-2']);

            loadPromise = facilityProgramCacheService.loadData('module');
            $rootScope.$apply();
        });

        it('should return filtered facilities', function() {
            expect(facilityProgramCacheService.getSupervisedFacilities('program-1')).toEqual([facilities[0]]);
            expect(facilityProgramCacheService.getSupervisedFacilities('program-2')).toEqual([facilities[1]]);
        });
    });
});
