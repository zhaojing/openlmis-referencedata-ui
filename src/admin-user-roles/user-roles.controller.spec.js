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

describe('UserRolesController', function() {

    var $state, $q, $controller, $rootScope, ROLE_TYPES, referencedataUserService, notificationService, loadingModalService,
        vm, user;

    beforeEach(function() {

        module('admin-user-roles', function($provide) {

            referencedataUserService = jasmine.createSpyObj('referencedataUserService', ['saveUser']);
            $provide.service('referencedataUserService', function() {
                return referencedataUserService;
            });

            notificationService = jasmine.createSpyObj('notificationService', ['error', 'success']);
            $provide.service('notificationService', function() {
                return notificationService;
            });

            loadingModalService = jasmine.createSpyObj('loadingModalService', ['close', 'open']);
            $provide.service('loadingModalService', function() {
                return loadingModalService;
            });
        });

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            $state = $injector.get('$state');
            $q = $injector.get('$q');
            ROLE_TYPES = $injector.get('ROLE_TYPES');
        });

        user = {
            roleAssignments: [
                {
                    roleId: 'role-id-1',
                    supervisoryNodeId: 'node-id-1',
                    programId: 'program-id-1',
                    type: ROLE_TYPES.SUPERVISION
                },
                {
                    roleId: 'role-id-2',
                    type: ROLE_TYPES.GENERAL_ADMIN
                }
            ]
        };

        vm = $controller('UserRolesController', {
            user: user
        });

        vm.$onInit();
        $rootScope.$apply();

        spyOn($state, 'go').andReturn();
    });

    describe('on init', function() {

        it('should expose saveUserRoles method', function() {
            expect(angular.isFunction(vm.saveUserRoles)).toBe(true);
        });

        it('should expose goToUserList method', function() {
            expect(angular.isFunction(vm.goToUserList)).toBe(true);
        });

        it('should set user', function() {
            expect(vm.user).toEqual(user);
        });

        it('should set types', function() {
            expect(vm.types).toEqual(ROLE_TYPES.getRoleTypes());
        });
    });

    describe('saveUser', function() {

        beforeEach(function() {
            referencedataUserService.saveUser.andReturn($q.when(true));
            loadingModalService.open.andReturn($q.when(true));
            vm.saveUserRoles();
        });

        it('should open loading modal', function() {
            expect(loadingModalService.open).toHaveBeenCalledWith(true);
        });

        it('should call referencedataUserService', function() {
            expect(referencedataUserService.saveUser).toHaveBeenCalledWith(user);
        });

        it('should show success notification', function() {
            $rootScope.$apply();
            expect(notificationService.success).toHaveBeenCalledWith('adminUserRoles.updateSuccessful');
        });

        it('should redirect to users list', function() {
            $rootScope.$apply();
            expect($state.go).toHaveBeenCalledWith('openlmis.administration.users', {}, {
                    reload: true
                });
        });

        it('should close loading modal', function() {
            $rootScope.$apply();
            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('should show error notification if save failed', function() {
            var deferred = $q.defer();
            deferred.reject();

            $rootScope.$apply();
            referencedataUserService.saveUser.andReturn(deferred.promise);
            vm.saveUserRoles();
            $rootScope.$apply();

            expect(notificationService.error).toHaveBeenCalledWith('adminUserRoles.updateFailed');
        });
    });

    describe('goToUserList', function() {

        beforeEach(function() {
            vm.goToUserList();
        });

        it('should redirect to users list page', function() {
            expect($state.go).toHaveBeenCalledWith('openlmis.administration.users', {}, {
                reload: true
            });
        });
    });

    describe('getRoleTypeLabel', function() {

        it('should redirect to users list page', function() {
            expect(vm.getRoleTypeLabel(ROLE_TYPES.SUPERVISION)).toEqual(ROLE_TYPES.getLabel(ROLE_TYPES.SUPERVISION));
        });
    });
});
