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
describe('referencedataRightService', function() {

    beforeEach(function() {
        module('referencedata-right');

        inject(function($injector) {
            this.referencedataRightService = $injector.get('referencedataRightService');
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            this.ReferenceDataRightDataBuilder = $injector.get('ReferenceDataRightDataBuilder');
        });

        this.right = new this.ReferenceDataRightDataBuilder().build();

        this.rights = [
            this.right,
            new this.ReferenceDataRightDataBuilder().build(),
            new this.ReferenceDataRightDataBuilder().build()
        ];
    });

    describe('search', function() {

        it('should resolve to a list of rights', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(
                    '/api/rights/search' +
                    '?name=' + this.right.name +
                    '&type=' + this.right.type
                ))
                .respond(200, [this.right]);

            var result;
            this.referencedataRightService
                .search(this.right.name, this.right.type)
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson([this.right]));
        });

    });

    describe('getAll', function() {

        it('should resolve to a list of rights', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory('/api/rights'))
                .respond(200, this.rights);

            var result;
            this.referencedataRightService
                .getAll()
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.rights));
        });

    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingRequest();
        this.$httpBackend.verifyNoOutstandingExpectation();
    });

});
