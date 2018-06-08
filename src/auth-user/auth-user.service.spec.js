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

    var OK_RESPONSE = 'ok';

    var $rootScope, $httpBackend, openlmisUrlFactory, authUserService, UserDataBuilder, user;

    beforeEach(function() {
        module('auth-user');
        module('referencedata-user');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            authUserService = $injector.get('authUserService');
            UserDataBuilder = $injector.get('UserDataBuilder');
        });

        user = new UserDataBuilder().build();
    });

    describe('saveUser', function() {

        it('should save user', function() {
            var data;

            $httpBackend
                .expectPOST(openlmisUrlFactory('/api/users/auth'))
                .respond(function(method, url, body) {
                    var json = JSON.parse(body);

                    if (json.id === user.id) {
                        return [200, user];
                    }

                    return [400];
                });

            authUserService.saveUser(user)
            .then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.id).toBe(user.id);
        });
    });

    describe('resetPassword', function() {

        it('should reset password', function() {
            var data;

            $httpBackend
                .expectPOST(openlmisUrlFactory('/api/users/auth/passwordReset'))
                .respond(function(method, url, body) {
                    var json = JSON.parse(body);

                    if (json.username === user.username && json.newPassword === 'password') {
                        return [200];
                    }

                    return [400];
                });

            authUserService.resetPassword(user.username, 'password')
            .then(function() {
                data = OK_RESPONSE;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data).toEqual(OK_RESPONSE);
        });

    });

    describe('sendResetEmail', function() {

        it('should send reset email', function() {
            var data;

            $httpBackend
                .expectPOST(openlmisUrlFactory('/api/users/auth/forgotPassword?email=' + user.email))
                .respond(200);

            authUserService.sendResetEmail(user.email)
            .then(function() {
                data = OK_RESPONSE;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data).toEqual(OK_RESPONSE);
        });

    });

    describe('sendVerificationEmail', function() {

        it('should send verification email', function() {
            var data;

            $httpBackend
                .expectPOST(openlmisUrlFactory('/api/users/auth/verifyEmail?userId=' + user.id))
                .respond(200);

            authUserService.sendVerificationEmail(user.id)
            .then(function() {
                data = OK_RESPONSE;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data).toEqual(OK_RESPONSE);
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
