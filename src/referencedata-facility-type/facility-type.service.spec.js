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

describe('facilityTypeService', function() {

    var $rootScope, $httpBackend, referencedataUrlFactory, facilityTypeService, offlineService,
        facilityTypesStorage, facilityTypeOne, facilityTypeTwo, $q;

    beforeEach(function() {
        module('referencedata-facility-type', function($provide){

            facilityTypesStorage = jasmine.createSpyObj('facilityTypesStorage', ['getBy', 'getAll', 'put']);
            var localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andCallFake(function() {
                return facilityTypesStorage;
            });
            $provide.service('localStorageFactory', function() {
                return localStorageFactorySpy;
            });

            offlineService = jasmine.createSpyObj('offlineService', ['isOffline', 'checkConnection']);
            offlineService.checkConnection.andCallFake(checkConnection);
            $provide.service('offlineService', function() {
                return offlineService;
            });

        });

        inject(function($injector) {
            $q = $injector.get('$q');
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            facilityTypeService = $injector.get('facilityTypeService');
        });

        facilityTypeOne = {
            id: '1',
            name: 'facilityTypeOne'
        };
        facilityTypeTwo = {
            id: '2',
            name: 'facilityTypeTwo'
        };
    });

    describe('get', function() {

        it('should get facility type by id from storage while offline', function() {
            var data;

            facilityTypesStorage.getBy.andReturn(facilityTypeTwo);

            offlineService.isOffline.andReturn(true);

            facilityTypeService.get(facilityTypeTwo.id).then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data.id).toBe(facilityTypeTwo.id);
        });

        it('should get facility type by id and save it to storage', function() {
            var data,
                spy = jasmine.createSpy();

            $httpBackend.when('GET', referencedataUrlFactory('/api/facilityTypes/' + facilityTypeOne.id)).respond(200, facilityTypeOne);
            facilityTypesStorage.put.andCallFake(spy);

            offlineService.isOffline.andReturn(false);

            facilityTypeService.get(facilityTypeOne.id).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.id).toBe(facilityTypeOne.id);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('getAll', function() {

        it('should get all facility types from storage while offline', function() {
            var data;

            facilityTypesStorage.getAll.andReturn([facilityTypeOne, facilityTypeTwo]);

            offlineService.isOffline.andReturn(true);

            facilityTypeService.getAll().then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data[0].id).toBe(facilityTypeOne.id);
            expect(data[1].id).toBe(facilityTypeTwo.id);
        });

        it('should get all facility types and save them to storage', function() {
            var data,
                spy = jasmine.createSpy();

            $httpBackend.when('GET', referencedataUrlFactory('/api/facilityTypes')).respond(200, [facilityTypeOne, facilityTypeTwo]);
            facilityTypesStorage.put.andCallFake(spy);

            offlineService.isOffline.andReturn(false);

            facilityTypeService.getAll().then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data[0].id).toBe(facilityTypeOne.id);
            expect(data[1].id).toBe(facilityTypeTwo.id);
            expect(spy.callCount).toEqual(2);
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

function checkConnection() {
    return $q.when(true);
}
