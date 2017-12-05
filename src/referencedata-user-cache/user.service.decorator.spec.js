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

describe('UserService get decorator', function() {
    var referencedataUserService, $rootScope, $httpBackend, referencedataUrlFactory,
        user, cache;

    beforeEach(function() {
        module('referencedata-user-cache', function($provide) {
            cache = jasmine.createSpyObj('cache', ['getBy', 'put', 'clearAll', 'getAll']);
            cache.getAll.andReturn([]);
            $provide.factory('localStorageFactory', function() {
                return function() {
                    return cache;
                };
            });
        });

        inject(function($injector) {
            referencedataUserService = $injector.get('referencedataUserService');
            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
        });

        user = {
            id: 'user-id',
            username: 'some-user'
        };
    });

    it('will return a cached user if available', function() {
        cache.getBy.andReturn(user);

        var results;
        referencedataUserService.get(user.id).then(function(response) {
            result = response;
        });
        $rootScope.$apply();

        expect(result).toEqual(user);
        expect(cache.getBy).toHaveBeenCalledWith('id', user.id);
    });

    it('will send original request if there is no user cached', function() {
        $httpBackend.when('GET', referencedataUrlFactory('/api/users/' + user.id))
        .respond(200, user);

        cache.getBy.andReturn(undefined);

        var result;
        referencedataUserService.get(user.id).then(function(response) {
            result = response;
        });
        $httpBackend.flush();
        $rootScope.$apply();

        expect(result.username).toEqual(user.username);
        expect(result.id).toEqual(user.id);
        expect(cache.put).toHaveBeenCalled();

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should clear user cache', function() {
        referencedataUserService.clearUserCache();

        expect(cache.clearAll).toHaveBeenCalled();
    });
});
