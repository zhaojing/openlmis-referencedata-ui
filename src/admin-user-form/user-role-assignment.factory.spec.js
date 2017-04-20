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
        roles, roleAssignments;

    beforeEach(function() {
        module('admin-user-form');

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

        roleAssignments = [
            {
                programCode: 'PR-1',
                roleId: roles[0].id
            },
            {
                programCode: 'PR-2',
                roleId: roles[0].id
            },
            {
                programCode: 'PR-3',
                roleId: roles[1].id
            }
        ];
    });

    describe('addInfoToRoleAssignments', function() {

        it('should expose addInfoToRoleAssignments method', function() {
            expect(angular.isFunction(userRoleAssignmentFactory.addInfoToRoleAssignments)).toBe(true);
        });

        it('should set types property for all roles', function() {
            userRoleAssignmentFactory.addInfoToRoleAssignments(roleAssignments, roles);
            expect(roleAssignments[0].$type).toEqual(roles[0].rights[0].type);
            expect(roleAssignments[1].$type).toEqual(roles[0].rights[0].type);
            expect(roleAssignments[2].$type).toEqual(roles[1].rights[0].type);
        });

        it('should set names property for all roles', function() {
            userRoleAssignmentFactory.addInfoToRoleAssignments(roleAssignments, roles);
            expect(roleAssignments[0].$name).toEqual(roles[0].name);
            expect(roleAssignments[1].$name).toEqual(roles[0].name);
            expect(roleAssignments[2].$name).toEqual(roles[1].name);
        });
    });
});
