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

    var $rootScope, $httpBackend, referencedataUrlFactory, periodService, PeriodDataBuilder,
        periods;

    beforeEach(function() {
        module('referencedata-period');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
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

    describe('getBySchedule', function() {

        it('should get all processing periods for schedule', function() {
            var data,
                scheduleId = 'schedule-id';

            $httpBackend.when('GET', referencedataUrlFactory('/api/processingPeriods/searchByScheduleAndDate?processingScheduleId=' + scheduleId))
                .respond(200, periods);

            periodService.getBySchedule(scheduleId).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.length).toEqual(2);
            expect(data[0].id).toBe(periods[0].id);
            expect(data[1].id).toBe(periods[1].id);
        });
    });

    describe('create', function() {

        it('should create new processing period', function() {
            var data;

            $httpBackend.expectPOST(referencedataUrlFactory('/api/processingPeriods'), periods[0])
                .respond(200, periods[0]);

            periodService.create(periods[0]).then(function(response) {
                data = response;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.name).toEqual(periods[0].name);
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
