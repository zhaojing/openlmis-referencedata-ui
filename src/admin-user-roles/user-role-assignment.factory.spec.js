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

    var userRoleAssignmentFactory,
        roles, programs, supervisoryNodes, warehouses, roleAssignments;

    beforeEach(function() {
        module('admin-user-roles');

        inject(function($injector) {
            userRoleAssignmentFactory = $injector.get('userRoleAssignmentFactory');
        });

        roles = [
            {
                id: '1',
                name: 'Warehouse Clerk',
                rights: [
                    {
                        type: 'type-1'
                    }
                ]
            },
            {
                id: '2',
                name: 'Storeroom Manager',
                rights: [
                    {
                        type: 'type-2'
                    }
                ]
            }
        ];
        programs = [
            {
                code: 'program-code-1',
                name: 'program-1'
            },
            {
                code: 'program-code-2',
                name: 'program-2'
            }
        ];
        supervisoryNodes = [
            {
                code: 'supervisory-node-code-1',
                $display: 'supervisory-node-1'
            }
        ];
        warehouses = [
            {
                code: 'warehouse-code-1',
                name: 'warehouse-1'
            }
        ];

        roleAssignments = [
            {
                programCode: 'program-code-1',
                roleId: roles[0].id
            },
            {
                programCode: 'program-code-2',
                supervisoryNodeCode: 'supervisory-node-code-1',
                roleId: roles[0].id
            },
            {
                warehouseCode: 'warehouse-code-1',
                roleId: roles[1].id
            },

        ];
    });

    describe('addInfoToRoleAssignments', function() {

        beforeEach(function() {
            userRoleAssignmentFactory.addInfoToRoleAssignments(roleAssignments, roles, programs, supervisoryNodes, warehouses);
        });

        it('should expose addInfoToRoleAssignments method', function() {
            expect(angular.isFunction(userRoleAssignmentFactory.addInfoToRoleAssignments)).toBe(true);
        });

        it('should set type properties for all assignments', function() {
            expect(roleAssignments[0].$type).toEqual(roles[0].rights[0].type);
            expect(roleAssignments[1].$type).toEqual(roles[0].rights[0].type);
            expect(roleAssignments[2].$type).toEqual(roles[1].rights[0].type);
        });

        it('should set role name properties for all assignments', function() {
            expect(roleAssignments[0].$roleName).toEqual(roles[0].name);
            expect(roleAssignments[1].$roleName).toEqual(roles[0].name);
            expect(roleAssignments[2].$roleName).toEqual(roles[1].name);
        });

        it('should set program name properties for all assignments', function() {
            expect(roleAssignments[0].$programName).toEqual(programs[0].name);
            expect(roleAssignments[1].$programName).toEqual(programs[1].name);
        });

        it('should set supervisory node name properties for all assignments', function() {
            expect(roleAssignments[1].$supervisoryNodeName).toEqual(supervisoryNodes[0].$display);
        });

        it('should set warehouse name properties for all assignments', function() {
            expect(roleAssignments[2].$warehouseName).toEqual(warehouses[0].name);
        });
    });
});
