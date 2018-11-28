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

describe('openlmis.profile', function() {

    beforeEach(function() {
        module('openlmis-user');

        var RoleDataBuilder, ProgramDataBuilder, SupervisoryNodeDataBuilder, MinimalFacilityDataBuilder,
            UserDataBuilder, PageDataBuilder, ObjectMapper;
        inject(function($injector) {
            RoleDataBuilder = $injector.get('RoleDataBuilder');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            MinimalFacilityDataBuilder = $injector.get('MinimalFacilityDataBuilder');
            UserDataBuilder = $injector.get('UserDataBuilder');
            PageDataBuilder = $injector.get('PageDataBuilder');

            this.$q = $injector.get('$q');
            this.$location = $injector.get('$location');
            this.$rootScope = $injector.get('$rootScope');
            this.referencedataRoleFactory = $injector.get('referencedataRoleFactory');
            this.AdminUserRolesSupervisoryNodeResource = $injector.get('AdminUserRolesSupervisoryNodeResource');
            this.programService = $injector.get('programService');
            this.facilityService = $injector.get('facilityService');
            this.currentUserService = $injector.get('currentUserService');
            this.$state = $injector.get('$state');
            this.userRoleAssignmentFactory = $injector.get('userRoleAssignmentFactory');
            this.$templateCache = $injector.get('$templateCache');
            this.ROLE_TYPES = $injector.get('ROLE_TYPES');
            this.authUserService = $injector.get('authUserService');
            ObjectMapper = $injector.get('ObjectMapper');
        });

        this.roles = [
            new RoleDataBuilder().build(),
            new RoleDataBuilder().build(),
            new RoleDataBuilder().build(),
            new RoleDataBuilder().build(),
            new RoleDataBuilder().build(),
            new RoleDataBuilder().build()
        ];

        this.programs = [
            new ProgramDataBuilder().build(),
            new ProgramDataBuilder().build()
        ];

        this.supervisoryNodes = [
            new SupervisoryNodeDataBuilder().build(),
            new SupervisoryNodeDataBuilder().build()
        ];

        this.warehouses = [
            new MinimalFacilityDataBuilder().build(),
            new MinimalFacilityDataBuilder().build()
        ];

        this.homeFacility = new MinimalFacilityDataBuilder().build();

        this.user = new UserDataBuilder()
            .withHomeFacilityId(this.homeFacility.id)
            .withSupervisionRoleAssignment(this.roles[0].id, this.supervisoryNodes[0].id, this.programs[0].id)
            .withSupervisionRoleAssignment(this.roles[1].id, this.supervisoryNodes[1].id, this.programs[1].id)
            .withOrderFulfillmentRoleAssignment(this.roles[2].id, this.warehouses[0].id)
            .withOrderFulfillmentRoleAssignment(this.roles[3].id, this.warehouses[1].id)
            .withGeneralAdminRoleAssignment(this.roles[4].id)
            .withGeneralAdminRoleAssignment(this.roles[5].id)
            .build();

        this.pendingVerificationEmail = {
            email: 'example@test.org'
        };

        this.objectMapper = new ObjectMapper();

        spyOn(this.AdminUserRolesSupervisoryNodeResource.prototype, 'query')
            .andReturn(this.$q.resolve(new PageDataBuilder()
                .withContent(this.supervisoryNodes)
                .build()));
        spyOn(this.referencedataRoleFactory, 'getAllWithType').andReturn(this.$q.resolve(this.roles));
        spyOn(this.facilityService, 'getAllMinimal').andReturn(this.$q.resolve(this.warehouses));
        spyOn(this.facilityService, 'getMinimal').andReturn(this.$q.resolve(this.homeFacility));
        spyOn(this.currentUserService, 'getUserInfo').andReturn(this.$q.resolve(this.user));
        spyOn(this.programService, 'getAll').andReturn(this.$q.resolve(this.programs));
        spyOn(this.userRoleAssignmentFactory, 'getUser').andReturn(this.$q.resolve(this.user));
        spyOn(this.$templateCache, 'get').andCallThrough();
        spyOn(this.authUserService, 'getVerificationEmail').andReturn(this.$q.resolve(this.pendingVerificationEmail));

        this.goToUrl = goToUrl;
        this.getResolvedValue = getResolvedValue;
    });

    describe('state', function() {

        it('should be available under "/profile" URI', function() {
            expect(this.$state.current.name).not.toEqual('openlmis.profile');

            this.goToUrl('/profile');

            expect(this.$state.current.name).toEqual('openlmis.profile');
        });

        it('should use template', function() {
            this.goToUrl('/profile');

            expect(this.$templateCache.get).toHaveBeenCalledWith('openlmis-user/user-profile.html');
        });

        it('should resolve roles', function() {
            this.goToUrl('/profile');

            expect(this.getResolvedValue('roles')).toEqual(this.roles);
            expect(this.referencedataRoleFactory.getAllWithType).toHaveBeenCalled();
        });

        it('should resolve programs', function() {
            this.goToUrl('/profile');

            expect(this.getResolvedValue('programs')).toEqual(this.programs);
            expect(this.programService.getAll).toHaveBeenCalled();
        });

        it('should resolve facilitiesMap', function() {
            var facilitiesMap; this.objectMapper.map(this.warehouses);

            this.goToUrl('/profile');

            expect(this.getResolvedValue('facilitiesMap')).toEqual(facilitiesMap);
            expect(this.facilityService.getAllMinimal).toHaveBeenCalled();
        });

        it('should resolve supervisoryNodes', function() {
            this.goToUrl('/profile');

            expect(this.getResolvedValue('supervisoryNodes')).toEqual(this.supervisoryNodes);
            expect(this.AdminUserRolesSupervisoryNodeResource.prototype.query).toHaveBeenCalled();
        });

        it('should resolve warehouses', function() {
            this.goToUrl('/profile');

            expect(this.getResolvedValue('warehouses')).toEqual(this.warehouses);
            expect(this.facilityService.getAllMinimal).toHaveBeenCalled();
        });

        it('should resolve user', function() {
            this.goToUrl('/profile');

            expect(this.getResolvedValue('user')).toEqual(this.user);
            expect(this.userRoleAssignmentFactory.getUser).toHaveBeenCalledWith(
                this.user.id,
                this.roles,
                this.programs,
                this.supervisoryNodes,
                this.warehouses
            );
        });

        it('should resolve userId', function() {
            this.goToUrl('/profile');

            expect(this.getResolvedValue('userId')).toEqual(this.user.id);
            expect(this.currentUserService.getUserInfo).toHaveBeenCalled();
        });

        it('should resolve home facility', function() {
            this.goToUrl('/profile');

            expect(this.getResolvedValue('homeFacility')).toEqual(this.homeFacility);
            expect(this.facilityService.getMinimal).toHaveBeenCalledWith(this.user.homeFacilityId);
        });

        it('should resolve home facility to undefined if user has no home facility', function() {
            this.user.homeFacilityId = undefined;

            this.goToUrl('/profile');

            expect(this.getResolvedValue('homeFacility')).toBeUndefined();
        });

        it('should resolve home roleRightsMap', function() {
            this.goToUrl('/profile');

            var roleRightsMap = this.getResolvedValue('roleRightsMap');

            expect(roleRightsMap[this.roles[0].id]).toEqual(this.roles[0].rights);
            expect(roleRightsMap[this.roles[1].id]).toEqual(this.roles[1].rights);
            expect(roleRightsMap[this.roles[2].id]).toEqual(this.roles[2].rights);
            expect(roleRightsMap[this.roles[3].id]).toEqual(this.roles[3].rights);
            expect(roleRightsMap[this.roles[4].id]).toEqual(this.roles[4].rights);
            expect(roleRightsMap[this.roles[5].id]).toEqual(this.roles[5].rights);
        });

        it('should resolve pending verification email', function() {
            this.goToUrl('/profile');

            expect(this.getResolvedValue('pendingVerificationEmail')).toEqual(this.pendingVerificationEmail);
        });

    });

    describe('.supervision state', function() {

        it('should be available under "/profile/supervision" URI', function() {
            expect(this.$state.current.name).not.toEqual('openlmis.profile.SUPERVISION');

            this.goToUrl('/profile/supervision');

            expect(this.$state.current.name).toEqual('openlmis.profile.SUPERVISION');
        });

        it('should use template', function() {
            this.goToUrl('/profile/supervision');

            expect(this.$templateCache.get).toHaveBeenCalledWith('admin-user-roles/user-roles-supervision.html');
        });

        it('should resolve tab', function() {
            this.goToUrl('/profile/supervision');

            expect(this.getResolvedValue('tab')).toEqual(this.ROLE_TYPES.SUPERVISION);
        });

        it('should resolve programs', function() {
            this.goToUrl('/profile/supervision');

            expect(this.getResolvedValue('roleAssignments')).toEqual([
                this.user.roleAssignments[0],
                this.user.roleAssignments[1]
            ]);
        });

    });

    describe('.fulfillment state', function() {

        it('should be available under "/profile/fulfillment" URI', function() {
            expect(this.$state.current.name).not.toEqual('openlmis.profile.ORDER_FULFILLMENT');

            this.goToUrl('/profile/fulfillment');

            expect(this.$state.current.name).toEqual('openlmis.profile.ORDER_FULFILLMENT');
        });

        it('should use template', function() {
            this.goToUrl('/profile/fulfillment');

            expect(this.$templateCache.get).toHaveBeenCalledWith('admin-user-roles/user-roles-fulfillment.html');
        });

        it('should resolve tab', function() {
            this.goToUrl('/profile/fulfillment');

            expect(this.getResolvedValue('tab')).toEqual(this.ROLE_TYPES.ORDER_FULFILLMENT);
        });

        it('should resolve programs', function() {
            this.goToUrl('/profile/fulfillment');

            expect(this.getResolvedValue('roleAssignments')).toEqual([
                this.user.roleAssignments[2],
                this.user.roleAssignments[3]
            ]);
        });

    });

    describe('.report state', function() {

        it('should be available under "/profile/reports" URI', function() {
            expect(this.$state.current.name).not.toEqual('openlmis.profile.REPORTS');

            this.goToUrl('/profile/reports');

            expect(this.$state.current.name).toEqual('openlmis.profile.REPORTS');
        });

        it('should use template', function() {
            this.goToUrl('/profile/reports');

            expect(this.$templateCache.get).toHaveBeenCalledWith('admin-user-roles/user-roles-tab.html');
        });

        it('should resolve tab', function() {
            this.goToUrl('/profile/reports');

            expect(this.getResolvedValue('tab')).toEqual(this.ROLE_TYPES.REPORTS);
        });

        it('should resolve programs', function() {
            this.goToUrl('/profile/reports');

            expect(this.getResolvedValue('roleAssignments')).toEqual([]);
        });

    });

    describe('.admin state', function() {

        it('should be available under "/profile/admin" URI', function() {
            expect(this.$state.current.name).not.toEqual('openlmis.profile.GENERAL_ADMIN');

            this.goToUrl('/profile/admin');

            expect(this.$state.current.name).toEqual('openlmis.profile.GENERAL_ADMIN');
        });

        it('should use template', function() {
            this.goToUrl('/profile/admin');

            expect(this.$templateCache.get).toHaveBeenCalledWith('admin-user-roles/user-roles-tab.html');
        });

        it('should resolve tab', function() {
            this.goToUrl('/profile/admin');

            expect(this.getResolvedValue('tab')).toEqual(this.ROLE_TYPES.GENERAL_ADMIN);
        });

        it('should resolve programs', function() {
            this.goToUrl('/profile/admin');

            expect(this.getResolvedValue('roleAssignments')).toEqual([
                this.user.roleAssignments[4],
                this.user.roleAssignments[5]
            ]);
        });

    });

    function goToUrl(url) {
        this.$location.url(url);
        this.$rootScope.$apply();
    }

    function getResolvedValue(name) {
        return this.$state.$current.locals.globals[name];
    }

});
