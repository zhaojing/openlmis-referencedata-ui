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

describe('geographicZoneService', function() {

    beforeEach(function() {
        module('referencedata-geographic-zone');

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            this.geographicZoneService = $injector.get('geographicZoneService');
            this.GeographicZoneDataBuilder = $injector.get('GeographicZoneDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.geographicZone = new this.GeographicZoneDataBuilder().build();

        this.geographicZones = [
            this.geographicZone,
            new this.GeographicZoneDataBuilder().build()
        ];

        this.page = 0;
        this.size = 2;
        this.params = {
            page: this.page,
            size: this.size
        };

        this.geographicZonesPage = new this.PageDataBuilder()
            .withContent(this.geographicZones)
            .build();
    });

    describe('getAll', function() {

        it('should get all geographic zones', function() {
            this.$httpBackend
                .expectGET(
                    this.referencedataUrlFactory(
                        '/api/geographicZones' +
                        '?page=' + this.params.page +
                        '&size=' + this.params.size
                    )
                )
                .respond(200, this.geographicZonesPage);

            var result;
            this.geographicZoneService
                .getAll(this.params)
                .then(function(geographicZonesPage) {
                    result = geographicZonesPage;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.geographicZonesPage));
        });
    });

    describe('get', function() {

        it('should resolve to geographic zones', function() {
            this.$httpBackend
                .expectGET(this.referencedataUrlFactory('/api/geographicZones/' + this.geographicZone.id))
                .respond(200, this.geographicZone);

            var result;

            this.geographicZoneService
                .get(this.geographicZone.id)
                .then(function(data) {
                    result = data;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.geographicZone));
        });

    });

    describe('search', function() {

        beforeEach(function() {
            this.params.code = 'some-code';
            this.params.name = 'some-name';
            this.params.sort = 'name';
        });

        it('should resolve to geographic zones', function() {
            this.$httpBackend
                .expectPOST(this.referencedataUrlFactory(
                    '/api/geographicZones/search' +
                        '?page=' + this.params.page +
                        '&size=' + this.params.size +
                        '&sort=' + this.params.sort
                ))
                .respond(200, this.geographicZonesPage);

            var result;
            this.geographicZoneService
                .search(this.params)
                .then(function(geographicZonesPage) {
                    result = geographicZonesPage;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.geographicZonesPage));
        });
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingRequest();
        this.$httpBackend.verifyNoOutstandingExpectation();
    });
});
