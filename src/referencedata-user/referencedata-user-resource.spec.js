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

describe('ReferenceDataUserResource', function() {

    beforeEach(function() {
        module('referencedata-user');

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.ReferenceDataUserResource = $injector.get('ReferenceDataUserResource');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            this.ParameterSplitter = $injector.get('ParameterSplitter');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
        });

        spyOn(this.ParameterSplitter.prototype, 'split');

        var userDataBuilder = new this.UserDataBuilder();

        this.user = userDataBuilder.buildReferenceDataUserJson();
        this.updatedUser = userDataBuilder
            .withFirstName('Update name')
            .buildReferenceDataUserJson();

        this.referenceDataUserResource = new this.ReferenceDataUserResource();
    });

    describe('update', function() {

        it('should resolve to server response on successful request', function() {
            this.$httpBackend
                .expectPUT(this.openlmisUrlFactory('/api/users'), this.user)
                .respond(200, this.updatedUser);

            var result;
            this.referenceDataUserResource.update(this.user)
                .then(function(user) {
                    result = user;
                });
            this.$httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.updatedUser));
        });

        it('should reject on failed request', function() {
            this.$httpBackend
                .expectPUT(this.openlmisUrlFactory('/api/users'), this.user)
                .respond(400);

            var rejected;
            this.referenceDataUserResource.update(this.user)
                .catch(function() {
                    rejected = true;
                });
            this.$httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            this.referenceDataUserResource.update()
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingRequest();
        this.$httpBackend.verifyNoOutstandingExpectation();
    });

});
