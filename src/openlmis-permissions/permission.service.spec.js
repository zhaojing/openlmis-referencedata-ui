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

describe('openlmis-permissions.this.permissionService', function() {

    beforeEach(function() {
        module('openlmis-permissions');

        var UserDataBuilder, RoleDataBuilder;
        inject(function($injector) {
            UserDataBuilder = $injector.get('UserDataBuilder');
            RoleDataBuilder = $injector.get('RoleDataBuilder');

            this.$rootScope = $injector.get('$rootScope');
            this.permissionService = $injector.get('permissionService');
            this.localStorageService = $injector.get('localStorageService');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            this.$httpBackend = $injector.get('$httpBackend');
            this.currentUserService = $injector.get('currentUserService');
            this.RoleResource = $injector.get('RoleResource');
            this.$q = $injector.get('$q');
        });

        this.possessedRightName = 'POSSESSED_RIGHT';
        this.nonPossessedRightName = 'NON_POSSESSED_RIGHT';

        this.roles = [
            new RoleDataBuilder()
                .withSupervisionType()
                .withRight(this.possessedRightName)
                .build(),
            new RoleDataBuilder()
                .withSupervisionType()
                .withRight(this.nonPossessedRightName)
                .build()
        ];

        this.user = new UserDataBuilder()
            .withSupervisionRoleAssignment(this.roles[0].id, 'supervisory-node-id', 'program-id')
            .buildReferenceDataUserJson();

        var permissionStrings = [
            'permissionString1|facility-id|program-id',
            'permissionString2|some-facility'
        ];

        this.$httpBackend
            .when('GET', this.openlmisUrlFactory('/api/users/userId/permissionStrings'))
            .respond(permissionStrings);

        spyOn(this.localStorageService, 'get').andReturn(null);
        spyOn(this.localStorageService, 'add').andCallThrough();
        spyOn(this.localStorageService, 'remove');
        spyOn(this.RoleResource.prototype, 'query').andReturn(this.$q.resolve(this.roles));
        spyOn(this.currentUserService, 'getUserInfo').andReturn(this.$q.resolve(this.user));
    });

    it('empty will clear permission strings from browser', function() {
        this.permissionService.empty();

        expect(this.localStorageService.remove).toHaveBeenCalledWith('permissions');
    });

    it('will fail and empty all permissions if userId not entered', function() {
        spyOn(this.permissionService, 'empty').andCallThrough();

        var failed = false;
        this.permissionService.load()
            .catch(function() {
                failed = true;
            });

        this.$rootScope.$apply();

        expect(failed).toBe(true);
        expect(this.permissionService.empty).toHaveBeenCalled();
    });

    it('gets permission strings from the server, and saves them locally', function() {
        var permissions;
        this.permissionService.load('userId')
            .then(function(response) {
                permissions = response;
            });

        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(permissions).toBeTruthy();
        expect(Array.isArray(permissions)).toBeTruthy();

        expect(this.localStorageService.add).toHaveBeenCalledWith('permissions', angular.toJson(permissions));
    });

    it('correctly parses permission strings from the server', function() {
        var permissions;
        this.permissionService.load('userId')
            .then(function(response) {
                permissions = response;
            });

        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(permissions.length).toBe(2);

        expect(permissions[0].right).toBe('permissionString1');
        expect(permissions[0].facilityId).toBe('facility-id');
        expect(permissions[0].programId).toBe('program-id');

        expect(permissions[1].right).toBe('permissionString2');
        expect(permissions[1].facilityId).toBe('some-facility');
        expect(permissions[1].programId).toBeUndefined();
    });

    it('will return cached permissions, if they are available', function() {
        this.localStorageService.get.andReturn([{
            right: 'example'
        }]);

        var permissions;
        this.permissionService.load('userId')
            .then(function(response) {
                permissions = response;
            });

        this.$rootScope.$apply();

        expect(permissions.length).toBe(1);
        expect(permissions[0].right).toBe('example');

        this.$httpBackend.verifyNoOutstandingRequest();
    });

    describe('hasPermission', function() {

        beforeEach(function() {
            this.localStorageService.get.andReturn([{
                right: 'example',
                facilityId: 'facility-id'
            }]);

            this.checkPermission = checkPermission;
        });

        function checkPermission(permissionObj) {
            var success = false;

            this.permissionService.hasPermission('userId', permissionObj)
                .then(function() {
                    success = true;
                });

            this.$rootScope.$apply();
            return success;
        }

        it('will return FALSE if no arguments', function() {
            expect(this.checkPermission({})).toBe(false);
        });

        it('will return FALSE if the right is not set', function() {
            expect(this.checkPermission({
                facilityId: 'facility-id'
            })).toBe(false);

            expect(this.checkPermission({
                right: 'example',
                facilityId: 'facility-id'
            })).toBe(true);
        });

        it('will resolve promise if the argument EXACTLY matches a permission', function() {
            // Too vague
            expect(this.checkPermission({
                right: 'example'
            })).toBe(false);

            // Too strict
            expect(this.checkPermission({
                right: 'example',
                programId: 'program-id',
                facilityId: 'facility-id'
            })).toBe(false);

            // Just right
            expect(this.checkPermission({
                right: 'example',
                facilityId: 'facility-id'
            })).toBe(true);
        });

        it('will reject promise if the argument is missing program', function() {
            this.localStorageService.get.andReturn([{
                right: 'right',
                facilityId: 'facility-id',
                programId: 'program-id'
            }]);

            expect(this.checkPermission({
                right: 'right',
                facilityId: 'facility-id'
            })).toBe(false);
        });

    });

    describe('hasPermissionWithAnyProgram', function() {

        beforeEach(function() {
            this.localStorageService.get.andReturn([{
                right: 'example',
                facilityId: 'facility-id'
            }]);

            this.checkPermission = checkPermission;
        });

        function checkPermission(permissionObj) {
            var success = false;

            this.permissionService.hasPermissionWithAnyProgram('userId', permissionObj)
                .then(function() {
                    success = true;
                });

            this.$rootScope.$apply();
            return success;
        }

        it('will return FALSE if no arguments', function() {
            expect(this.checkPermission({})).toBe(false);
        });

        it('will return FALSE if the right is not set', function() {
            expect(this.checkPermission({
                facilityId: 'facility-id'
            })).toBe(false);

            expect(this.checkPermission({
                right: 'example',
                facilityId: 'facility-id'
            })).toBe(true);
        });

        it('will resolve promise if the argument EXACTLY matches a permission', function() {
            // Too vague
            expect(this.checkPermission({
                right: 'example'
            })).toBe(false);

            // Not too strict, program is ignored
            expect(this.checkPermission({
                right: 'example',
                programId: 'program-id',
                facilityId: 'facility-id'
            })).toBe(true);

            // Just right
            expect(this.checkPermission({
                right: 'example',
                facilityId: 'facility-id'
            })).toBe(true);
        });

        it('will resolve promise if the argument is missing program', function() {
            this.localStorageService.get.andReturn([{
                right: 'right',
                facilityId: 'facility-id',
                programId: 'program-id'
            }]);

            expect(this.checkPermission({
                right: 'right',
                facilityId: 'facility-id'
            })).toBe(true);
        });

    });

    describe('hasPermissionWithAnyProgramAndAnyFacility', function() {

        beforeEach(function() {
            this.localStorageService.get.andReturn([{
                right: 'right',
                facilityId: 'facility-id',
                programId: 'program-id'
            }]);

            this.checkPermission = checkPermission;
        });

        function checkPermission(permissionObj) {
            var success = false;
            this.permissionService.hasPermissionWithAnyProgramAndAnyFacility('userId', permissionObj)
                .then(function() {
                    success = true;
                });
            this.$rootScope.$apply();
            return success;
        }

        it('will return FALSE if no arguments', function() {
            expect(this.checkPermission({})).toBe(false);
        });

        it('will return FALSE if the right is not set', function() {
            expect(this.checkPermission({
                facilityId: 'facility-id',
                programId: 'program-id'
            })).toBe(false);
        });

        it('will resolve promise if the argument matches a permission ignoring facility and program', function() {
            expect(this.checkPermission({
                right: 'right',
                programId: 'program-id',
                facilityId: 'facility-id'
            })).toBe(true);
        });

        it('will resolve promise if the argument matches a permission right', function() {
            expect(this.checkPermission({
                right: 'right'
            })).toBe(true);
        });
    });

    describe('hasRoleWithRight', function() {

        it('should return true if user has a role with the given right', function() {
            var result;
            this.permissionService
                .hasRoleWithRight(this.possessedRightName)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(true);
        });

        it('should return false if user has no role with the given right', function() {
            var result;
            this.permissionService
                .hasRoleWithRight(this.nonPossessedRightName)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(false);
        });

    });

});
