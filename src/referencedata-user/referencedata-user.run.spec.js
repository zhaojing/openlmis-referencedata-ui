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

describe('referencedata-user run', function() {

    var loginServiceSpy, currentUserServiceSpy, postLoginAction, postLogoutAction,  $q, $rootScope;

    beforeEach(function() {
        module('referencedata-user', function($provide) {
            loginServiceSpy = jasmine.createSpyObj('loginService', [
                'registerPostLoginAction', 'registerPostLogoutAction'
            ]);
            $provide.value('loginService', loginServiceSpy);

            currentUserServiceSpy = jasmine.createSpyObj('currentUserService', ['getUserInfo', 'clearCache']);
            $provide.value('currentUserService', currentUserServiceSpy);
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
        });

        postLoginAction = loginServiceSpy.registerPostLoginAction.calls[0].args[0];
        postLogoutAction = loginServiceSpy.registerPostLogoutAction.calls[0].args[0];
    });

    describe('run block', function() {

        beforeEach(function() {
            inject();
        });

        it('should register post login action', function() {
            expect(loginServiceSpy.registerPostLoginAction).toHaveBeenCalled();
        });

        it('should register post logout action', function() {
            expect(loginServiceSpy.registerPostLogoutAction).toHaveBeenCalled();
        });

    });

    describe('post login action', function() {

        it('should try to fetch current user information', function() {
            currentUserServiceSpy.getUserInfo.andReturn($q.resolve());

            var success;
            postLoginAction()
                .then(function() {
                    success = true;
                });
            $rootScope.$apply();

            expect(success).toBe(true);
            expect(currentUserServiceSpy.getUserInfo).toHaveBeenCalled();
        });

    });

    describe('post logout action', function() {

        it('should clear current user cache', function() {
            currentUserServiceSpy.clearCache.andReturn($q.resolve());

            var success;
            postLogoutAction()
                .then(function() {
                    success = true;
                });
            $rootScope.$apply();

            expect(success).toBe(true);
            expect(currentUserServiceSpy.clearCache).toHaveBeenCalled();
        });

    });

});