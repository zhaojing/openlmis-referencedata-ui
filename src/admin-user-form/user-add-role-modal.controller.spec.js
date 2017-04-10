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
        vm, user, roles, supervisoryNodes, programs, warehouses;

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
                ]
            },
            {
                id: 'role-id-2',
                name: 'role-2',
                rights: [
                    {
                        type: ROLE_TYPES.SUPERVISION
                    }
                ]
            },
            {
                id: 'role-id-3',
                name: 'role-3',
                rights: [
                    {
                        type: ROLE_TYPES.GENERAL_ADMIN
                    }
                ]
            },
            {
                id: 'role-id-4',
                name: 'role-4',
                rights: [
                    {
                        type: ROLE_TYPES.ORDER_FULFILLMENT
                    }
                ]
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

        vm = $controller('UserAddRoleModalController', {
            user: user,
            roles: roles,
            supervisoryNodes: supervisoryNodes,
            programs: programs,
            warehouses: warehouses,
            modalDeferred: $q.when(true)
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

        it('should expose isNewRoleInvalid method', function() {
            expect(angular.isFunction(vm.isNewRoleInvalid)).toBe(true);
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

        it('should set default type', function() {
            expect(vm.type).toEqual(ROLE_TYPES.SUPERVISION);
        });

        it('should filter roles', function() {
            expect(vm.filteredRoles.length).toBe(2);
            expect(vm.filteredRoles[0].name).toEqual(roles[0].name);
            expect(vm.filteredRoles[1].name).toEqual(roles[1].name);
        });
    });

    describe('loadRoles', function() {

        beforeEach(function() {
            vm.role = roles[1];
            vm.type = ROLE_TYPES.GENERAL_ADMIN;
            vm.loadRoles();
        });

        it('should load new roles', function() {
            expect(vm.filteredRoles.length).toBe(1);
            expect(vm.filteredRoles[0]).toEqual(roles[2]);
        });

        it('should clear selected role', function() {
            expect(vm.role).toBe(undefined);
        });
    });
});
