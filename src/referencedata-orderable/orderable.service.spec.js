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

describe('orderableService', function() {

    beforeEach(function() {
        module('openlmis-pagination');
        module('referencedata-orderable');

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            this.orderableService = $injector.get('orderableService');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.orderable = new this.OrderableDataBuilder().build();

        this.orderables = [
            this.orderable,
            new this.OrderableDataBuilder().build()
        ];

        this.orderablesPage = new this.PageDataBuilder()
            .withContent(this.orderables)
            .build();
    });

    describe('get', function() {

        it('should resolve to orderable', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory('/api/orderables/' + this.orderable.id))
                .respond(200, this.orderable);

            var result;
            this.orderableService
                .get(this.orderable.id)
                .then(function(orderable) {
                    result = orderable;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.orderable));
        });
    });

    describe('search', function() {

        beforeEach(function() {
            this.searchParams = {
                code: 'some-code',
                name: 'some-name',
                program: 'some-program-id'
            };

            this.paginationParams = {
                page: 0,
                size: 10
            };
        });

        it('should resolve to orderable', function() {
            this.$httpBackend
                .expectGET(this.openlmisUrlFactory(
                    '/api/orderables' +
                    '?page=' + this.paginationParams.page +
                    '&size=' + this.paginationParams.size +
                    '&code=' + this.searchParams.code +
                    '&name=' + this.searchParams.name +
                    '&program=' + this.searchParams.program
                ))
                .respond(200, this.orderablesPage);

            var result;
            this.orderableService
                .search(this.paginationParams, this.searchParams)
                .then(function(orderablesPage) {
                    result = orderablesPage;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.orderablesPage));
        });
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingRequest();
        this.$httpBackend.verifyNoOutstandingExpectation();
    });
});
