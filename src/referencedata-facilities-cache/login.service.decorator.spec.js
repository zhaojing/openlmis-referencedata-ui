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

describe('loginService facilities cache decorator', function() {

    var loginService, $q, $rootScope, facilityService, originalLoginSpy, originalLogoutSpy,
        facilityFactory;

    beforeEach(function() {
        module('referencedata-facility', function($provide) {
            originalLoginSpy = jasmine.createSpy('login');
            originalLogoutSpy = jasmine.createSpy('logout');

            $provide.service('loginService', function() {
                return {
                    login: originalLoginSpy,
                    logout: originalLogoutSpy
                };
            });
        });
        module('referencedata-facilities-cache');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            loginService = $injector.get('loginService');
            facilityFactory = $injector.get('facilityFactory');
            facilityService = $injector.get('facilityService');
        });
    });

    describe('login', function() {

        var username, password, userInfo;

        beforeEach(function() {
            spyOn(facilityFactory, 'getAllMinimalFacilities');

            username = 'validUsername';
            password = 'validPass';

            userInfo = {
                userId: 'user-referencedata-id',
                username: username,
                accessToken: '4c9b4b98-4c5d-4d92-a015-6b63dafc72ec'
            };
        });

        it('should reject promise if login was unsuccessful', function() {
            originalLoginSpy.andReturn($q.reject());

            var invalidUsername = 'invalidUsername',
                invalidPassword = 'invalidPassword',
                rejected;

            loginService.login(
                invalidUsername,
                invalidPassword
            )
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(originalLoginSpy).toHaveBeenCalledWith(invalidUsername, invalidPassword);
            expect(facilityFactory.getAllMinimalFacilities).not.toHaveBeenCalled();
            expect(rejected).toBe(true);
        });

        it('should reject if service fails to fetch facilities', function() {
            originalLoginSpy.andReturn($q.resolve(userInfo));
            facilityFactory.getAllMinimalFacilities.andReturn($q.reject());

            var rejected;
            loginService.login(
                username,
                password
            )
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(originalLoginSpy).toHaveBeenCalledWith(username, password);
            expect(facilityFactory.getAllMinimalFacilities).toHaveBeenCalled();
            expect(rejected).toEqual(true);
        });

        it('should resolve to the server response', function() {
            originalLoginSpy.andReturn($q.resolve(userInfo));
            facilityFactory.getAllMinimalFacilities.andReturn($q.resolve());

            var result;
            loginService.login(
                username,
                password
            )
            .then(function(response) {
                result = response;
            });
            $rootScope.$apply();

            expect(originalLoginSpy).toHaveBeenCalledWith(username, password);
            expect(facilityFactory.getAllMinimalFacilities).toHaveBeenCalled();
            expect(result).toEqual(userInfo);
        });

    });

    describe('logout', function() {

        beforeEach(function() {
            spyOn(facilityService, 'clearMinimalFacilitiesCache');
        });

        it('should clear rights if logout was successful', function() {
            originalLogoutSpy.andReturn($q.resolve());

            var resolved;
            loginService.logout()
            .then(function() {
                resolved = true;
            });
            $rootScope.$apply();

            expect(originalLogoutSpy).toHaveBeenCalled();
            expect(facilityService.clearMinimalFacilitiesCache).toHaveBeenCalled();
            expect(resolved).toBe(true);
        });

        it('should not clear rights if logout failed', function() {
            originalLogoutSpy.andReturn($q.reject());

            var rejected;
            loginService.logout()
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(originalLogoutSpy).toHaveBeenCalled();
            expect(facilityService.clearMinimalFacilitiesCache).not.toHaveBeenCalled();
            expect(rejected).toBe(true);
        });

        it('should reject if clearing rights threw an exception', function() {
            originalLogoutSpy.andReturn($q.resolve());
            facilityService.clearMinimalFacilitiesCache.andThrow();

            var rejected;
            loginService.logout()
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(originalLogoutSpy).toHaveBeenCalled();
            expect(facilityService.clearMinimalFacilitiesCache).toHaveBeenCalled();
            expect(rejected).toBe(true);
        });

    });

});
