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

describe('UserFormController', function() {

    var $state, $controller, $q, $rootScope, loadingModalService, notificationService, referencedataUserService, authUserService, UserPasswordModal,
        vm, user;

    beforeEach(function() {
        module('admin-user-form', function($provide) {
            referencedataUserService = jasmine.createSpyObj('referencedataUserService', ['saveUser']);
            $provide.service('referencedataUserService', function() {
                return referencedataUserService;
            });

            authUserService = jasmine.createSpyObj('authUserService', ['saveUser']);
            $provide.service('authUserService', function() {
                return authUserService;
            });

            UserPasswordModal = jasmine.createSpy('UserPasswordModalMock');
            $provide.service('UserPasswordModal', function() {
                return UserPasswordModal;
            });
        });

        inject(function($injector) {
            $state = $injector.get('$state');
            $controller = $injector.get('$controller');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            loadingModalService = $injector.get('loadingModalService');
            notificationService = $injector.get('notificationService');
        });

        spyOn($state, 'go');
        spyOn(loadingModalService, 'open').andReturn($q.when(true));
        spyOn(loadingModalService, 'close').andReturn();
        spyOn(notificationService, 'success').andReturn();

        user = {
            id: 'user-id',
            username: 'random-user'
        };

        vm = $controller('UserFormController', {
            user: user
        });
        vm.$onInit();
    });

    describe('init', function() {

        it('should expose saveUser method', function() {
            expect(angular.isFunction(vm.saveUser)).toBe(true);
        });

        it('should set user', function() {
            expect(vm.user).toBe(user);
        });

        it('should set notification', function() {
            expect(vm.notification).toBe('adminUserForm.userUpdatedSuccessfully');
        });

        it('should set updateMode', function() {
            expect(vm.updateMode).toBe(true);
        });

        it('should set updateMode if there is no user passed to controller', function() {
            vm = $controller('UserFormController', {
                user: undefined
            });
            vm.$onInit();

            expect(vm.updateMode).toBe(false);
            expect(vm.user.loginRestricted).toBe(false);
            expect(vm.notification).toBe('adminUserForm.userCreatedSuccessfully');
        });
    });

    describe('update user', function() {

        var deferred;

        beforeEach(function() {
            deferred = $q.defer();
            referencedataUserService.saveUser.andReturn(deferred.promise);
        });

        it('should open loading modal', function() {
            vm.saveUser();
            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should call referencedataUserService', function() {
            vm.saveUser();
            expect(referencedataUserService.saveUser).toHaveBeenCalledWith(user);
        });

        it('should call referencedataUserService with changes', function() {
            vm.user.username = 'newUserName';
            user.username = 'newUserName';

            vm.saveUser();
            expect(referencedataUserService.saveUser).toHaveBeenCalledWith(user);
        });

        it('should show notification', function() {
            deferred.resolve();
            vm.saveUser();
            $rootScope.$apply();

            expect(notificationService.success).toHaveBeenCalledWith(vm.notification);
        });

        it('should redirect to parent state', function() {
            deferred.resolve();
            vm.saveUser();
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should close loading modal', function() {
            deferred.resolve();
            vm.saveUser();
            $rootScope.$apply();
            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('should not show notification if request fails', function() {
            deferred.reject();
            vm.saveUser();
            $rootScope.$apply();
            expect(loadingModalService.close).toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
        });
    });

    describe('create user', function() {

        beforeEach(function() {
            referencedataUserService.saveUser.andReturn($q.when(user));
            authUserService.saveUser.andReturn($q.when(user));
            UserPasswordModal.andReturn($q.when(user));

            vm = $controller('UserFormController', {
                user: undefined
            });
            vm.$onInit();
        });

        it('should open loading modal', function() {
            vm.saveUser();
            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should call referencedataUserService', function() {
            vm.saveUser();
            expect(referencedataUserService.saveUser).toHaveBeenCalled();
        });

        it('should call referencedataUserService with changes', function() {
            vm.user.username = 'newUserName';
            vm.saveUser();
            expect(referencedataUserService.saveUser).toHaveBeenCalledWith(vm.user);
        });

        it('should call authUserService', function() {
            vm.saveUser();
            $rootScope.$apply();

            expect(authUserService.saveUser).toHaveBeenCalledWith({
                enabled: true,
                referenceDataUserId: user.id,
                role: 'USER',
                username: user.username
            });
        });

        it('should call UserPasswordModal', function() {
            vm.saveUser();
            $rootScope.$apply();

            expect(UserPasswordModal).toHaveBeenCalledWith(user.username);
        });

        it('should change email if it is empty string', function() {
            vm.saveUser();
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should call notificationService', function() {
            vm.saveUser();
            $rootScope.$apply();
            expect(notificationService.success).toHaveBeenCalledWith(vm.notification);
        });

        it('should close loading modal', function() {
            vm.saveUser();
            $rootScope.$apply();
            expect(loadingModalService.close).toHaveBeenCalled();
        });
    });
});
