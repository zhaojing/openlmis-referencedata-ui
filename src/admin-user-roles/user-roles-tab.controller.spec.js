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

    var $state, $q, $controller, $rootScope, ROLE_TYPES, loadingModalService, confirmService, UserDataBuilder, RoleDataBuilder, ProgramDataBuilder, FacilityDataBuilder, SupervisoryNodeDataBuilder,
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

            UserDataBuilder = $injector.get('UserDataBuilder');
            RoleDataBuilder = $injector.get('RoleDataBuilder');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
        });

        supervisoryNodes = [
            new SupervisoryNodeDataBuilder().build(),
            new SupervisoryNodeDataBuilder().build(),
        ];
        warehouses = [
            new FacilityDataBuilder().build(),
            new FacilityDataBuilder().build()
        ];
        programs = [
            new ProgramDataBuilder().build(),
            new ProgramDataBuilder().build()
        ];

        roles = [
            new RoleDataBuilder().withSupervisionType().build(),
            new RoleDataBuilder().withSupervisionType().build()
        ];

        user = new UserDataBuilder()
            .withSupervisionRoleAssignment(roles[0].id, supervisoryNodes[0].id, programs[0].id)
            .withGeneralAdminRoleAssignment(roles[1].id)
            .build();

        stateParams = {
            page: 0,
            size: 10
        };

        vm = $controller('UserRolesTabController', {
            $stateParams: stateParams,
            user: user,
            filteredRoles: roles,
            supervisoryNodes: supervisoryNodes,
            warehouses: warehouses,
            programs: programs,
            filteredRoleAssignments: [user.roleAssignments[0]],
            tab: ROLE_TYPES.SUPERVISION
        });

        vm.$onInit();
        $rootScope.$apply();

        spyOn($state, 'go').andReturn();
    });

    describe('on init', function() {

        it('should set supervisoryNodes', function() {
            expect(vm.supervisoryNodes).toEqual(supervisoryNodes);
        });

        it('should set warehouses', function() {
            expect(vm.warehouses).toEqual(warehouses);
        });

        it('should set programs', function() {
            expect(vm.programs).toEqual(programs);
        });

        it('should set selectedType', function() {
            expect(vm.selectedType).toEqual(ROLE_TYPES.SUPERVISION);
        });

        it('should set filteredRoleAssignments', function() {
            expect(vm.filteredRoleAssignments.length).toBe(1);
            expect(vm.filteredRoleAssignments[0]).toEqual(user.roleAssignments[0]);
        });

        it('should set filteredRoles', function() {
            expect(vm.filteredRoles).toEqual(roles);
        });
    });

    describe('addRole', function() {

        it('should return promise', function() {
            expect(angular.isFunction(vm.addRole().then)).toBe(true);
        });

        it('should display error notification if role is already assigned', function() {
            var roleAssignmentsCount = user.roleAssignments.length;

            vm.selectedRole = roles[0];
            vm.selectedProgram = programs[0];
            vm.selectedSupervisoryNode = supervisoryNodes[0];

            vm.addRole();

            expect(user.roleAssignments.length).toEqual(roleAssignmentsCount);
            expect(notificationService.error).toHaveBeenCalledWith('referencedataRoles.roleAlreadyAssigned');
        });

        it('should add role without supervisory node if the same role with supervisory node already exists', function() {
            var roleAssignmentsCount = user.roleAssignments.length;

            vm.selectedRole = roles[0];
            vm.selectedProgram = programs[0];
            vm.selectedSupervisoryNode = undefined;

            vm.addRole();

            expect(user.roleAssignments.length).toEqual(roleAssignmentsCount + 1);
        });

        it('should display error notification if home facility role cannot be assigned', function() {
            var roleAssignmentsCount = user.roleAssignments.length;

            vm.selectedRole = roles[1];
            vm.selectedProgram = programs[1];
            user.homeFacilityId = undefined;

            vm.addRole();

            expect(user.roleAssignments.length).toEqual(roleAssignmentsCount);
            expect(notificationService.error).toHaveBeenCalledWith('referencedataRoles.homeFacilityRoleInvalid');
        });

        it('should add new supervision role assignment', function() {
            var roleAssignmentsCount = user.roleAssignments.length;

            vm.selectedRole = roles[1];
            vm.selectedProgram = programs[1];
            vm.selectedSupervisoryNode = supervisoryNodes[1];

            vm.addRole();

            expect(user.roleAssignments.length).toEqual(roleAssignmentsCount + 1);
            expect(notificationService.error).not.toHaveBeenCalled();
            expect(user.roleAssignments[roleAssignmentsCount].roleId).toEqual(roles[1].id);
            expect(user.roleAssignments[roleAssignmentsCount].roleName).toEqual(roles[1].name);
            expect(user.roleAssignments[roleAssignmentsCount].programName).toEqual(programs[1].name);
            expect(user.roleAssignments[roleAssignmentsCount].supervisoryNodeName).toEqual(supervisoryNodes[1].$display);
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
