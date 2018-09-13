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

describe('supervisoryNodeService', function() {

    var $rootScope, $httpBackend, referencedataUrlFactory, supervisoryNodeService, supervisoryNodes;

    beforeEach(function() {
        module('referencedata-supervisory-node');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            supervisoryNodeService = $injector.get('supervisoryNodeService');
        });

        supervisoryNodes = [
            {
                id: '1',
                code: 'SN1'
            },
            {
                id: '2',
                code: 'SN2'
            }
        ];
    });

    describe('get', function() {

        beforeEach(function() {
            $httpBackend.when('GET', referencedataUrlFactory('/api/supervisoryNodes/' + supervisoryNodes[0].id))
                .respond(200, supervisoryNodes[0]);
        });

        it('should return promise', function() {
            var result = supervisoryNodeService.get(supervisoryNodes[0].id);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to supervisory node', function() {
            var result;

            supervisoryNodeService.get(supervisoryNodes[0].id).then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(supervisoryNodes[0]));
        });

        it('should make a proper request', function() {
            $httpBackend.expectGET(referencedataUrlFactory('/api/supervisoryNodes/' + supervisoryNodes[0].id));

            supervisoryNodeService.get(supervisoryNodes[0].id);
            $httpBackend.flush();
        });
    });

    describe('query', function() {

        var page, size, name, url;

        beforeEach(function() {
            page = 0;
            size = 2;
            name = 'supervisoryNode';
            url = referencedataUrlFactory('/api/supervisoryNodes?name=' + name + '&page=' + page + '&size=' + size);

            $httpBackend.when('GET', url)
                .respond(200, {
                    content: [supervisoryNodes[0], supervisoryNodes[1]]
                });
        });

        it('should make correct request', function() {
            $httpBackend.expectGET(url);

            supervisoryNodeService.query({
                page: page,
                size: size,
                name: name
            });
            $httpBackend.flush();
        });

        it('should resolve to supervisory node` list', function() {
            var result;

            supervisoryNodeService.query({
                page: page,
                size: size,
                name: name
            }).then(function(paginatedObject) {
                result = paginatedObject;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.content.length).toEqual(2);
            expect(result.content).toEqual([supervisoryNodes[0], supervisoryNodes[1]]);
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });
});
