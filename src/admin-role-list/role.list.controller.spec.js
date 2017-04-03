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

describe('RoleListController', function () {

    var vm, $controller, rolesList;

    beforeEach(function() {
        module('admin-role-list');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            rolesList = [
                {
                    id: 1,
                    name: 'Storeroom Manager',
                    description: 'Manages storeroom'
                },
                {
                    id: 2,
                    name: 'Admin',
                    description: 'System administrator'
                }
            ];

            vm = $controller('RoleListController', {
                roles: rolesList
            });
        });
    });

    describe('init', function() {
        it('should expose roles property', function() {
            expect(vm.roles).toBe(rolesList);
        });

        it('should set roles page as undefined', function() {
           expect(vm.rolesPage).toBe(undefined);
        });

    });
});
