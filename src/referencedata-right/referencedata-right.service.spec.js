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
describe('referencedataRightService', function() {

    var referencedataRightService, $httpBackend, $rootScope, rights, openlmisUrlFactory;

    beforeEach(function() {
        module('referencedata-right');

        rights = [{
            id: 'id-one',
            name: 'RIGHT_ONE',
            type: 'TYPE_ONE'
        }, {
            id: 'id-two',
            name: 'RIGHT_TWO',
            type: 'TYPE_TWO'
        }, {
            id: 'id-three',
            name: 'RIGHT_THREE',
            type: 'TYPE_ONE'
        }];

        inject(function($injector) {
            referencedataRightService = $injector.get('referencedataRightService');
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
        });
    });

    describe('search', function() {

        var name, type, url;

        beforeEach(function() {
            name = 'RIGHT';
            type = 'TYPE_ONE';

            url = '/api/rights/search?name=' + name + '&type=' + type;

            $httpBackend.whenGET(openlmisUrlFactory(url)).respond(200, [
                rights[0],
                rights[2]
            ]);
        });

        it('should return promise', function() {
            var result = referencedataRightService.search(name, type);
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to a list of rights', function() {
            var result;

            referencedataRightService.search(name, type).then(function(response) {
                result = response;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson([
                rights[0],
                rights[2]
            ]));
        });

        it('should make a proper request', function() {
            $httpBackend.expectGET(openlmisUrlFactory(url));

            referencedataRightService.search(name, type);
            $httpBackend.flush();
            $rootScope.$apply();
        });

    });

    describe('getAll', function() {

        beforeEach(function() {
            $httpBackend.whenGET(openlmisUrlFactory('/api/rights')).respond(200, rights);
        });

        it('should return promise', function() {
            var result = referencedataRightService.getAll();
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to a list of rights', function() {
            var result;

            referencedataRightService.getAll().then(function(response) {
                result = response;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(rights));
        });

        it('should make a proper request', function() {
            $httpBackend.expectGET(openlmisUrlFactory('/api/rights'));

            referencedataRightService.getAll();
            $httpBackend.flush();
            $rootScope.$apply();
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });

});
