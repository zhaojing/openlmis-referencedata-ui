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

describe('authUserService', function() {

    beforeEach(function() {
        module('auth-user');
        module('referencedata-user');

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            this.authUserService = $injector.get('authUserService');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.VerificationEmailDataBuilder = $injector.get('VerificationEmailDataBuilder');
        });

        this.user = new this.UserDataBuilder().build();
    });

    describe('saveUser', function() {

        it('should save user', function() {
            var data;

            var user = this.user;
            this.$httpBackend
                .expectPOST(this.openlmisUrlFactory('/api/users/auth'))
                .respond(function(method, url, body) {
                    var json = JSON.parse(body);

                    if (json.id === user.id) {
                        return [200, user];
                    }

                    return [400];
                });

            this.authUserService.saveUser(this.user)
                .then(function(response) {
                    data = response;
                });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(data.id).toBe(this.user.id);
        });
    });

    describe('resetPassword', function() {

        it('should reset password', function() {
            var user = this.user;
            this.$httpBackend
                .expectPOST(this.openlmisUrlFactory('/api/users/auth/passwordReset'))
                .respond(function(method, url, body) {
                    var json = JSON.parse(body);

                    if (json.username === user.username && json.newPassword === 'password') {
                        return [200];
                    }

                    return [400];
                });

            var success;
            this.authUserService.resetPassword(this.user.username, 'password')
                .then(function() {
                    success = true;
                });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(success).toBe(true);
        });

    });

    describe('sendResetEmail', function() {

        it('should send reset email', function() {
            this.$httpBackend
                .expectPOST(this.openlmisUrlFactory('/api/users/auth/forgotPassword?email=' + this.user.email))
                .respond(200);

            var success;
            this.authUserService.sendResetEmail(this.user.email)
                .then(function() {
                    success = true;
                });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(success).toBe(true);
        });

    });

    describe('sendVerificationEmail', function() {

        it('should send verification email', function() {
            this.$httpBackend
                .expectPOST(this.openlmisUrlFactory('/api/userContactDetails/' + this.user.id + '/verifications'))
                .respond(200);

            var success;
            this.authUserService.sendVerificationEmail(this.user.id)
                .then(function() {
                    success = true;
                });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(success).toBe(true);
        });
    });

    describe('getVerificationEmail', function() {

        it('should get pending verification email', function() {
            var token = new this.VerificationEmailDataBuilder().build();
            var data;

            this.$httpBackend
                .expectGET(this.openlmisUrlFactory('/api/userContactDetails/' + this.user.id + '/verifications'))
                .respond(200, token);

            this.authUserService.getVerificationEmail(this.user.id)
                .then(function(response) {
                    data = response;
                });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(data.email).toEqual(token.email);
        });

        it('should handle empty response', function() {
            var data;

            this.$httpBackend
                .expectGET(this.openlmisUrlFactory('/api/userContactDetails/' + this.user.id + '/verifications'))
                .respond(200);

            this.authUserService.getVerificationEmail(this.user.id)
                .then(function(response) {
                    data = response;
                });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(data).toEqual(undefined);
        });

        it('should reject if the requests fails', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory('/api/userContactDetails/' + this.user.id + '/verifications'))
                .respond(500);

            var rejected;
            this.authUserService.getVerificationEmail(this.user.id)
                .catch(function() {
                    rejected = true;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);
        });

    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });
});
