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

describe('UserProfileRolesTabController', function() {

    var vm, roleAssignments, $controller, UserDataBuilder, RoleDataBuilder, $rootScope, roleRightsMap;

    beforeEach(function() {
        module('openlmis-user');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            UserDataBuilder = $injector.get('UserDataBuilder');
            RoleDataBuilder = $injector.get('RoleDataBuilder');
            $rootScope = $injector.get('$rootScope');
        });

        var roles = [
            new RoleDataBuilder().withSupervisionType()
                .build()
        ];

        roleRightsMap = {};
        roleRightsMap[roles[0].id] = roles[0].rights;

        roleAssignments = new UserDataBuilder()
            .withGeneralAdminRoleAssignment(roles[0].id)
            .build().roleAssignments;

        vm = $controller('UserProfileRolesTabController', {
            roleAssignments: roleAssignments,
            roleRightsMap: roleRightsMap
        });
    });

    describe('onInit', function() {

        beforeEach(function() {
            vm.$onInit();
        });

        it('should expose role assignments', function() {
            expect(vm.roleAssignments).toEqual(roleAssignments);
        });

        it('should set showErrorColumn to false if role assignments does not have errors', function() {
            expect(vm.showErrorColumn).toEqual(false);
        });

        it('should set showErrorColumn to true if role assignments have errors', function() {
            vm.roleAssignments[0].errors = ['error'];

            vm.$onInit();
            $rootScope.$apply();

            expect(vm.showErrorColumn).toEqual(true);
        });

        it('should expose roleRightsMap', function() {
            vm.$onInit();
            $rootScope.$apply();

            expect(vm.roleRightsMap).toEqual(roleRightsMap);
        });
    });

});
