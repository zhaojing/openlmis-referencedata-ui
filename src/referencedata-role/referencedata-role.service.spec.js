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

describe('referencedataRoleService', function() {

    var $rootScope, $httpBackend, openlmisUrlFactory, roles, referencedataRoleService;

    beforeEach(function() {
        module('referencedata-role');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            referencedataRoleService = $injector.get('referencedataRoleService');
        });

        roles = [
            {
                id: '1',
                name: 'Warehouse Clerk'
            },
            {
                id: '2',
                name: 'Storeroom Manager'
            }
        ];
    });

    describe('get all', function() {

        var data;

        beforeEach(function() {
            $httpBackend.when('GET', openlmisUrlFactory('/api/roles'))
                .respond(200, roles);
        });

        it('should get all roles', function() {
            referencedataRoleService.getAll().then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(data)).toEqual(angular.toJson(roles));
        });
    });

    describe('get', function() {

        var roleId, role;

        beforeEach(function() {
            roleId = 'some-role-id';

            role = {
                id: roleId,
                name: 'Some role'
            };

            $httpBackend.when('GET', openlmisUrlFactory('/api/roles/' + roleId)).respond(200, role);
        });

        it('should return promise', function() {
            var result = referencedataRoleService.get(roleId);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to role', function() {
            var result;

            referencedataRoleService.get(roleId).then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result).not.toBeUndefined();
            expect(result.id).toBe(roleId);
        });

        it('should make a proper request', function() {
            $httpBackend.expectGET(openlmisUrlFactory('/api/roles/' + roleId));

            referencedataRoleService.get(roleId);
            $httpBackend.flush();
        });

    });

    describe('create', function() {

        var role;

        beforeEach(function() {

            role = {
                name: 'Some role'
            };

            $httpBackend.whenPOST(openlmisUrlFactory('/api/roles')).respond(200, role);
        });

        it('should return promise', function() {
            var result = referencedataRoleService.create(role);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to role', function() {
            var result;

            referencedataRoleService.create(role).then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(role));
        });

        it('should make a proper request', function() {
            $httpBackend.expectPOST(openlmisUrlFactory('/api/roles'), role);

            referencedataRoleService.create(role);
            $httpBackend.flush();
        });

    });

    describe('update', function() {

        var roleId, role;

        beforeEach(function() {
            roleId = 'some-role-id';

            role = {
                id: roleId,
                name: 'Some role'
            };

            $httpBackend.whenPUT(openlmisUrlFactory('/api/roles/' + roleId)).respond(200, role);
        });

        it('should return promise', function() {
            var result = referencedataRoleService.update(role);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to role', function() {
            var result;

            referencedataRoleService.update(role).then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(role));
        });

        it('should make a proper request', function() {
            $httpBackend.expectPUT(openlmisUrlFactory('/api/roles/' + roleId), role);

            referencedataRoleService.update(role);
            $httpBackend.flush();
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });
});
