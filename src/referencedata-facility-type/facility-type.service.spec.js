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

describe('facilityTypeService', function() {

    beforeEach(function() {
        module('referencedata-facility-type');

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            this.facilityTypeService = $injector.get('facilityTypeService');
            this.FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.facilityTypeOne = new this.FacilityTypeDataBuilder().build();
        this.facilityTypeTwo = new this.FacilityTypeDataBuilder().build();

        this.facilityTypes = [
            this.facilityTypeOne,
            this.facilityTypeTwo
        ];

        this.facilityTypesPage = new this.PageDataBuilder()
            .withContent(this.facilityTypes)
            .build();
    });

    describe('get', function() {

        it('should get facility type by id', function() {
            this.$httpBackend
                .whenGET(this.referencedataUrlFactory('/api/facilityTypes/' + this.facilityTypeOne.id))
                .respond(200, this.facilityTypeOne);

            var result;
            this.facilityTypeService
                .get(this.facilityTypeOne.id)
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.facilityTypeOne));
        });
    });

    describe('query', function() {

        it('should get all facility types', function() {
            this.$httpBackend
                .whenGET(this.referencedataUrlFactory('/api/facilityTypes'))
                .respond(200, this.facilityTypesPage);

            var result;
            this.facilityTypeService
                .query()
                .then(function(facilityTypesPage) {
                    result = facilityTypesPage;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.facilityTypesPage));
        });

        it('should get all facility types by ids', function() {
            var idOne = 'id-one',
                idTwo = 'id-two';

            this.$httpBackend
                .expectGET(this.referencedataUrlFactory('/api/facilityTypes?id=' + idOne + '&id=' + idTwo))
                .respond(200, this.facilityTypesPage);

            var result;
            this.facilityTypeService.
                query({
                    id: [idOne, idTwo]
                })
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.facilityTypesPage));
        });
    });

    describe('create', function() {

        it('should create facility type if id is not given', function() {
            var facilityTypeDataBuilder = new this.FacilityTypeDataBuilder();

            this.facilityTypeOne = facilityTypeDataBuilder.build();

            this.facilityTypeOneWithoutId = facilityTypeDataBuilder
                .withoutId()
                .build();

            this.$httpBackend
                .expectPOST(this.referencedataUrlFactory('/api/facilityTypes'), this.facilityTypeOneWithoutId)
                .respond(200, this.facilityTypeOne);

            var result;
            this.facilityTypeService
                .create(this.facilityTypeOneWithoutId)
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.facilityTypeOne));
        });

        it('should not resolve promise if request fails', function() {
            this.facilityTypeOne = new this.FacilityTypeDataBuilder().withoutId()
                .build();

            this.$httpBackend
                .expectPOST(this.referencedataUrlFactory('/api/facilityTypes'), this.facilityTypeOne)
                .respond(400);

            var rejected;
            this.facilityTypeService
                .create(this.facilityTypeOne)
                .catch(function() {
                    rejected = true;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);
        });
    });

    describe('update', function() {

        it('should update facility type', function() {
            this.$httpBackend
                .expectPUT(
                    this.referencedataUrlFactory('/api/facilityTypes/' + this.facilityTypeOne.id),
                    this.facilityTypeOne
                )
                .respond(200, this.facilityTypeOne);

            var result;
            this.facilityTypeService
                .update(this.facilityTypeOne)
                .then(function(response) {
                    result = response;
                });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.facilityTypeOne));
        });

        it('should not resolve promise if request fails', function() {
            this.$httpBackend
                .expectPUT(
                    this.referencedataUrlFactory('/api/facilityTypes/' + this.facilityTypeOne.id),
                    this.facilityTypeOne
                )
                .respond(400);

            var rejected;
            this.facilityTypeService
                .update(this.facilityTypeOne)
                .catch(function() {
                    rejected = true;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);
        });
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });
});
