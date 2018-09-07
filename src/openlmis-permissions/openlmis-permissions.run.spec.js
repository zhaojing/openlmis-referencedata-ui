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

describe('openlmis-permissions run', function() {

    var loginServiceSpy, userRightsFactory, authorizationService, postLoginAction, $q, $rootScope, rights,
        RightDataBuilder, postLogoutAction, UserDataBuilder, user;

    beforeEach(function() {
        module('openlmis-permissions');
        module('referencedata-user', function($provide) {
            loginServiceSpy = jasmine.createSpyObj('loginService', [
                'registerPostLoginAction', 'registerPostLogoutAction'
            ]);
            $provide.value('loginService', loginServiceSpy);
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            RightDataBuilder = $injector.get('RightDataBuilder');
            userRightsFactory = $injector.get('userRightsFactory');
            authorizationService = $injector.get('authorizationService');
            UserDataBuilder = $injector.get('UserDataBuilder');
        });

        rights = [
            new RightDataBuilder().build()
        ];

        user = new UserDataBuilder().build();

        postLoginAction = loginServiceSpy.registerPostLoginAction.calls[0].args[0];
        postLogoutAction = loginServiceSpy.registerPostLogoutAction.calls[0].args[0];

        spyOn(userRightsFactory, 'buildRights').andReturn($q.resolve(rights));
        spyOn(authorizationService, 'setRights');
        spyOn(authorizationService, 'clearRights');
    });

    describe('run block', function() {

        it('should register post login action', function() {
            expect(loginServiceSpy.registerPostLoginAction).toHaveBeenCalled();
        });

        it('should register post logout action', function() {
            expect(loginServiceSpy.registerPostLogoutAction).toHaveBeenCalled();
        });

    });

    describe('post login action', function() {

        it('should build user rights', function() {
            postLoginAction(user);
            $rootScope.$apply();

            expect(userRightsFactory.buildRights).toHaveBeenCalledWith(user.userId);
        });

        it('should set up rights', function() {
            authorizationService.setRights.andReturn($q.resolve());

            var success;
            postLoginAction(user)
                .then(function() {
                    success = true;
                });
            $rootScope.$apply();

            expect(success).toBe(true);
            expect(authorizationService.setRights).toHaveBeenCalledWith(rights);
        });

    });

    describe('post logout action', function() {

        it('should clear rights', function() {
            authorizationService.clearRights.andReturn($q.resolve());

            var success;
            postLogoutAction()
                .then(function() {
                    success = true;
                });
            $rootScope.$apply();

            expect(success).toBe(true);
            expect(authorizationService.clearRights).toHaveBeenCalled();
        });

    });

});