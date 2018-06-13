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

    var $state, $controller, $q, $rootScope, loadingModalService, notificationService, authUserService, userPasswordModalFactoryMock, confirmService,
        vm, user, facilities, pendingVerificationEmail;

    beforeEach(function() {
        module('admin-user-form', function($provide) {
            authUserService = jasmine.createSpyObj('authUserService', ['saveUser', 'sendVerificationEmail']);
            $provide.service('authUserService', function() {
                return authUserService;
            });

            confirmService = jasmine.createSpyObj('confirmService', ['confirmDestroy']);
            $provide.service('confirmService', function() {
                return confirmService;
            });

            userPasswordModalFactoryMock = jasmine.createSpyObj('userPasswordModalFactoryMock', ['createPassword']);
            $provide.service('userPasswordModalFactory', function() {
                return userPasswordModalFactoryMock;
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

        facilities = [
            {
                id: 'facility-id-1',
                name: 'facility-1'
            },
            {
                id: 'facility-id-2',
                name: 'facility-2'
            }
        ];
        user = {
            id: 'user-id',
            username: 'random-user',
            email: 'random-email',
            homeFacilityId: facilities[0].id,
            roleAssignments: [
                {
                    roleId: 'role-id-1',
                    programId: 'program-id-1'
                },
                {
                    roleId: 'role-id-2',
                    warehouseId: 'warehouse-id-1'
                }
            ]
        };

        pendingVerificationEmail = {
            email: "example@test.org"
        };

        vm = $controller('UserFormController', {
            user: user,
            facilities: facilities,
            pendingVerificationEmail: pendingVerificationEmail
        });
        vm.$onInit();
    });

    describe('init', function() {

        it('should expose saveUser method', function() {
            expect(angular.isFunction(vm.saveUser)).toBe(true);
        });

        it('should expose removeHomeFacility method', function() {
            expect(angular.isFunction(vm.removeHomeFacility)).toBe(true);
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

        it('should set initialUsername', function() {
            expect(vm.initialUsername).toBe('random-user');
        });

        it('should set updateMode if there is no user passed to controller', function() {
            vm = $controller('UserFormController', {
                user: undefined,
                facilities: facilities,
                pendingVerificationEmail: pendingVerificationEmail
            });
            vm.$onInit();

            expect(vm.updateMode).toBe(false);
            expect(vm.user.loginRestricted).toBe(false);
            expect(vm.notification).toBe('adminUserForm.userCreatedSuccessfully');
        });

        it('should set pendingVerificationEmail', function() {
            expect(vm.pendingVerificationEmail).toBe(pendingVerificationEmail);
        });
    });

    describe('update user', function() {

        var deferred;

        beforeEach(function() {
            deferred = $q.defer();
            user.enabled = true;
            authUserService.saveUser.andReturn(deferred.promise);
        });

        it('should open loading modal', function() {
            vm.saveUser();
            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should call authUserService', function() {
            vm.saveUser();
            expect(authUserService.saveUser).toHaveBeenCalledWith(user);
        });

        it('should call authUserService with changes', function() {
            vm.user.username = 'newUserName';
            user.username = 'newUserName';

            vm.saveUser();
            $rootScope.$apply();

            expect(authUserService.saveUser).toHaveBeenCalledWith(user);
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

        it('should not show notification if request fails', function() {
            deferred.reject();
            vm.saveUser();
            $rootScope.$apply();
            expect(loadingModalService.close).toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
        });
    });

    describe('update user with home facility', function() {

        it('should show confirmation for removing user home facility roles if home facility changed', function() {
            vm.user.homeFacility = null;
            var expectedMessage = {
                'messageKey': 'adminUserForm.removeHomeFacility.confirmation',
                'messageParams': {
                    'facility': vm.initialHomeFacility.name,
                    'username': vm.user.username
                }
            };

            confirmService.confirmDestroy.andReturn($q.when(true));
            vm.saveUser();
            $rootScope.$apply();

            expect(confirmService.confirmDestroy).toHaveBeenCalledWith(
                expectedMessage,
                'adminUserForm.removeHomeFacility.removeRoles',
                'adminUserForm.removeHomeFacility.keepRoles'
            );
        });

        it('should keep user facility rights if user choose to keep them', function() {
            var deferred = $q.defer();

            vm.user.homeFacility = null;

            confirmService.confirmDestroy.andReturn(deferred.promise);
            deferred.reject();

            vm.saveUser();
            $rootScope.$apply();

            expect(authUserService.saveUser).toHaveBeenCalledWith(vm.user);
            expect(vm.user.roleAssignments.length).toBe(2);
        });

        it('should not keep user facility rights if user choose to remove them', function() {
            var confirmDeferred = $q.defer(),
                saveDeferred = $q.defer();

            vm.user.homeFacility = null;

            confirmService.confirmDestroy.andReturn(confirmDeferred.promise);
            confirmDeferred.resolve();

            authUserService.saveUser.andReturn($q.when(user));
            saveDeferred.resolve();

            vm.saveUser();
            $rootScope.$apply();

            expect(authUserService.saveUser).toHaveBeenCalledWith(vm.user);
            expect(vm.user.roleAssignments.length).toBe(1);
        });

    });

    describe('create user', function() {

        var deferred;

        beforeEach(function() {
            deferred = $q.defer();
            authUserService.saveUser.andReturn($q.when(user));
            userPasswordModalFactoryMock.createPassword.andReturn($q.when(user));

            vm = $controller('UserFormController', {
                user: undefined,
                facilities: facilities,
                pendingVerificationEmail: pendingVerificationEmail
            });
            vm.$onInit();
        });

        it('should open loading modal', function() {
            vm.saveUser();
            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should call authUserService', function() {
            vm.saveUser();
            expect(authUserService.saveUser).toHaveBeenCalled();
        });

        it('should call authUserService with changes', function() {
            vm.user.username = 'newUserName';
            vm.saveUser();
            expect(authUserService.saveUser).toHaveBeenCalledWith(vm.user);
        });

        it('should call userPasswordModalFactory', function() {
            deferred.resolve(user);
            vm.saveUser();
            $rootScope.$apply();

            expect(userPasswordModalFactoryMock.createPassword).toHaveBeenCalledWith(user);
        });

        it('should change email if it is empty string', function() {
            deferred.resolve(user);
            vm.saveUser();
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should call notificationService', function() {
            deferred.resolve(user);
            vm.saveUser();
            $rootScope.$apply();
            expect(notificationService.success).toHaveBeenCalledWith(vm.notification);
        });

        it('should should close loading modal if request failed', function() {
            deferred.reject();
            vm.saveUser();
            $rootScope.$apply();
            expect(loadingModalService.close).toHaveBeenCalled();
        });
    });

    describe('removeHomeFacility', function() {

        beforeEach(function() {
            confirmService.confirmDestroy.andReturn($q.when(true));
            vm.removeHomeFacility();
            $rootScope.$apply();
        });

        it('should show confirm modal', function() {
            expect(confirmService.confirmDestroy).toHaveBeenCalledWith('adminUserForm.removeHomeFacility.question', 'adminUserForm.removeHomeFacility.label');
        });

        it('should remove home facility from user json', function() {
            expect(vm.user.homeFacilityId).toBe(undefined);
        });

        it('should remove home facility role assignments', function() {
            expect(vm.user.roleAssignments.length).toBe(1);
            expect(vm.user.roleAssignments[0].programId).toBe(undefined);
        });
    });

    describe('sendVerificationEmail', function() {

        it('should send verification email', function () {
            authUserService.sendVerificationEmail.andReturn($q.when(true));
            vm.sendVerificationEmail();
            $rootScope.$apply();

            expect(authUserService.sendVerificationEmail).toHaveBeenCalledWith(vm.user.id);
            expect(notificationService.success).toHaveBeenCalledWith('adminUserForm.sendVerificationEmail.success');
        });

    });

});
