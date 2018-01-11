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

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name referencedata-period.periodFactory
     *
     * @description
     * Allows the user to retrieve sorted periods for schedule.
     */
    angular
        .module('referencedata-period')
        .factory('periodFactory', factory);

    factory.$inject = ['periodService', 'dateUtils'];

    function factory(periodService, dateUtils) {

        return {
            getSortedPeriodsForSchedule: getSortedPeriodsForSchedule
        };

        /**
         * @ngdoc method
         * @methodOf referencedata-period.periodFactory
         * @name getSortedPeriodsForSchedule
         *
         * @description
         * Retrieves Processing Periods assigned to given Processing Schedule.
         *
         * @param  {String}  scheduleId Processing Schedule UUID
         * @return {Promise}            list of Processing Periods
         */
        function getSortedPeriodsForSchedule(scheduleId) {
            return periodService.getBySchedule(scheduleId)
            .then(function(periods) {
                periods.forEach(function(period) {
                    period.startDate = dateUtils.toDate(period.startDate);
                    period.endDate = dateUtils.toDate(period.endDate);
                });
                return periods.sort(function(a, b) {
                    return a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0;
                });
            });
        }
    }
})();
