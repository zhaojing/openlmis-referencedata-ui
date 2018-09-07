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

describe('openlmis-currency-cache run', function() {

    var loginServiceSpy, currencyServiceSpy, postLoginAction, $q, $rootScope;

    beforeEach(function() {
        module('openlmis-currency-cache', function($provide) {
            loginServiceSpy = jasmine.createSpyObj('loginService', ['registerPostLoginAction']);
            $provide.value('loginService', loginServiceSpy);

            currencyServiceSpy = jasmine.createSpyObj('currencyService', [
                'getCurrencySettings', 'getCurrencySettingsFromConfig'
            ]);
            $provide.value('currencyService', currencyServiceSpy);
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
        });

        postLoginAction = loginServiceSpy.registerPostLoginAction.calls[0].args[0];
    });

    describe('run block', function() {

        it('should register post login action', function() {
            expect(loginServiceSpy.registerPostLoginAction).toHaveBeenCalled();
        });

    });

    describe('post login action', function() {

        it('should try to fetch currency settings from the server', function() {
            currencyServiceSpy.getCurrencySettings.andReturn($q.resolve());

            var success;
            postLoginAction()
                .then(function() {
                    success = true;
                });
            $rootScope.$apply();

            expect(success).toBe(true);
            expect(currencyServiceSpy.getCurrencySettings).toHaveBeenCalled();
            expect(currencyServiceSpy.getCurrencySettingsFromConfig).not.toHaveBeenCalled();
        });

        it('should fallback to the config settings if fetching settings from the server fails', function() {
            currencyServiceSpy.getCurrencySettings.andReturn($q.reject());
            currencyServiceSpy.getCurrencySettingsFromConfig.andReturn($q.resolve());

            var success;
            postLoginAction()
                .then(function() {
                    success = true;
                });
            $rootScope.$apply();

            expect(success).toBe(success);
            expect(currencyServiceSpy.getCurrencySettings).toHaveBeenCalled();
            expect(currencyServiceSpy.getCurrencySettingsFromConfig).toHaveBeenCalled();
        });

    });

});