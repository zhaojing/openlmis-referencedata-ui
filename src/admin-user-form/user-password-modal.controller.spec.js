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

describe('UserPasswordModalController', function() {

    var $controller, $q, $rootScope, authUserService, loadingModalService, notificationService,
        vm, user, modalDeferred;

    beforeEach(function() {
        module('admin-user-form', function($provide) {
            authUserService = jasmine.createSpyObj('authUserService', ['resetPassword', 'sendResetEmail']);
            $provide.service('authUserService', function() {
                return authUserService;
            });
        });

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            loadingModalService = $injector.get('loadingModalService');
            notificationService = $injector.get('notificationService');
        });

        spyOn(loadingModalService, 'open').andReturn($q.when(true));
        spyOn(loadingModalService, 'close').andReturn();
        spyOn(notificationService, 'success').andReturn();

        user = {
            username: 'random-user',
            newPassword: 'new-password',
            email: 'random-email'
        };
        modalDeferred = $q.defer();

        vm = $controller('UserPasswordModalController', {
            user: user,
            modalDeferred: modalDeferred,
            title: 'adminUserForm.createPassword',
            hideCancel: false
        });
        vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose updatePassword method', function() {
            expect(angular.isFunction(vm.updatePassword)).toBe(true);
        });

        it('should set user', function() {
            expect(vm.user).toBe(user);
        });

        it('should set title', function() {
            expect(vm.title).toBe('adminUserForm.createPassword');
        });

        it('should set hideCancel', function() {
            expect(vm.hideCancel).toBe(false);
        });

        it('should set isEmailResetSelected as true if user has email', function() {
            expect(vm.isEmailResetSelected).toBe(true);
        });

        it('should set isEmailResetSelected as false if user has no email', function() {
            delete user.email;
            vm.$onInit();

            expect(vm.isEmailResetSelected).toBe(false);
        });

    });

    describe('updatePassword', function() {

        describe('resetPassword', function() {

            beforeEach(function() {
                authUserService.resetPassword.andReturn($q.when(true));
                vm.isEmailResetSelected = false;
                vm.updatePassword();
                $rootScope.$apply();
            });

            it('should open loading modal', function() {
                expect(loadingModalService.open).toHaveBeenCalled();
            });

            it('should call authUserService', function() {
                expect(authUserService.resetPassword).toHaveBeenCalledWith(user.username, user.newPassword);
            });

            it('should change email if it is empty string', function() {
                expect(notificationService.success).toHaveBeenCalledWith('adminUserForm.passwordSetSuccessfully');
            });

            it('should close loading modal if reset password request fails', function() {
                expect(notificationService.success.callCount).toBe(1);

                var deferred = $q.defer();

                authUserService.resetPassword.andReturn(deferred.promise);
                vm.updatePassword();
                deferred.reject();
                $rootScope.$apply();

                expect(loadingModalService.close).toHaveBeenCalled();
                expect(notificationService.success.callCount).toBe(1);
            });

        });

        describe('sendResetEmail', function() {

            beforeEach(function() {
                authUserService.sendResetEmail.andReturn($q.when(true));
                vm.isEmailResetSelected = true;
                vm.updatePassword();
                $rootScope.$apply();
            });

            it('should open loading modal', function() {
                expect(loadingModalService.open).toHaveBeenCalled();
            });

            it('should call authUserService', function() {
                expect(authUserService.sendResetEmail).toHaveBeenCalledWith(user.email);
            });

            it('should sent reset email', function() {
                expect(notificationService.success).toHaveBeenCalledWith('adminUserForm.passwordResetSuccessfully');
            });

            it('should close loading modal if sent reset email request fails', function() {
                expect(notificationService.success.callCount).toBe(1);

                var deferred = $q.defer();

                authUserService.sendResetEmail.andReturn(deferred.promise);
                vm.updatePassword();
                deferred.reject();
                $rootScope.$apply();

                expect(loadingModalService.close).toHaveBeenCalled();
                expect(notificationService.success.callCount).toBe(1);
            });
        });

    });
});
