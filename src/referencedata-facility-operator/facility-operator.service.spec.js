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

describe('facilityOperatorService', function() {

    beforeEach(function() {
        module('referencedata-facility-operator');

        inject(function($injector) {
            this.facilityOperatorService = $injector.get('facilityOperatorService');
            this.$httpBackend = $injector.get('$httpBackend');
            this.referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            this.$rootScope = $injector.get('$rootScope');
            this.FacilityOperatorDataBuilder = $injector.get('FacilityOperatorDataBuilder');
        });

        this.facilityOperators = [
            new this.FacilityOperatorDataBuilder().build(),
            new this.FacilityOperatorDataBuilder().build()
        ];
    });

    it('should get all', function() {
        this.$httpBackend
            .expectGET(this.referencedataUrlFactory('/api/facilityOperators'))
            .respond(200, this.facilityOperators);

        var result;

        this.facilityOperatorService.getAll()
            .then(function(facilityOperators) {
                result = facilityOperators;
            });
        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(angular.toJson(result)).toEqual(angular.toJson(this.facilityOperators));
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });

});
