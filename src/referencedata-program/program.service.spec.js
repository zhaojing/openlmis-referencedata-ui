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

describe('programService', function() {

    var $rootScope, $httpBackend, $q, openlmisUrlFactory, offlineService, programsStorage, programService, program1, program2;

    beforeEach(function() {
        module('referencedata-program', function($provide, $qProvider){
            programsStorage = jasmine.createSpyObj('programsStorage', ['getBy', 'getAll', 'put', 'search']);
            var localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andCallFake(function() {
                return programsStorage;
            });
            $provide.service('localStorageFactory', function() {
                return localStorageFactorySpy;
            });

            offlineService = jasmine.createSpyObj('offlineService', ['isOffline', 'checkConnection']);
            offlineService.checkConnection.andReturn({
                'finally': function() {}
            });
            $provide.service('offlineService', function() {
                return offlineService;
            });
        });

        inject(function(_$httpBackend_, _$rootScope_, _$q_, _openlmisUrlFactory_, _programService_) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            openlmisUrlFactory = _openlmisUrlFactory_;
            programService = _programService_;
        });

        program1 = {
            id: '1',
            name: 'program1'
        };
        program2 = {
            id: '2',
            name: 'program2'
        };
    });

    it('should get program by id', function() {
        var data;

        $httpBackend.when('GET', openlmisUrlFactory('/api/programs/' + program1.id))
        .respond(200, program1);

        programService.get(program1.id).then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data.id).toEqual(program1.id);
        expect(data.name).toEqual(program1.name);
    });

    it('should get all programs', function() {
        var data;

        $httpBackend.when('GET', openlmisUrlFactory('/api/programs'))
        .respond(200, [program1, program2]);

        programService.getAll().then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data[0].id).toEqual(program1.id);
        expect(data[1].id).toEqual(program2.id);
    });

    it('should get user programs from storage while offline', function() {
        var data,
            userId = '1',
            isForHomeFacility = '2';

        programsStorage.search.andReturn([program1]);

        offlineService.isOffline.andReturn(true);

        programService.getUserPrograms(userId, isForHomeFacility).then(function(response) {
            data = response;
        });

        $rootScope.$apply();

        expect(data[0].id).toBe(program1.id);
    });

    it('should get user programs and save them to storage', function() {
        var data,
            userId = '1';

        $httpBackend.when('GET', openlmisUrlFactory('api/users/' + userId + '/programs')).respond(200, [program1, program2]);

        offlineService.isOffline.andReturn(false);

        programService.getUserPrograms(userId).then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data[0].id).toBe(program1.id);
        expect(data[1].id).toBe(program2.id);
        expect(programsStorage.put.callCount).toEqual(2);
    });

    it('should save program', function() {
        var data;

        $httpBackend.when('PUT', openlmisUrlFactory('/api/programs/' + program1.id))
            .respond(200, program2);

        programService.update(program1).then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data.id).toEqual(program2.id);
    });

    it('should save program', function() {
        var data;

        $httpBackend.when('PUT', openlmisUrlFactory('/api/programs/' + program1.id))
            .respond(200, program2);

        programService.update(program1).then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data.id).toEqual(program2.id);
    });

    describe('getUserPrograms', function() {
        var usersProgramResponse;

        beforeEach(function() {
            var programs = [{id:'test'}];
            usersProgramResponse = $httpBackend.when('GET', openlmisUrlFactory('api/users/userId/programs'))
            .respond(200, programs);

            programsStorage.search.andReturn([]);
        });

        it('will get a list of all the users programs', function() {
            var resultSpy = jasmine.createSpy('resultSpy');

            programService.getUserPrograms('userId')
            .then(resultSpy);

            $httpBackend.flush();
            $rootScope.$apply();

            expect(resultSpy).toHaveBeenCalled();
            expect(Array.isArray(resultSpy.mostRecentCall.args[0])).toBe(true);
            expect(resultSpy.mostRecentCall.args[0].length).toBe(1);
            expect(resultSpy.mostRecentCall.args[0][0].id).toBe('test');
        });

        it('will cache the first successful request', function() {
            programService.getUserPrograms('userId');

            $httpBackend.flush();
            $rootScope.$apply();

            expect(programsStorage.put).toHaveBeenCalled();
            expect(programsStorage.put.mostRecentCall.args[0].id).toBe('test');
            expect(programsStorage.put.mostRecentCall.args[0].userIdOffline).toBe('userId');
        });

        it('will not cache an unsuccessful request', function() {
            var resultSpy = jasmine.createSpy('resultSpy');
            usersProgramResponse.respond(400);

            programService.getUserPrograms('userId')
            .catch(resultSpy);

            $httpBackend.flush();
            $rootScope.$apply();

            expect(resultSpy).toHaveBeenCalled();
            expect(programsStorage.put).not.toHaveBeenCalled();
        });

        it('will return a cached response instead of making another request', function() {
            var resultSpy = jasmine.createSpy('resultSpy');

            programsStorage.search.andReturn([{id:'example'}]);

            programService.getUserPrograms('userId')
            .then(resultSpy);

            $rootScope.$apply();

            expect(resultSpy).toHaveBeenCalled();
            expect(Array.isArray(resultSpy.mostRecentCall.args[0])).toBe(true);
            expect(resultSpy.mostRecentCall.args[0][0].id).toBe('example');
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
