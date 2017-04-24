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

    var $rootScope, $httpBackend, referencedataUrlFactory, geographicZones, geographicZoneService;

    beforeEach(function() {
        module('referencedata-geographic-zone');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            geographicZoneService = $injector.get('geographicZoneService');
        });

        geographicZones = [
            {
                id: '1',
                name: 'zone-1'
            },
            {
                id: '2',
                name: 'zone-1'
            }
        ];
    });

    describe('getAll', function() {

        var data,
            paginationParams = {
                page: 0,
                size: 2
            };

        beforeEach(function() {
            $httpBackend.when('GET', referencedataUrlFactory('/api/geographicZones?page=' + paginationParams.page + '&size=' + paginationParams.size))
                .respond(200, {
                    content: geographicZones
                });
        });

        it('should get all geographic zones', function() {
            geographicZoneService.getAll(paginationParams).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(data)).toEqual(angular.toJson({content: geographicZones}));
        });
    });

    describe('get', function() {

        var data;

        beforeEach(function() {
            $httpBackend.when('GET', referencedataUrlFactory('/api/geographicZones/' + geographicZones[0].id)).respond(200, geographicZones[0]);
        });

        it('should return promise', function() {
            var result = geographicZoneService.get(geographicZones[0].id);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to geographic zones', function() {
            var result;

            geographicZoneService.get(geographicZones[0].id).then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result).not.toBeUndefined();
            expect(result.id).toBe(geographicZones[0].id);
        });

        it('should make a proper request', function() {
            $httpBackend.expect('GET', referencedataUrlFactory('/api/geographicZones/' + geographicZones[0].id));

            geographicZoneService.get(geographicZones[0].id);
            $httpBackend.flush();
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });
});
