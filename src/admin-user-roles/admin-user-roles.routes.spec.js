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

describe('openlmis.administration.users.roles', function() {

    var $location, $rootScope, RoleDataBuilder, roles, referencedataRoleFactory, ProgramDataBuilder, programs, $state,
        SupervisoryNodeDataBuilder, supervisoryNodes, programService, supervisoryNodeFactory, $q, warehouses,
        MinimalFacilityDataBuilder, facilityService, homeFacility, user, UserDataBuilder, currentUserService,
        userRoleAssignmentFactory, $templateCache, ROLE_TYPES, paginationService;

    beforeEach(function() {
        module('openlmis-main-state');
        module('openlmis-admin');
        module('admin-user-roles');

        inject(function($injector) {
            $q = $injector.get('$q');
            $location = $injector.get('$location');
            $rootScope = $injector.get('$rootScope');
            RoleDataBuilder = $injector.get('RoleDataBuilder');
            referencedataRoleFactory = $injector.get('referencedataRoleFactory');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            supervisoryNodeFactory = $injector.get('supervisoryNodeFactory');
            programService = $injector.get('programService');
            MinimalFacilityDataBuilder = $injector.get('MinimalFacilityDataBuilder');
            facilityService = $injector.get('facilityService');
            UserDataBuilder = $injector.get('UserDataBuilder');
            currentUserService = $injector.get('currentUserService');
            $state = $injector.get('$state');
            userRoleAssignmentFactory = $injector.get('userRoleAssignmentFactory');
            $templateCache = $injector.get('$templateCache');
            ROLE_TYPES = $injector.get('ROLE_TYPES');
            paginationService = $injector.get('paginationService');
        });

        roles = [
            new RoleDataBuilder().build(),
            new RoleDataBuilder().build(),
            new RoleDataBuilder().build(),
            new RoleDataBuilder().build(),
            new RoleDataBuilder().build(),
            new RoleDataBuilder().build()
        ];

        programs = [
            new ProgramDataBuilder().build(),
            new ProgramDataBuilder().build()
        ];

        supervisoryNodes = [
            new SupervisoryNodeDataBuilder().build(),
            new SupervisoryNodeDataBuilder().build()
        ];

        warehouses = [
            new MinimalFacilityDataBuilder().build(),
            new MinimalFacilityDataBuilder().build()
        ];

        homeFacility = new MinimalFacilityDataBuilder().build();

        user = new UserDataBuilder()
            .withHomeFacilityId(homeFacility.id)
            .withSupervisionRoleAssignment(roles[0].id, supervisoryNodes[0].id, programs[0].id)
            .withSupervisionRoleAssignment(roles[1].id, supervisoryNodes[1].id, programs[1].id)
            .withOrderFulfillmentRoleAssignment(roles[2].id, warehouses[0].id)
            .withOrderFulfillmentRoleAssignment(roles[3].id, warehouses[1].id)
            .withGeneralAdminRoleAssignment(roles[4].id)
            .withGeneralAdminRoleAssignment(roles[5].id)
            .build();

        spyOn(supervisoryNodeFactory, 'getAllSupervisoryNodesWithDisplay').andReturn($q.resolve(supervisoryNodes));
        spyOn(referencedataRoleFactory, 'getAllWithType').andReturn($q.resolve(roles));
        spyOn(facilityService, 'getAllMinimal').andReturn($q.resolve(warehouses));
        spyOn(currentUserService, 'getUserInfo').andReturn($q.resolve(user));
        spyOn(programService, 'getAll').andReturn($q.resolve(programs));
        spyOn(userRoleAssignmentFactory, 'getUser').andReturn($q.resolve(user));
        spyOn($templateCache, 'get').andCallThrough();
        spyOn(paginationService, 'registerUrl').andReturn($q.resolve([user]));
    });

    describe('.supervision state', function() {

        it('should resolve roles', function() {
            goToUrl('/administration/users/' + user.id + '/roles/supervision');

            expect(getResolvedValue('roles')).toEqual(roles);
            expect(referencedataRoleFactory.getAllWithType).toHaveBeenCalled();
        });

        it('should resolve programs', function() {
            goToUrl('/administration/users/' + user.id + '/roles/supervision');

            expect(getResolvedValue('programs')).toEqual(programs);
            expect(programService.getAll).toHaveBeenCalled();
        });

        it('should resolve supervisoryNodes', function() {
            goToUrl('/administration/users/' + user.id + '/roles/supervision');

            expect(getResolvedValue('supervisoryNodes')).toEqual(supervisoryNodes);
            expect(supervisoryNodeFactory.getAllSupervisoryNodesWithDisplay).toHaveBeenCalled();
        });

        it('should resolve warehouses', function() {
            goToUrl('/administration/users/' + user.id + '/roles/supervision');

            expect(getResolvedValue('warehouses')).toEqual(warehouses);
            expect(facilityService.getAllMinimal).toHaveBeenCalled();
        });

        it('should resolve user', function() {
            goToUrl('/administration/users/' + user.id + '/roles/supervision');

            expect(getResolvedValue('user')).toEqual(user);
            expect(userRoleAssignmentFactory.getUser).toHaveBeenCalledWith(
                user.id,
                roles,
                programs,
                supervisoryNodes,
                warehouses
            );
        });

        it('should be available under "/:id/roles/supervision" URI', function() {
            expect($state.current.name).not.toEqual('openlmis.administration.users.roles.SUPERVISION');

            goToUrl('/administration/users/' + user.id + '/roles/supervision');

            expect($state.current.name).toEqual('openlmis.administration.users.roles.SUPERVISION');
        });

        it('should use template', function() {
            goToUrl('/administration/users/' + user.id + '/roles/supervision');

            expect($templateCache.get).toHaveBeenCalledWith('admin-user-roles/user-roles-supervision.html');
        });

        it('should resolve tab', function() {
            goToUrl('/administration/users/' + user.id + '/roles/supervision');

            expect(getResolvedValue('tab')).toEqual(ROLE_TYPES.SUPERVISION);
        });

        it('should resolve roleAssignments', function() {
            goToUrl('/administration/users/' + user.id + '/roles/supervision');

            expect(getResolvedValue('roleAssignments')).toEqual([
                user.roleAssignments[0],
                user.roleAssignments[1]
            ]);
        });

        it('should resolve home roleRightsMap', function() {
            goToUrl('/administration/users/' + user.id + '/roles/supervision');

            var roleRightsMap = getResolvedValue('roleRightsMap');

            expect(roleRightsMap[roles[0].id]).toEqual(roles[0].rights);
            expect(roleRightsMap[roles[1].id]).toEqual(roles[1].rights);
            expect(roleRightsMap[roles[2].id]).toEqual(roles[2].rights);
            expect(roleRightsMap[roles[3].id]).toEqual(roles[3].rights);
            expect(roleRightsMap[roles[4].id]).toEqual(roles[4].rights);
            expect(roleRightsMap[roles[5].id]).toEqual(roles[5].rights);
        });

    });

    describe('.fulfillment state', function() {

        it('should be available under "/:id/roles/fulfillment" URI', function() {
            expect($state.current.name).not.toEqual('openlmis.administration.users.roles.ORDER_FULFILLMENT');

            goToUrl('/administration/users/' + user.id + '/roles/fulfillment');

            expect($state.current.name).toEqual('openlmis.administration.users.roles.ORDER_FULFILLMENT');
        });

        it('should use template', function() {
            goToUrl('/administration/users/' + user.id + '/roles/fulfillment');

            expect($templateCache.get).toHaveBeenCalledWith('admin-user-roles/user-roles-fulfillment.html');
        });

        it('should resolve tab', function() {
            goToUrl('/administration/users/' + user.id + '/roles/fulfillment');

            expect(getResolvedValue('tab')).toEqual(ROLE_TYPES.ORDER_FULFILLMENT);
        });

        it('should resolve programs', function() {
            goToUrl('/administration/users/' + user.id + '/roles/fulfillment');

            expect(getResolvedValue('roleAssignments')).toEqual([
                user.roleAssignments[2],
                user.roleAssignments[3]
            ]);
        });

    });

    describe('.report state', function() {

        it('should be available under "/:id/roles/reports" URI', function() {
            expect($state.current.name).not.toEqual('openlmis.administration.users.roles.REPORTS');

            goToUrl('/administration/users/' + user.id + '/roles/reports');

            expect($state.current.name).toEqual('openlmis.administration.users.roles.REPORTS');
        });

        it('should use template', function() {
            goToUrl('/administration/users/' + user.id + '/roles/reports');

            expect($templateCache.get).toHaveBeenCalledWith('admin-user-roles/user-roles-tab.html');
        });

        it('should resolve tab', function() {
            goToUrl('/administration/users/' + user.id + '/roles/reports');

            expect(getResolvedValue('tab')).toEqual(ROLE_TYPES.REPORTS);
        });

        it('should resolve programs', function() {
            goToUrl('/administration/users/' + user.id + '/roles/reports');

            expect(getResolvedValue('roleAssignments')).toEqual([]);
        });

    });

    describe('.admin state', function() {

        it('should be available under "/:id/roles/admin" URI', function() {
            expect($state.current.name).not.toEqual('openlmis.administration.users.roles.GENERAL_ADMIN');

            goToUrl('/administration/users/' + user.id + '/roles/admin');

            expect($state.current.name).toEqual('openlmis.administration.users.roles.GENERAL_ADMIN');
        });

        it('should use template', function() {
            goToUrl('/administration/users/' + user.id + '/roles/admin');

            expect($templateCache.get).toHaveBeenCalledWith('admin-user-roles/user-roles-tab.html');
        });

        it('should resolve tab', function() {
            goToUrl('/administration/users/' + user.id + '/roles/admin');

            expect(getResolvedValue('tab')).toEqual(ROLE_TYPES.GENERAL_ADMIN);
        });

        it('should resolve programs', function() {
            goToUrl('/administration/users/' + user.id + '/roles/admin');

            expect(getResolvedValue('roleAssignments')).toEqual([
                user.roleAssignments[4],
                user.roleAssignments[5]
            ]);
        });

    });

    function goToUrl(url) {
        $location.url(url);
        $rootScope.$apply();
    }

    function getResolvedValue(name) {
        return $state.$current.locals.globals[name];
    }

});
