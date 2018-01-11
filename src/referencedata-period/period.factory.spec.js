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

describe('periodFactory', function() {

    var $q, $rootScope, periodService, periodFactory, PeriodDataBuilder,
        periods;

    beforeEach(function() {
        module('referencedata-period');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            periodService = $injector.get('periodService');
            periodFactory = $injector.get('periodFactory');
            PeriodDataBuilder = $injector.get('PeriodDataBuilder');
        });

        periods = [
            new PeriodDataBuilder().buildWithIsoStringsRandomDates(new Date('2017-12-12'), new Date('2017-12-12')),
            new PeriodDataBuilder().buildWithIsoStringsRandomDates(new Date('2017-11-12'), new Date('2017-11-12')),
            new PeriodDataBuilder().buildWithIsoStringsRandomDates(new Date('2017-10-12'), new Date('2017-10-12'))
        ];

        spyOn(periodService, 'getBySchedule').andReturn($q.resolve(periods));
    });

    describe('getSortedPeriodsForSchedule', function() {

        var scheduleId = 'schedule-id';

        it('should get sorted periods', function() {
            var data;

            periodFactory.getSortedPeriodsForSchedule(scheduleId)
            .then(function(response) {
                data = response;
            });
            $rootScope.$apply();

            expect(periodService.getBySchedule).toHaveBeenCalledWith(scheduleId);
            data.forEach(function(period, index) {
                if (index + 1 < data.length) {
                    expect(period.startDate <= data[index + 1].startDate).toBe(true);
                }
            });
        });
    });
});
