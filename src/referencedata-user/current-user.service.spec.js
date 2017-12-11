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

describe('currentUserService', function() {
    var $q, user, cachedUser, authUser, currentUserCache, referencedataUserService, $rootScope, currentUserService,
        authorizationService;

    beforeEach(function() {
        module('referencedata-user', function($provide) {
            currentUserCache = jasmine.createSpyObj('currentUserCache', [
                'getBy', 'put', 'clearAll'
            ]);

            $provide.factory('localStorageFactory', function() {
                return function() {
                    return currentUserCache;
                };
            });
        });

        inject(function($injector) {
            referencedataUserService = $injector.get('referencedataUserService');
            currentUserService = $injector.get('currentUserService');
            authorizationService = $injector.get('authorizationService');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
        });

        cachedUser = {
            id: 'user-id',
            username: 'someUsername'
        };

        user = {
            id: 'user_id',
            username: 'updateUsername'
        };

        authUser = {
            user_id: user.id
        };

        spyOn(authorizationService, 'getUser');
        spyOn(referencedataUserService, 'get');
    });

    describe('getUserInfo', function() {

        it('should reject promise if user is not logged in', function() {
            var rejected;
            currentUserService.getUserInfo()
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
            expect(currentUserCache.getBy).not.toHaveBeenCalled();
            expect(referencedataUserService.get).not.toHaveBeenCalled();
        });

        it('should reject promise if user is logged in but no details are cached and they does not exist on the server', function() {
            authorizationService.getUser.andReturn(authUser);
            referencedataUserService.get.andReturn($q.reject());

            var rejected;
            currentUserService.getUserInfo()
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
            expect(referencedataUserService.get).toHaveBeenCalledWith(authUser.user_id);
        });

        it('should return cached user if available', function() {
            authorizationService.getUser.andReturn(authUser);
            currentUserCache.getBy.andReturn(cachedUser);

            var result;
            currentUserService.getUserInfo().then(function(response) {
                result = response;
            });
            $rootScope.$apply();

            expect(result).toEqual(cachedUser);
            expect(currentUserCache.getBy).toHaveBeenCalledWith('id', authUser.user_id);
            expect(referencedataUserService.get).not.toHaveBeenCalledWith();
        });

        it('should fetch user from the server if none is cached', function() {
            authorizationService.getUser.andReturn(authUser);
            referencedataUserService.get.andReturn($q.resolve(user));

            var result;
            currentUserService.getUserInfo().then(function(response) {
                result = response;
            });
            $rootScope.$apply();

            expect(result).toEqual(user);
            expect(currentUserCache.getBy).toHaveBeenCalledWith('id', authUser.user_id);
            expect(referencedataUserService.get).toHaveBeenCalledWith(authUser.user_id);
        });

    });

    describe('clearCache', function() {

        it('should clear cache', function() {
            currentUserService.clearCache();

            expect(currentUserCache.clearAll).toHaveBeenCalled();
        });

    });
});
