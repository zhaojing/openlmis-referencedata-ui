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

describe('facilityOperatorService', function() {

    var facilityOperatorService, $httpBackend, referencedataUrlFactory, facilityOperators,
        $rootScope;

    beforeEach(prepareSuite);

    it('should get all', function() {
        $httpBackend.expectGET(referencedataUrlFactory('/api/facilityOperators'))
            .respond(200, facilityOperators);

        var result;

        facilityOperatorService.getAll().then(function(facilityOperators) {
            result = facilityOperators;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(angular.toJson(result)).toEqual(angular.toJson(facilityOperators));
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    function prepareSuite() {
        module('referencedata-facility-operator');

        inject(function($injector) {
            facilityOperatorService = $injector.get('facilityOperatorService');
            $httpBackend = $injector.get('$httpBackend');
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            $rootScope = $injector.get('$rootScope');
        });

        facilityOperators = [{
            id: '9456c3e9-c4a6-4a28-9e08-47ceb16a4121',
            code: 'moh',
            name: 'Ministry of Health',
            description: null,
            displayOrder: 1
        }, {
            id: '1074353d-7364-4618-a127-708d7303a231',
            code: 'dwb',
            name: 'Doctors Without Borders',
            description: null,
            displayOrder: 2
        }];
    }

});
