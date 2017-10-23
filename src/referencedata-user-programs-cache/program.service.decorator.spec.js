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

describe('ProgramService getUserPrograms decorator', function() {
    var programService, $rootScope, $httpBackend, openlmisUrlFactory,
        programs, user, cache;

    beforeEach(function() {
        module('referencedata-user-programs-cache', function($provide) {
            cache = jasmine.createSpyObj('cache', ['getBy', 'put', 'clearAll', 'getAll', 'search']);
            cache.getAll.andReturn([]);
            $provide.factory('localStorageFactory', function() {
                return function() {
                    return cache;
                };
            });
        });

        inject(function($injector) {
            programService = $injector.get('programService');
            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
        });

        user = {
            id: 'user-id',
            username: 'some-user'
        };

        programs = [
            {
                id: 'program-id-1',
                name: 'program-1'
            },
            {
                id: 'program-id-2',
                name: 'program-2'
            }
        ];
    });

    it('should return a cached programs if available', function() {
        cache.search.andReturn(programs);

        var results;
        programService.getUserPrograms(user.id).then(function(response) {
            result = response;
        });
        $rootScope.$apply();

        expect(result).toEqual(programs);
        expect(cache.search).toHaveBeenCalled();
    });

    it('should send original request if there is no user programs cached', function() {
        $httpBackend.when('GET', openlmisUrlFactory('api/users/' + user.id + '/programs'))
        .respond(200, programs);

        cache.search.andReturn(undefined);

        var result;
        programService.getUserPrograms(user.id).then(function(response) {
            result = response;
        });
        $httpBackend.flush();
        $rootScope.$apply();

        expect(result.length).toEqual(2);
        expect(result[0].id).toEqual(programs[0].id);
        expect(result[1].id).toEqual(programs[1].id);
        expect(cache.put.callCount).toEqual(2);

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should clear user programs cache', function() {
        programService.clearUserProgramsCache();

        expect(cache.clearAll).toHaveBeenCalled();
    });
});
