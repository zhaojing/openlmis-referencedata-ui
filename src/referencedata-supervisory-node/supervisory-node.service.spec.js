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

    var $rootScope, $httpBackend, openlmisUrlFactory, supervisoryNodeService, supervisoryNodes;

    beforeEach(function() {
        module('referencedata-supervisory-node');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
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

    describe('get all', function() {

        var data;

        beforeEach(function() {
            $httpBackend.when('GET', openlmisUrlFactory('/api/supervisoryNodes'))
                .respond(200, supervisoryNodes);
        });

        it('should get all roles', function() {
            supervisoryNodeService.getAll().then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(data)).toEqual(angular.toJson(supervisoryNodes));
        });
    });

    describe('get', function() {

        beforeEach(function() {
            $httpBackend.when('GET', openlmisUrlFactory('/api/supervisoryNodes/' + supervisoryNodes[0].id)).respond(200, supervisoryNodes[0]);
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
            $httpBackend.expect('GET', openlmisUrlFactory('/api/supervisoryNodes/' + supervisoryNodes[0].id));

            supervisoryNodeService.get(supervisoryNodes[0].id);
            $httpBackend.flush();
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });
});
