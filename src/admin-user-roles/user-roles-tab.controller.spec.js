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

describe('UserRolesTabController', function() {

    var $state, $q, $controller, $rootScope, ROLE_TYPES, loadingModalService, confirmService,
        stateParams, vm, user, roles, supervisoryNodes, warehouses, programs;

    beforeEach(function() {

        module('admin-user-roles', function($provide) {
            confirmService = jasmine.createSpyObj('confirmService', ['confirmDestroy']);
            $provide.service('confirmService', function() {
                return confirmService;
            });

            notificationService = jasmine.createSpyObj('notificationService', ['error', 'success']);
            $provide.service('notificationService', function() {
                return notificationService;
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
                    $type: ROLE_TYPES[0].name
                },
                {
                    roleId: 'role-id-2',
                    $type: ROLE_TYPES[3].name
                }
            ]
        };
        roles = [
            {
                name: 'role-1',
                id: 'role-id-1',
                $type: ROLE_TYPES[0].name
            },
            {
                name: 'role-2',
                id: 'role-id-2',
                $type: ROLE_TYPES[3].name
            },
            {
                name: 'role-3',
                id: 'role-id-3',
                $type: ROLE_TYPES[0].name
            },
            {
                name: 'role-4',
                id: 'role-id-4',
                $type: ROLE_TYPES[1].name
            }
        ];
        supervisoryNodes = [
            {
                id: 'node-id-1',
                $display: 'node-1'
            },
            {
                id: 'node-id-2',
                $display: 'node-2'
            }
        ];
        warehouses = [
            {
                id: 'warehouse-id-1',
                name: 'warehouse-1'
            },
            {
                id: 'warehouse-id-2',
                name: 'warehouse-2'
            }
        ];
        programs = [
            {
                id: 'program-id-1',
                name: 'program-1'
            },
            {
                id: 'program-id-2',
                name: 'program-2'
            }
        ];

        stateParams = {
            tab: 0
        };

        vm = $controller('UserRolesTabController', {
            $stateParams: stateParams,
            user: user,
            roles: roles,
            supervisoryNodes: supervisoryNodes,
            warehouses: warehouses,
            programs: programs,
            filteredRoleAssignments: user.roleAssignments
        });

        vm.$onInit();
        $rootScope.$apply();

        spyOn($state, 'go').andReturn();
    });

    describe('on init', function() {

        it('should expose removeRole method', function() {
            expect(angular.isFunction(vm.removeRole)).toBe(true);
        });

        it('should expose addRole method', function() {
            expect(angular.isFunction(vm.addRole)).toBe(true);
        });

        it('should expose isFulfillmentType method', function() {
            expect(angular.isFunction(vm.isFulfillmentType)).toBe(true);
        });

        it('should expose isSupervisionType method', function() {
            expect(angular.isFunction(vm.isSupervisionType)).toBe(true);
        });

        it('should set roles', function() {
            expect(vm.roles).toEqual(roles);
        });

        it('should set supervisoryNodes', function() {
            expect(vm.supervisoryNodes).toEqual(supervisoryNodes);
        });

        it('should set warehouses', function() {
            expect(vm.warehouses).toEqual(warehouses);
        });

        it('should set programs', function() {
            expect(vm.programs).toEqual(programs);
        });

        it('should set types', function() {
            expect(vm.types).toEqual(ROLE_TYPES);
        });

        it('should set selectedType', function() {
            expect(vm.selectedType).toEqual(0);
        });

        it('should set filteredRoleAssignments', function() {
            expect(vm.filteredRoleAssignments).toEqual(user.roleAssignments);
        });

        it('should set filteredRoles', function() {
            expect(vm.filteredRoles).toEqual([roles[0], roles[2]]);
        });
    });

    describe('isSupervisionType', function() {

        it('should return true if selected type is supervision', function() {
            expect(vm.isSupervisionType()).toBe(true);
        });

        it('should return false if selected type is not supervision', function() {
            vm.selectedType = 1;
            expect(vm.isSupervisionType()).toBe(false);
        });
    });

    describe('isFulfillmentType', function() {

        it('should return true if selected type is fulfillment', function() {
            vm.selectedType = 1;
            expect(vm.isFulfillmentType()).toBe(true);
        });

        it('should return false if selected type is not fulfillment', function() {
            expect(vm.isFulfillmentType()).toBe(false);
        });
    });

    describe('addRole', function() {

        it('should return promise', function() {
            expect(angular.isFunction(vm.addRole().then)).toBe(true);
        });

        it('should display error notification if role is already assigned', function() {
            var roleAssignmentsCount = user.roleAssignments.length;

            vm.selectedRole = roles[1];
            vm.selectedType = 3;

            vm.addRole();

            expect(user.roleAssignments.length).toEqual(roleAssignmentsCount);
            expect(notificationService.error).toHaveBeenCalledWith('adminUserRoles.roleAlreadyAssigned');
        });

        it('should display error notification if supervision role is invalid', function() {
            var roleAssignmentsCount = user.roleAssignments.length;

            vm.selectedRole = roles[2];
            vm.selectedProgram = undefined;

            vm.addRole();

            expect(user.roleAssignments.length).toEqual(roleAssignmentsCount);
            expect(notificationService.error).toHaveBeenCalledWith('adminUserRoles.supervisionInvalid');
        });

        it('should display error notification if home facility role cannot be assigned', function() {
            var roleAssignmentsCount = user.roleAssignments.length;

            vm.selectedRole = roles[2];
            vm.selectedProgram = programs[1];
            user.homeFacilityId = undefined;

            vm.addRole();

            expect(user.roleAssignments.length).toEqual(roleAssignmentsCount);
            expect(notificationService.error).toHaveBeenCalledWith('adminUserRoles.homeFacilityRoleInvalid');
        });

        it('should display error notification if fulfillment role is invalid', function() {
            var roleAssignmentsCount = user.roleAssignments.length;

            vm.selectedType = 1;
            vm.selectedRole = roles[3];

            vm.addRole();

            expect(user.roleAssignments.length).toEqual(roleAssignmentsCount);
            expect(notificationService.error).toHaveBeenCalledWith('adminUserRoles.fulfillmentInvalid');
        });

        it('should add new supervision role assignment', function() {
            var roleAssignmentsCount = user.roleAssignments.length;

            vm.selectedRole = roles[2];
            vm.selectedProgram = programs[1];
            vm.selectedSupervisoryNode = supervisoryNodes[1];

            vm.addRole();

            expect(user.roleAssignments.length).toEqual(roleAssignmentsCount + 1);
            expect(notificationService.error).not.toHaveBeenCalled();
            expect(user.roleAssignments[roleAssignmentsCount].roleId).toEqual(roles[2].id);
            expect(user.roleAssignments[roleAssignmentsCount].$roleName).toEqual(roles[2].name);
            expect(user.roleAssignments[roleAssignmentsCount].$programName).toEqual(programs[1].name);
            expect(user.roleAssignments[roleAssignmentsCount].$supervisoryNodeName).toEqual(supervisoryNodes[1].$display);
        });
    });

    describe('removeRole', function() {

        var roleAssignmentsCount;

        beforeEach(function() {
            confirmService.confirmDestroy.andReturn($q.when(true));
            roleAssignmentsCount = user.roleAssignments.length;
        });

        it('should show confirm modal', function() {
            vm.removeRole(user.roleAssignments[0]);
            expect(confirmService.confirmDestroy).toHaveBeenCalledWith('adminUserRoles.removeRole.question', 'adminUserRoles.removeRole.label');
        });

        it('should remove role assignment if it exists', function() {
            vm.removeRole(user.roleAssignments[0]);
            $rootScope.$apply();
            expect(user.roleAssignments.length).toEqual(roleAssignmentsCount - 1);
        });

        it('should not remove role assignment if it does not exists', function() {
            vm.removeRole('roleAssignment');
            $rootScope.$apply();
            expect(user.roleAssignments.length).toEqual(roleAssignmentsCount);
        });
    });
});
