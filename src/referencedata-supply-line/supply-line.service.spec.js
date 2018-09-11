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

describe('supplyLineService', function() {

    var $rootScope, $httpBackend, referencedataUrlFactory, supplyLines, supplyLineService;

    beforeEach(function() {
        module('referencedata-supply-line');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            supplyLineService = $injector.get('supplyLineService');
        });

        supplyLines = [
            {
                id: '1',
                name: 'supply-line-1'
            },
            {
                id: '2',
                name: 'supply-line-2'
            }
        ];
    });

    describe('getAll', function() {

        var data;

        beforeEach(function() {
            $httpBackend.when('GET', referencedataUrlFactory('/api/supplyLines')).respond(200, supplyLines);
        });

        it('should get all supply lines', function() {
            supplyLineService.getAll().then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(data)).toEqual(angular.toJson(supplyLines));
        });
    });

    describe('get', function() {

        beforeEach(function() {
            $httpBackend.when('GET', referencedataUrlFactory('/api/supplyLines/' + supplyLines[0].id))
                .respond(200, supplyLines[0]);
        });

        it('should return promise', function() {
            var result = supplyLineService.get(supplyLines[0].id);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to supply line', function() {
            var result;

            supplyLineService.get(supplyLines[0].id).then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result).not.toBeUndefined();
            expect(result.id).toBe(supplyLines[0].id);
        });

        it('should make a proper request', function() {
            $httpBackend.expect('GET', referencedataUrlFactory('/api/supplyLines/' + supplyLines[0].id));

            supplyLineService.get(supplyLines[0].id);
            $httpBackend.flush();
        });

    });

    describe('search', function() {

        var params;

        beforeEach(function() {
            params = {
                program: 'program-code',
                supervisoryNode: 'node-code',
                supplyFacility: 'facility-code',
                sort: 'supplyFacilityName',
                page: 0,
                size: 10
            };
            $httpBackend.when('POST', referencedataUrlFactory('/api/supplyLines/search?page=' +
                params.page + '&size=' + params.size + '&sort=' + params.sort)).respond(function(method, url, body) {
                var parsedBody = JSON.parse(body);
                if (parsedBody.program === params.program &&
                        parsedBody.supervisoryNode === params.supervisoryNode &&
                        parsedBody.supplyFacility === params.supplyFacility) {
                    return [200, {
                        content: supplyLines
                    }];
                }
                return [400];

            });
        });

        it('should return promise', function() {
            var result = supplyLineService.search(params);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to supply lines', function() {
            var result;

            supplyLineService.search(params).then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.content).toEqual(supplyLines);
        });

        it('should make a proper request', function() {
            $httpBackend.expect('POST', referencedataUrlFactory('/api/supplyLines/search?page=' +
                params.page + '&size=' + params.size + '&sort=' + params.sort));

            supplyLineService.search(params);
            $httpBackend.flush();
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });
});
