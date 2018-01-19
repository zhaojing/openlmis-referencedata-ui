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

describe('periodService', function() {

    var $rootScope, $httpBackend, referencedataUrlFactory, periodService, dateUtils, PeriodDataBuilder,
        periods;

    beforeEach(function() {
        module('referencedata-period');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            dateUtils = $injector.get('dateUtils');
            periodService = $injector.get('periodService');
            PeriodDataBuilder = $injector.get('PeriodDataBuilder');
        });

        periods = [
            new PeriodDataBuilder().build(),
            new PeriodDataBuilder().build()
        ];
    });

    describe('get', function() {

        it('should get processing schedule by id', function() {
            var data;

            $httpBackend.when('GET', referencedataUrlFactory('/api/processingPeriods/' + periods[0].id))
                .respond(200, periods[0]);

            periodService.get(periods[0].id).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.id).toBe(periods[0].id);
        });
    });

    describe('create', function() {

        it('should create new processing period', function() {
            var data,
                periodCopy = angular.copy(periods[0]);

            periodCopy.startDate = dateUtils.toStringDate(periodCopy.startDate);
            periodCopy.endDate = dateUtils.toStringDate(periodCopy.endDate);
            $httpBackend.expectPOST(referencedataUrlFactory('/api/processingPeriods'), periodCopy)
                .respond(200, periods[0]);

            periodService.create(periods[0]).then(function(response) {
                data = response;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.name).toEqual(periods[0].name);
        });
    });

    describe('query', function() {

        it('should get all periods and save them to storage', function() {
            var data,
                params = {
                    page: 0
                };

            $httpBackend.expectGET(referencedataUrlFactory('/api/processingPeriods?page=' + params.page)).respond(200, {
                content: periods
            });

            periodService.query(params).then(function(response) {
                data = response.content;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data[0].id).toBe(periods[0].id);
            expect(data[1].id).toBe(periods[1].id);
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
