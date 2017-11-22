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

describe('userRoleAssignmentFactory', function() {

    var $q, $rootScope, userRoleAssignmentFactory, UserDataBuilder, RoleDataBuilder, ProgramDataBuilder, FacilityDataBuilder, SupervisoryNodeDataBuilder,
        roles, programs, supervisoryNodes, warehouses, user;

    beforeEach(function() {
        module('admin-user-roles');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            userRoleAssignmentFactory = $injector.get('userRoleAssignmentFactory');
            referencedataUserService = $injector.get('referencedataUserService');

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
            new RoleDataBuilder().withSupervisionType().withRight({type: 'type-1'}).build(),
            new RoleDataBuilder().withGeneralAdminType().withRight({type: 'type-2'}).build(),
            new RoleDataBuilder().withOrderFulfillmentType().withRight({type: 'type-3'}).build()
        ];

        user = new UserDataBuilder()
            .withSupervisionRoleAssignment(roles[0].id, supervisoryNodes[0].id, programs[0].id)
            .withGeneralAdminRoleAssignment(roles[1].id)
            .withOrderFulfillmentRoleAssignment(roles[2].id, warehouses[0].id)
            .build();
    });

    describe('getUser', function() {

        var resultUser;

        beforeEach(function() {
            spyOn(referencedataUserService, 'get').andReturn($q.resolve(user));
            userRoleAssignmentFactory.getUser(user.id, roles, programs, supervisoryNodes, warehouses).then(function(response) {
                resultUser = response;
            });
            $rootScope.$apply();
        });

        it('should expose addInfoToRoleAssignments method', function() {
            expect(angular.isFunction(userRoleAssignmentFactory.getUser)).toBe(true);
        });

        it('should call referencedataUserService', function() {
            expect(referencedataUserService.get).toHaveBeenCalledWith(user.id);
        });

        it('should set type properties for all assignments', function() {
            expect(resultUser.roleAssignments[0].$type).toEqual(roles[0].rights[0].type);
            expect(resultUser.roleAssignments[1].$type).toEqual(roles[1].rights[0].type);
            expect(resultUser.roleAssignments[2].$type).toEqual(roles[2].rights[0].type);
        });

        it('should set role name properties for all assignments', function() {
            expect(resultUser.roleAssignments[0].$roleName).toEqual(roles[0].name);
            expect(resultUser.roleAssignments[1].$roleName).toEqual(roles[1].name);
            expect(resultUser.roleAssignments[2].$roleName).toEqual(roles[2].name);
        });

        it('should set program name properties for all assignments', function() {
            expect(resultUser.roleAssignments[0].$programName).toEqual(programs[0].name);
        });

        it('should set supervisory node name properties for all assignments', function() {
            expect(resultUser.roleAssignments[1].$supervisoryNodeName).toEqual(supervisoryNodes[0].$display);
        });

        it('should set warehouse name properties for all assignments', function() {
            expect(resultUser.roleAssignments[2].$warehouseName).toEqual(warehouses[0].name);
        });
    });
});
