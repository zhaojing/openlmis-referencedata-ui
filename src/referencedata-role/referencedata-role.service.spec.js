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

    beforeEach(function() {
        module('referencedata-role');

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            this.referencedataRoleService = $injector.get('referencedataRoleService');
            this.RoleDataBuilder = $injector.get('RoleDataBuilder');
        });

        this.role = new this.RoleDataBuilder().build();

        this.roles = [
            this.role,
            new this.RoleDataBuilder().build()
        ];
    });

    describe('getAll', function() {

        it('should get all roles', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory('/api/roles'))
                .respond(200, this.roles);

            var result;
            this.referencedataRoleService.getAll().then(function(response) {
                result = response;
            });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.roles));
        });
    });

    describe('get', function() {

        it('should resolve to role', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory('/api/roles/' + this.role.id))
                .respond(200, this.role);

            var result;
            this.referencedataRoleService
                .get(this.role.id)
                .then(function(role) {
                    result = role;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.role));
        });

    });

    describe('create', function() {

        it('should resolve to role', function() {
            this.$httpBackend
                .expectPOST(this.openlmisUrlFactory('/api/roles'), this.role)
                .respond(200, this.role);

            var result;
            this.referencedataRoleService
                .create(this.role)
                .then(function(data) {
                    result = data;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.role));
        });

    });

    describe('update', function() {

        it('should resolve to role', function() {
            this.$httpBackend
                .expectPUT(this.openlmisUrlFactory('/api/roles/' + this.role.id), this.role)
                .respond(200, this.role);

            var result;
            this.referencedataRoleService
                .update(this.role)
                .then(function(data) {
                    result = data;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.role));
        });

    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingRequest();
        this.$httpBackend.verifyNoOutstandingExpectation();
    });
});
