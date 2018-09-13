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

    var $rootScope, $httpBackend, openlmisUrlFactory, orderableService, orderables;

    beforeEach(function() {
        module('referencedata-orderable');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            orderableService = $injector.get('orderableService');
        });

        orderables = [
            {
                id: '1',
                code: 'P1'
            },
            {
                id: '2',
                code: 'P2'
            }
        ];
    });

    describe('get', function() {

        beforeEach(function() {
            $httpBackend.when('GET', openlmisUrlFactory('/api/orderables/' + orderables[0].id))
                .respond(200, orderables[0]);
        });

        it('should return promise', function() {
            var result = orderableService.get(orderables[0].id);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to orderable', function() {
            var result;

            orderableService.get(orderables[0].id).then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(orderables[0]));
        });

        it('should make a proper request', function() {
            $httpBackend.expectGET(openlmisUrlFactory('/api/orderables/' + orderables[0].id));

            orderableService.get(orderables[0].id);
            $httpBackend.flush();
        });
    });

    describe('search', function() {

        var searchParams,
            paginationParams;

        beforeEach(function() {
            searchParams = {
                code: 'some-code',
                name: 'some-name',
                program: 'some-program-id'
            };
            paginationParams = {
                page: 0,
                size: 10
            };
            $httpBackend.whenGET(openlmisUrlFactory('/api/orderables?' +
                'page=' + paginationParams.page + '&size=' + paginationParams.size +
                '&code=' + searchParams.code + '&name=' + searchParams.name +
                '&program=' + searchParams.program))
                .respond(200, {
                    content: orderables
                });
        });

        it('should return promise', function() {
            var result = orderableService.search(paginationParams, searchParams);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to orderable', function() {
            var result;

            orderableService.search(paginationParams, searchParams).then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result.content)).toEqual(angular.toJson(orderables));
        });

        it('should make a proper request', function() {
            $httpBackend.expectGET(openlmisUrlFactory('/api/orderables?' +
                'page=' + paginationParams.page + '&size=' + paginationParams.size +
                '&code=' + searchParams.code + '&name=' + searchParams.name +
                '&program=' + searchParams.program));

            orderableService.search(paginationParams, searchParams);
            $httpBackend.flush();
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });
});
