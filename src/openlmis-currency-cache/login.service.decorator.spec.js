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

describe('loginService currency cache decorator', function() {

    var loginService, $q, $rootScope, currencyService, originalLoginSpy;

    beforeEach(function() {
        module('openlmis-login', function($provide) {
            originalLoginSpy = jasmine.createSpy('login');

            $provide.service('loginService', function() {
                return {
                    login: originalLoginSpy
                };
            });
        });
        module('openlmis-currency-cache');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            loginService = $injector.get('loginService');
            currencyService = $injector.get('currencyService');
        });
    });

    describe('login', function() {

        var username, password, userInfo;

        beforeEach(function() {
            spyOn(currencyService, 'getCurrencySettings');
            spyOn(currencyService, 'getCurrencySettingsFromConfig');

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
            expect(currencyService.getCurrencySettings).not.toHaveBeenCalled();
            expect(currencyService.getCurrencySettingsFromConfig).not.toHaveBeenCalled();
            expect(rejected).toBe(true);
        });

        it('should get currency settings from server if it provides them', function() {
            originalLoginSpy.andReturn($q.resolve(userInfo));
            currencyService.getCurrencySettings.andReturn($q.resolve());

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
            expect(currencyService.getCurrencySettings).toHaveBeenCalled();
            expect(currencyService.getCurrencySettingsFromConfig).not.toHaveBeenCalled();
            expect(result).toEqual(userInfo);
        });

        it('should get currency settings from config if server does not provide them', function() {
            originalLoginSpy.andReturn($q.resolve(userInfo));
            currencyService.getCurrencySettings.andReturn($q.reject());
            currencyService.getCurrencySettingsFromConfig.andReturn($q.resolve());

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
            expect(currencyService.getCurrencySettings).toHaveBeenCalled();
            expect(currencyService.getCurrencySettingsFromConfig).toHaveBeenCalled();
            expect(result).toEqual(userInfo);
        });

        it('should reject promise if getting currency settings from config fails', function() {
            originalLoginSpy.andReturn($q.resolve(userInfo));
            currencyService.getCurrencySettings.andReturn($q.reject());
            currencyService.getCurrencySettingsFromConfig.andReturn($q.reject());

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
            expect(currencyService.getCurrencySettings).toHaveBeenCalled();
            expect(currencyService.getCurrencySettingsFromConfig).toHaveBeenCalled();
            expect(rejected).toEqual(true);
        });

    });

});
