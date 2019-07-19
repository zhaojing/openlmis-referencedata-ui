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

    beforeEach(function() {
        module('openlmis-user');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.RoleDataBuilder = $injector.get('RoleDataBuilder');
            this.$rootScope = $injector.get('$rootScope');
        });

        var roles = [
            new this.RoleDataBuilder()
                .withSupervisionType()
                .build()
        ];

        this.roleRightsMap = {};
        this.roleRightsMap[roles[0].id] = roles[0].rights;

        this.roleAssignments = new this.UserDataBuilder()
            .withGeneralAdminRoleAssignment(roles[0].id)
            .build().roleAssignments;

        this.vm = this.$controller('UserProfileRolesTabController', {
            roleAssignments: this.roleAssignments,
            roleRightsMap: this.roleRightsMap
        });
    });

    describe('onInit', function() {

        beforeEach(function() {
            this.vm.$onInit();
        });

        it('should expose role assignments', function() {
            expect(this.vm.roleAssignments).toEqual(this.roleAssignments);
        });

        it('should set showErrorColumn to false if role assignments does not have errors', function() {
            expect(this.vm.showErrorColumn).toEqual(false);
        });

        it('should set showErrorColumn to true if role assignments have errors', function() {
            this.vm.roleAssignments[0].errors = ['error'];

            this.vm.$onInit();
            this.$rootScope.$apply();

            expect(this.vm.showErrorColumn).toEqual(true);
        });

        it('should expose roleRightsMap', function() {
            this.vm.$onInit();
            this.$rootScope.$apply();

            expect(this.vm.roleRightsMap).toEqual(this.roleRightsMap);
        });
    });

});
