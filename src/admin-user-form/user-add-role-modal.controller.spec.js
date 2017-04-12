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

describe('UserAddRoleModalController', function() {

    var $controller, $q, $rootScope,
        vm, user, roles, supervisoryNodes, programs, warehouses, modalDeferred;

    beforeEach(function() {
        module('admin-user-form');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            ROLE_TYPES = $injector.get('ROLE_TYPES');
        });

        roles = [
            {
                id: 'role-id-1',
                name: 'role-1',
                rights: [
                    {
                        type: ROLE_TYPES.SUPERVISION
                    }
                ],
                $type: ROLE_TYPES.SUPERVISION
            },
            {
                id: 'role-id-2',
                name: 'role-2',
                rights: [
                    {
                        type: ROLE_TYPES.SUPERVISION
                    }
                ],
                $type: ROLE_TYPES.SUPERVISION
            },
            {
                id: 'role-id-3',
                name: 'role-3',
                rights: [
                    {
                        type: ROLE_TYPES.GENERAL_ADMIN
                    }
                ],
                $type: ROLE_TYPES.GENERAL_ADMIN
            },
            {
                id: 'role-id-4',
                name: 'role-4',
                rights: [
                    {
                        type: ROLE_TYPES.ORDER_FULFILLMENT
                    }
                ],
                $type: ROLE_TYPES.ORDER_FULFILLMENT
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
                name: 'supervisory-node-1',
                code: 'SN-1'
            },
            {
                id: 'supervisory-node-id-2',
                name: 'supervisory-node-2',
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
                    roleId: 'role-id-4',
                    warehouseCode: warehouses[0].code
                },
                {
                    roleId: 'role-id-2',
                    supervisoryNodeCode: supervisoryNodes[0].code,
                    programCode: programs[0].code
                }
            ]
        };
        modalDeferred = $q.defer();

        vm = $controller('UserAddRoleModalController', {
            user: user,
            roles: roles,
            supervisoryNodes: supervisoryNodes,
            programs: programs,
            warehouses: warehouses,
            modalDeferred: modalDeferred,
            newRoleAssignment: {
                role: undefined,
                warehouse: undefined,
                program: undefined,
                supervisoryNode: undefined,
                type: undefined
            }
        });
        vm.$onInit();
    });

    describe('init', function() {

        it('should expose addRole method', function() {
            expect(angular.isFunction(vm.addRole)).toBe(true);
        });

        it('should expose loadRoles method', function() {
            expect(angular.isFunction(vm.loadRoles)).toBe(true);
        });

        it('should expose isSupervisionType method', function() {
            expect(angular.isFunction(vm.isSupervisionType)).toBe(true);
        });

        it('should expose isFulfillmentType method', function() {
            expect(angular.isFunction(vm.isFulfillmentType)).toBe(true);
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

        it('should set role types', function() {
            expect(vm.types).toEqual(ROLE_TYPES);
        });
    });

    describe('loadRoles', function() {

        beforeEach(function() {
            vm.newRoleAssignment.role = roles[1];
            vm.newRoleAssignment.type = ROLE_TYPES.GENERAL_ADMIN;
            vm.loadRoles();
        });

        it('should load new roles', function() {
            expect(vm.filteredRoles.length).toBe(1);
            expect(vm.filteredRoles[0]).toEqual(roles[2]);
        });

        it('should clear selected role', function() {
            expect(vm.newRoleAssignment.role).toBe(undefined);
        });
    });

    describe('loadRoles', function() {

        beforeEach(function() {
            vm.newRoleAssignment.role = roles[1];
            vm.newRoleAssignment.type = ROLE_TYPES.GENERAL_ADMIN;
            vm.loadRoles();
        });

        it('should load new roles', function() {
            expect(vm.filteredRoles.length).toBe(1);
            expect(vm.filteredRoles[0]).toEqual(roles[2]);
        });

        it('should clear selected role', function() {
            expect(vm.newRoleAssignment.role).toBe(undefined);
        });
    });

    describe('isFulfillmentType', function() {

        it('should return false if role type is not set to fulfillment', function() {
            vm.newRoleAssignment.type = ROLE_TYPES.SUPERVISION;
            expect(vm.isFulfillmentType()).toBe(false);
        });

        it('should return true if role type is set to fulfillment', function() {
            vm.newRoleAssignment.type = ROLE_TYPES.ORDER_FULFILLMENT;
            expect(vm.isFulfillmentType()).toBe(true);
        });
    });

    describe('isSupervisionType', function() {

        it('should return false if role type is not set to supervision', function() {
            vm.newRoleAssignment.type = ROLE_TYPES.ORDER_FULFILLMENT;
            expect(vm.isSupervisionType()).toBe(false);
        });

        it('should return true if role type is set to supervision', function() {
            vm.newRoleAssignment.type = ROLE_TYPES.SUPERVISION;
            expect(vm.isSupervisionType()).toBe(true);
        });
    });

    describe('addRole', function() {

        it('should push supervision role', function() {
            var newRole;

            vm.newRoleAssignment.type = ROLE_TYPES.SUPERVISION;
            vm.loadRoles();
            vm.newRoleAssignment.role = roles[1];
            vm.newRoleAssignment.supervisoryNode = supervisoryNodes[0].code;
            modalDeferred.promise.then(function(roleAssignment) {
                newRole = roleAssignment;
            });
            vm.addRole();
            $rootScope.$apply();

            expect(newRole).toEqual({
                roleId: roles[1].id,
                supervisoryNodeCode: supervisoryNodes[0].code,
                programCode: undefined
            });
        });

        it('should push fulfillment role', function() {
            var newRole;

            vm.newRoleAssignment.type = ROLE_TYPES.ORDER_FULFILLMENT;
            vm.loadRoles();
            vm.newRoleAssignment.role = roles[3];
            vm.newRoleAssignment.warehouse = warehouses[1].code;
            modalDeferred.promise.then(function(roleAssignment) {
                newRole = roleAssignment;
            });
            vm.addRole();
            $rootScope.$apply();

            expect(newRole).toEqual({
                roleId: roles[3].id,
                warehouseCode: warehouses[1].code
            });
        });
    });

    describe('clearSupervisionFields', function() {

        it('should clear fields', function() {
            vm.newRoleAssignment.supervisoryNode = 'SN';
            vm.newRoleAssignment.program = 'PR';

            vm.clearSupervisionFields();

            expect(vm.newRoleAssignment.supervisoryNode).toBe(undefined);
            expect(vm.newRoleAssignment.program).toBe(undefined);
        });
    });
});
