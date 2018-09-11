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

    var $rootScope, $httpBackend, referencedataUrlFactory, facilityTypeService, FacilityTypeDataBuilder,
        PageDataBuilder, facilityTypeOne, facilityTypeTwo;

    beforeEach(function() {
        module('referencedata-facility-type');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            facilityTypeService = $injector.get('facilityTypeService');
            FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            PageDataBuilder = $injector.get('PageDataBuilder');
        });

        facilityTypeOne = new FacilityTypeDataBuilder().build();
        facilityTypeTwo = new FacilityTypeDataBuilder().build();
    });

    describe('get', function() {

        it('should get facility type by id', function() {
            var data;

            $httpBackend.when('GET', referencedataUrlFactory('/api/facilityTypes/' + facilityTypeOne.id))
                .respond(200, facilityTypeOne);

            facilityTypeService.get(facilityTypeOne.id)
                .then(function(response) {
                    data = response;
                });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.id).toBe(facilityTypeOne.id);
            expect(data.name).toBe(facilityTypeOne.name);
        });
    });

    describe('query', function() {

        var page;

        beforeEach(function() {
            page = new PageDataBuilder().withContent([facilityTypeOne, facilityTypeTwo]);
        });

        it('should get all facility types', function() {
            var data;

            $httpBackend.when('GET', referencedataUrlFactory('/api/facilityTypes'))
                .respond(200, page);

            facilityTypeService.query()
                .then(function(response) {
                    data = response;
                });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.content[0].id).toBe(page.content[0].id);
            expect(data.content[1].id).toBe(page.content[1].id);
        });

        it('should get all facility types by ids', function() {
            var data,
                idOne = 'id-one',
                idTwo = 'id-two';

            $httpBackend.when('GET', referencedataUrlFactory('/api/facilityTypes?id=' + idOne + '&id=' + idTwo))
                .respond(200, page);

            facilityTypeService.query({
                id: [idOne, idTwo]
            })
                .then(function(response) {
                    data = response;
                });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.content[0].id).toBe(page.content[0].id);
            expect(data.content[1].id).toBe(page.content[1].id);
        });
    });

    describe('create', function() {

        var result;

        it('should create facility type if id is not given', function() {
            facilityTypeOne = new FacilityTypeDataBuilder().withoutId()
                .build();

            $httpBackend.expect('POST', referencedataUrlFactory('/api/facilityTypes'), facilityTypeOne)
                .respond(200, facilityTypeOne);

            facilityTypeService.create(facilityTypeOne)
                .then(function(response) {
                    result = response;
                });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(facilityTypeOne));
        });

        it('should not resolve promise if request fails', function() {
            facilityTypeOne = new FacilityTypeDataBuilder().withoutId()
                .build();

            $httpBackend.expect('POST', referencedataUrlFactory('/api/facilityTypes'), facilityTypeOne)
                .respond(400);

            facilityTypeService.create(facilityTypeOne)
                .catch(function() {
                    result = 'fail';
                });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(result).toEqual('fail');
        });
    });

    describe('update', function() {

        var result;

        it('should update facility type', function() {
            $httpBackend.expect(
                'PUT',
                referencedataUrlFactory('/api/facilityTypes/' + facilityTypeOne.id),
                facilityTypeOne
            )
                .respond(200, facilityTypeOne);

            facilityTypeService.update(facilityTypeOne)
                .then(function(response) {
                    result = response;
                });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(facilityTypeOne));
        });

        it('should not resolve promise if request fails', function() {
            $httpBackend.expect(
                'PUT',
                referencedataUrlFactory('/api/facilityTypes/' + facilityTypeOne.id),
                facilityTypeOne
            )
                .respond(400);

            facilityTypeService.update(facilityTypeOne)
                .catch(function() {
                    result = 'fail';
                });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(result).toEqual('fail');
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
