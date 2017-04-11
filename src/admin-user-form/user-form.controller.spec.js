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

    var $state, $controller, $q, $rootScope, loadingModalService, notificationService, referencedataUserService, authUserService, UserPasswordModal, UserAddRoleModal,
        vm, user, roles, supervisoryNodes, programs, warehouses;

    beforeEach(function() {
        module('admin-user-form', function($provide) {
            referencedataUserService = jasmine.createSpyObj('referencedataUserService', ['createUser']);
            $provide.service('referencedataUserService', function() {
                return referencedataUserService;
            });

            userRoleAssignmentFactory = jasmine.createSpyObj('userRoleAssignmentFactory', ['addTypeToRoleAssignments']);
            $provide.service('userRoleAssignmentFactory', function() {
                return userRoleAssignmentFactory;
            });

            authUserService = jasmine.createSpyObj('authUserService', ['saveUser']);
            $provide.service('authUserService', function() {
                return authUserService;
            });

            UserPasswordModal = jasmine.createSpy('UserPasswordModalMock');
            $provide.service('UserPasswordModal', function() {
                return UserPasswordModal;
            });

            UserAddRoleModal = jasmine.createSpy('UserAddRoleModal');
            $provide.service('UserAddRoleModal', function() {
                return UserAddRoleModal;
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

        roles = [
            {
                id: 'role-id-1',
                name: 'role-1'
            },
            {
                id: 'role-id-2',
                name: 'role-2'
            },
            {
                id: 'role-id-3',
                name: 'role-3'
            },
            {
                id: 'role-id-4',
                name: 'role-4'
            }
        ];
        programs = [
            {
                id: 'program-id-1',
                name: 'program-1',
                code: 'PR-1'
            },
            {
                id: 'program-id-2',
                name: 'program-2',
                code: 'PR-2'
            }
        ];
        supervisoryNodes = [
            {
                id: 'supervisory-node-id-1',
                $display: 'supervisory-node-1',
                code: 'SN-1'
            },
            {
                id: 'supervisory-node-id-2',
                $display: 'supervisory-node-2',
                code: 'SN-2'
            }
        ];
        warehouses = [
            {
                id: 'warehouse-id-1',
                name: 'warehouse-1',
                code: 'WH-1'
            },
            {
                id: 'warehouse-id-2',
                name: 'warehouse-2',
                code: 'WH-2'
            }
        ];
        user = {
            id: 'user-id',
            username: 'random-user',
            roleAssignments: [
                {
                    roleId: 'role-id-1',
                    warehouseCode: warehouses[0].code
                },
                {
                    roleId: 'role-id-2',
                    supervisoryNodeCode: supervisoryNodes[0].code,
                    programCode: programs[0].code
                }
            ]
        };

        vm = $controller('UserFormController', {
            user: user,
            roles: roles,
            supervisoryNodes: supervisoryNodes,
            programs: programs,
            warehouses: warehouses
        });
        vm.$onInit();
    });

    describe('init', function() {

        it('should expose createUser method', function() {
            expect(angular.isFunction(vm.createUser)).toBe(true);
        });

        it('should expose getRoleName method', function() {
            expect(angular.isFunction(vm.getRoleName)).toBe(true);
        });

        it('should expose getProgramName method', function() {
            expect(angular.isFunction(vm.getProgramName)).toBe(true);
        });

        it('should expose getSupervisoryNodeName method', function() {
            expect(angular.isFunction(vm.getSupervisoryNodeName)).toBe(true);
        });

        it('should expose getWarehouseName method', function() {
            expect(angular.isFunction(vm.getWarehouseName)).toBe(true);
        });

        it('should expose removeRole method', function() {
            expect(angular.isFunction(vm.removeRole)).toBe(true);
        });

        it('should expose addRole method', function() {
            expect(angular.isFunction(vm.addRole)).toBe(true);
        });

        it('should set user', function() {
            expect(vm.user).toBe(user);
        });

        it('should set roles', function() {
            expect(vm.roles).toBe(roles);
        });

        it('should set supervisoryNodes', function() {
            expect(vm.supervisoryNodes).toBe(supervisoryNodes);
        });

        it('should set programs', function() {
            expect(vm.programs).toBe(programs);
        });

        it('should set warehouses', function() {
            expect(vm.warehouses).toBe(warehouses);
        });

        it('should set notification', function() {
            expect(vm.notification).toBe('adminUserForm.userUpdatedSuccessfully');
        });

        it('should set updateMode', function() {
            expect(vm.updateMode).toBe(true);
        });

        it('should set updateMode if there is no user passed to controller', function() {
            vm = $controller('UserFormController', {
                user: undefined,
                roles: roles,
                supervisoryNodes: supervisoryNodes,
                programs: programs,
                warehouses: warehouses
            });
            vm.$onInit();

            expect(vm.updateMode).toBe(false);
            expect(vm.user.roleAssignments).toEqual([]);
            expect(vm.user.loginRestricted).toBe(false);
            expect(vm.notification).toBe('adminUserForm.userCreatedSuccessfully');
        });
    });

    describe('update user', function() {

        var deferred;

        beforeEach(function() {
            deferred = $q.defer();
            referencedataUserService.createUser.andReturn(deferred.promise);
        });

        it('should open loading modal', function() {
            vm.createUser();
            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should call referencedataUserService', function() {
            vm.createUser();
            expect(referencedataUserService.createUser).toHaveBeenCalledWith(user);
        });

        it('should call referencedataUserService with changes', function() {
            vm.user.username = 'newUserName';
            user.username = 'newUserName';

            vm.createUser();
            expect(referencedataUserService.createUser).toHaveBeenCalledWith(user);
        });

        it('should show notification', function() {
            deferred.resolve();
            vm.createUser();
            $rootScope.$apply();

            expect(notificationService.success).toHaveBeenCalledWith(vm.notification);
        });

        it('should redirect to parent state', function() {
            deferred.resolve();
            vm.createUser();
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should close loading modal', function() {
            deferred.resolve();
            vm.createUser();
            $rootScope.$apply();
            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('should not show notification if request fails', function() {
            deferred.reject();
            vm.createUser();
            $rootScope.$apply();
            expect(loadingModalService.close).toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
        });
    });

    describe('create user', function() {

        beforeEach(function() {
            referencedataUserService.createUser.andReturn($q.when(user));
            authUserService.saveUser.andReturn($q.when(user));
            UserPasswordModal.andReturn($q.when(user));

            vm = $controller('UserFormController', {
                user: undefined,
                roles: roles,
                supervisoryNodes: supervisoryNodes,
                programs: programs,
                warehouses: warehouses
            });
            vm.$onInit();
        });

        it('should open loading modal', function() {
            vm.createUser();
            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should call referencedataUserService', function() {
            vm.createUser();
            expect(referencedataUserService.createUser).toHaveBeenCalled();
        });

        it('should call referencedataUserService with changes', function() {
            vm.user.username = 'newUserName';
            vm.createUser();
            expect(referencedataUserService.createUser).toHaveBeenCalledWith(vm.user);
        });

        it('should call authUserService', function() {
            vm.createUser();
            $rootScope.$apply();

            expect(authUserService.saveUser).toHaveBeenCalledWith({
                enabled: true,
                referenceDataUserId: user.id,
                role: 'USER',
                username: user.username
            });
        });

        it('should call UserPasswordModal', function() {
            vm.createUser();
            $rootScope.$apply();

            expect(UserPasswordModal).toHaveBeenCalledWith(user.username);
        });

        it('should change email if it is empty string', function() {
            vm.createUser();
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should call notificationService', function() {
            vm.createUser();
            $rootScope.$apply();
            expect(notificationService.success).toHaveBeenCalledWith(vm.notification);
        });

        it('should close loading modal', function() {
            vm.createUser();
            $rootScope.$apply();
            expect(loadingModalService.close).toHaveBeenCalled();
        });
    });

    describe('getSupervisoryNodeName', function() {

        it('should get proper name', function() {
            expect(vm.getSupervisoryNodeName(supervisoryNodes[0].code)).toBe(supervisoryNodes[0].$display);
        });

        it('should return undefined if there is no code passed to method', function() {
            expect(vm.getSupervisoryNodeName()).toBe(undefined);
        });
    });

    describe('getProgramName', function() {

        it('should get proper name', function() {
            expect(vm.getProgramName(programs[0].code)).toBe(programs[0].name);
        });

        it('should return undefined if there is no code passed to method', function() {
            expect(vm.getSupervisoryNodeName()).toBe(undefined);
        });
    });

    describe('getWarehouseName', function() {

        it('should get proper name', function() {
            expect(vm.getWarehouseName(warehouses[0].code)).toBe(warehouses[0].name);
        });

        it('should return undefined if there is no code passed to method', function() {
            expect(vm.getWarehouseName()).toBe(undefined);
        });
    });

    describe('getRoleName', function() {

        it('should get proper name', function() {
            expect(vm.getRoleName(roles[0].id)).toBe(roles[0].name);
        });

        it('should return undefined if there is no id passed to method', function() {
            expect(vm.getRoleName()).toBe(undefined);
        });
    });

    describe('removeRole', function() {

        it('should remove role from user role assignments', function() {
            var roleAssignmentsCount = user.roleAssignments.length;
            vm.removeRole(vm.user.roleAssignments[0]);
            expect(vm.user.roleAssignments.length).toBe(roleAssignmentsCount - 1);
        });

        it('should not remove role from user role assignments', function() {
            vm.removeRole('some role');
            expect(vm.user.roleAssignments.length).toBe(user.roleAssignments.length);
        });
    });

    describe('addRole', function() {

        var newRole = 'newRole';

        beforeEach(function() {
            UserAddRoleModal.andReturn($q.when(newRole));
            userRoleAssignmentFactory.addTypeToRoleAssignments.andReturn(newRole);
            vm.addRole();
            $rootScope.$apply();
        });

        it('should call UserAddRoleModal', function() {
            expect(UserAddRoleModal).toHaveBeenCalledWith(user, [supervisoryNodes[1]], programs, warehouses, roles);
        });

        it('should call userRoleAssignmentFactory', function() {
            expect(userRoleAssignmentFactory.addTypeToRoleAssignments).toHaveBeenCalledWith([newRole], roles);
        });

        it('should add new role assignment to user', function() {
            expect(vm.user.roleAssignments.length).toEqual(3);
            expect(vm.user.roleAssignments[2]).toEqual(newRole);
        });
    });
});
