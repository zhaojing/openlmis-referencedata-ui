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

describe('supplyPartnerService', function() {

    var $rootScope, $httpBackend, referencedataUrlFactory, supplyPartnerService, supplyPartners;

    beforeEach(function() {
        module('referencedata-supply-partner');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            supplyPartnerService = $injector.get('supplyPartnerService');
        });

        supplyPartners = [
            {
                id: '1',
                code: 'SP1'
            },
            {
                id: '2',
                code: 'SP2'
            }
        ];
    });

    describe('get', function() {

        beforeEach(function() {
            $httpBackend.when('GET', referencedataUrlFactory('/api/supplyPartners/' + supplyPartners[0].id))
                .respond(200, supplyPartners[0]);
        });

        it('should return promise', function() {
            var result = supplyPartnerService.get(supplyPartners[0].id);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to supply partner', function() {
            var result;

            supplyPartnerService.get(supplyPartners[0].id).then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(supplyPartners[0]));
        });

        it('should make a proper request', function() {
            $httpBackend.expectGET(referencedataUrlFactory('/api/supplyPartners/' + supplyPartners[0].id));

            supplyPartnerService.get(supplyPartners[0].id);
            $httpBackend.flush();
        });
    });

    describe('query', function() {

        var page, size, name, url;

        beforeEach(function() {
            page = 0;
            size = 2;
            name = 'supplyPartner';
            url = referencedataUrlFactory('/api/supplyPartners?name=' + name + '&page=' + page + '&size=' + size);

            $httpBackend.when('GET', url)
                .respond(200, {
                    content: [supplyPartners[0], supplyPartners[1]]
                });
        });

        it('should make correct request', function() {
            $httpBackend.expectGET(url);

            supplyPartnerService.query({
                page: page,
                size: size,
                name: name
            });
            $httpBackend.flush();
        });

        it('should resolve to supply partner` list', function() {
            var result;

            supplyPartnerService.query({
                page: page,
                size: size,
                name: name
            }).then(function(paginatedObject) {
                result = paginatedObject;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.content.length).toEqual(2);
            expect(result.content).toEqual([supplyPartners[0], supplyPartners[1]]);
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });
});
