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

describe('facilityFactory', function() {

    var $rootScope, $q, facility1, facility2, userPrograms, programService, facilityService,
        authorizationService, referencedataUserService, facilityFactory, REQUISITION_RIGHTS, FULFILLMENT_RIGHTS;

    beforeEach(function () {
        module('referencedata-facility');

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            facilityFactory = $injector.get('facilityFactory');
            REQUISITION_RIGHTS = $injector.get('REQUISITION_RIGHTS');
            FULFILLMENT_RIGHTS = $injector.get('FULFILLMENT_RIGHTS');

            facilityService = $injector.get('facilityService');
            spyOn(facilityService, 'getUserSupervisedFacilities');
            spyOn(facilityService, 'getUserFacilitiesForRight');
            spyOn(facilityService, 'get');
            spyOn(facilityService, 'getAllMinimal');

            programService = $injector.get('programService');
            spyOn(programService, 'getUserPrograms');

            authorizationService = $injector.get('authorizationService');
            spyOn(authorizationService, 'getRightByName');
        });
    });

    beforeEach(function() {
        facility1 = {
            id: '1',
            name: 'facility1'
        };
        facility2 = {
            id: '2',
            name: 'facility2'
        };

        userPrograms = [
            {
                name: 'program1',
                id: '1'
            },
            {
                name: 'program2',
                id: '2'
            }
        ];
    });

    it('should get all facilities and save them to storage', function() {
        var data,
            userId = '1';

        authorizationService.getRightByName.andReturn({id: '1'});
        programService.getUserPrograms.andCallFake(function() {
            return $q.when(userPrograms);
        });
        facilityService.getUserSupervisedFacilities.andCallFake(function() {
            return $q.when([facility1, facility2]);
        });

        facilityFactory.getUserFacilities(userId, REQUISITION_RIGHTS.REQUISITION_VIEW).then(function(response) {
            data = response;
        });
        $rootScope.$apply();

        expect(data.length).toBe(2);
        expect(data[0].id).toBe(facility1.id);
        expect(data[1].id).toBe(facility2.id);
        expect(facilityService.getUserSupervisedFacilities.callCount).toEqual(2);
    });

    describe('getSupplyingFacilities', function() {

        var userId, ordersViewFacilities, podsManageFacilities, ordersViewRight, podsManageRight;

        beforeEach(inject(function() {
            userId = 'user-id';

            ordersViewFacilities = [
                createFacility('facility-one', 'facilityOne'),
                createFacility('facility-two', 'facilityTwo')
            ];

            podsManageFacilities = [
                createFacility('facility-two', 'facilityTwo'),
                createFacility('facility-three', 'facilityThree')
            ];

            facilityService.getUserFacilitiesForRight.andCallFake(function(userId, right) {
                if (right === FULFILLMENT_RIGHTS.ORDERS_VIEW) return $q.when(ordersViewFacilities);
                if (right === FULFILLMENT_RIGHTS.PODS_MANAGE) return $q.when(podsManageFacilities);
            });

            programService.getUserPrograms.andCallFake(function() {
                return $q.when([]);
            })
        }));

        it('should fetch facilities for ORDERS_VIEW right', function() {
            facilityFactory.getSupplyingFacilities(userId);

            expect(facilityService.getUserFacilitiesForRight).toHaveBeenCalledWith(userId, FULFILLMENT_RIGHTS.ORDERS_VIEW);
        });

        it('should fetch facilities for PODS_MANAGE right', function() {
            facilityFactory.getSupplyingFacilities(userId);

            expect(facilityService.getUserFacilitiesForRight).toHaveBeenCalledWith(userId, FULFILLMENT_RIGHTS.PODS_MANAGE);
        });

        it('should fetch programs for current user', function() {
            facilityFactory.getSupplyingFacilities(userId);

            expect(programService.getUserPrograms).toHaveBeenCalledWith(userId);
        });

        it('should resolve to set of facilities', function() {
            var result;

            facilityFactory.getSupplyingFacilities(userId).then(function(facilities) {
                result = facilities;
            });
            $rootScope.$apply();

            expect(result.length).toBe(3);
            expect(result[0]).toEqual(ordersViewFacilities[0]);
            expect(result[1]).toEqual(podsManageFacilities[0]);
            expect(result[2]).toEqual(podsManageFacilities[1]);
        });

    });

    describe('getUserHomeFacility', function() {

        beforeEach(inject(function($injector) {
            referencedataUserService = $injector.get('referencedataUserService')
            spyOn(referencedataUserService, 'getCurrentUserInfo')
                .andReturn($q.resolve({
                    homeFacilityId: 'home-facility-id'
                }));
        }));

        it('should fetch home facility for the current user', function() {
            facilityService.get.andCallFake(function() {
                return { name: 'Home Facility'};
            });

            var homeFacility;
            facilityFactory.getUserHomeFacility().then(function (result) {
                homeFacility = result;
            });
            $rootScope.$apply();

            expect(referencedataUserService.getCurrentUserInfo).toHaveBeenCalled();
            expect(facilityService.get).toHaveBeenCalledWith('home-facility-id');
            expect(homeFacility.name).toEqual('Home Facility');
        });
    });

    describe('getUserSupervisedFacilities', function() {
        var userId ='user-id',
            rightId = 'right-id';

        beforeEach(function() {
            authorizationService.getRightByName.andCallFake(function(rightName) {
                if (rightName === REQUISITION_RIGHTS.REQUISITION_CREATE) {
                    return {id: rightId};
                }
            });
        });

        it('should fetch supervised facilities for the current user', function() {
            facilityFactory.getUserSupervisedFacilities(
                userId,
                userPrograms[0],
                REQUISITION_RIGHTS.REQUISITION_CREATE);

            expect(facilityService.getUserSupervisedFacilities)
                .toHaveBeenCalledWith(userId, userPrograms[0], rightId);
        });
    });

    describe('getRequestingFacilities', function() {

        var userId, requisitionCreateFacilities, requisitionAuthorizeFacilities;

        beforeEach(function() {
            userId = 'user-id';

            requisitionCreateFacilities = [
                createFacility('facility-one', 'facilityOne'),
                createFacility('facility-two', 'facilityTwo')
            ];

            requisitionAuthorizeFacilities = [
                createFacility('facility-two', 'facilityTwo'),
                createFacility('facility-three', 'facilityThree')
            ];

            spyOn(facilityFactory, 'getUserFacilities').andCallFake(function(userId, rightName) {
                if (rightName === REQUISITION_RIGHTS.REQUISITION_CREATE) {
                    return $q.when(requisitionCreateFacilities);
                }
                if (rightName === REQUISITION_RIGHTS.REQUISITION_AUTHORIZE) {
                    return $q.when(requisitionAuthorizeFacilities);
                }
            });
        });

        it('should fetch facilities for REQUISITION_CREATE right', function() {
            facilityFactory.getRequestingFacilities(userId);

            expect(facilityFactory.getUserFacilities)
                .toHaveBeenCalledWith(userId, REQUISITION_RIGHTS.REQUISITION_CREATE);
        });

        it('should fetch facilities for REQUISITION_AUTHORIZE right', function() {
            facilityFactory.getRequestingFacilities(userId);

            expect(facilityFactory.getUserFacilities)
                .toHaveBeenCalledWith(userId, REQUISITION_RIGHTS.REQUISITION_AUTHORIZE);
        });

        it('should resolve to set of facilities', function() {
            var result;

            facilityFactory.getRequestingFacilities(userId).then(function(facilities) {
                result = facilities;
            });
            $rootScope.$apply();

            expect(result.length).toBe(3);
            expect(result[0]).toEqual(requisitionCreateFacilities[0]);
            expect(result[1]).toEqual(requisitionAuthorizeFacilities[0]);
            expect(result[2]).toEqual(requisitionAuthorizeFacilities[1]);
        });

    });

    describe('getAllUserFacilities', function() {

        var userId, requisitionViewFacilities;

        beforeEach(inject(function() {
            var facility;

            userId = 'user-id';

            facilities = [
                createFacility('facility-one', 'Facility One'),
                createFacility('facility-two', 'Facility Two')
            ];

            facilities[0].supportedPrograms.push({id:'program1'});

            facilityService.getUserFacilitiesForRight.andReturn($q.resolve(facilities));

            programService.getUserPrograms.andReturn($q.resolve([{
                id: 'program1',
                name: 'A Program'
            }]));

        }));

        it('should get list of facilities for REQUISITION_VIEW right', function() {
            facilityFactory.getAllUserFacilities(userId);

            expect(facilityService.getUserFacilitiesForRight).toHaveBeenCalledWith(userId, REQUISITION_RIGHTS.REQUISITION_VIEW);
        });

        it('should resolve to set of facilities', function() {
            var returnedFacilities;

            facilityFactory.getAllUserFacilities(userId)
            .then(function(facilities) {
                returnedFacilities = facilities;
            });

            $rootScope.$apply();

            expect(returnedFacilities.length).toBe(2);
            expect(returnedFacilities[0].id).toBe('facility-one');
        });

        it('will resolve facilities with full supported programs', function() {
            var returnedFacilities;

            facilityFactory.getAllUserFacilities(userId)
            .then(function(facilities) {
                returnedFacilities = facilities;
            });

            $rootScope.$apply();

            expect(Array.isArray(returnedFacilities[0].supportedPrograms)).toBe(true);
            expect(returnedFacilities[0].supportedPrograms.length).toBe(1);
            expect(returnedFacilities[0].supportedPrograms[0].id).toBe('program1');
            expect(returnedFacilities[0].supportedPrograms[0].name).toBe('A Program');
        });
    });

    describe('searchAndOrderFacilities', function() {

        it('should order by name', function() {
            var result = facilityFactory.searchAndOrderFacilities([facility2, facility1], null, 'name');

            expect(result.length).toEqual(2);
            expect(result[0].name).toEqual(facility1.name);
            expect(result[1].name).toEqual(facility2.name);
        });

        it('should filter name by given value', function() {
            var result = facilityFactory.searchAndOrderFacilities([facility2, facility1], '1', 'name');

            expect(result.length).toEqual(1);
            expect(result[0].name).toEqual(facility1.name);
        });
    });

    function createFacility(id, name) {
        return {
            id: id,
            name: name,
            supportedPrograms: []
        };
    }

});
