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


    angular
        .module('referencedata-period')
        .factory('PeriodDataBuilder', PeriodDataBuilder);

    PeriodDataBuilder.$inject = ['Period', 'ProcessingScheduleDataBuilder'];

    function PeriodDataBuilder(Period, ProcessingScheduleDataBuilder) {

        PeriodDataBuilder.buildWithoutStartDate = buildWithoutStartDate;
        PeriodDataBuilder.buildWithoutEndDate = buildWithoutEndDate;

        PeriodDataBuilder.prototype.withStartDate = withStartDate;
        PeriodDataBuilder.prototype.withEndDate = withEndDate;
        PeriodDataBuilder.prototype.withoutStartDate = withoutStartDate;
        PeriodDataBuilder.prototype.withoutEndDate = withoutEndDate;
        PeriodDataBuilder.prototype.build = build;

        return PeriodDataBuilder;

        function PeriodDataBuilder() {
            PeriodDataBuilder.instanceNumber = (PeriodDataBuilder.instanceNumber || 0) + 1;

            this.id = 'period-id-' + PeriodDataBuilder.instanceNumber;
            this.name = 'Jan2017';
            this.description = 'description';
            this.startDate = new Date(2017, 0, 1);
            this.endDate = new Date(2017, 0, 31);
            this.processingSchedule = new ProcessingScheduleDataBuilder().build();
        }

        function withStartDate(newDate) {
            this.startDate = newDate;
            return this;
        }

        function withoutStartDate() {
            return this.withStartDate();
        }

        function withEndDate(newDate) {
            this.endDate = newDate;
            return this;
        }

        function withoutEndDate() {
            return this.withEndDate();
        }

        function build() {
            return new Period(
                this.id,
                this.name,
                this.description,
                this.startDate,
                this.endDate,
                this.processingSchedule
            );
        }

        function buildWithoutStartDate() {
            return new PeriodDataBuilder()
                .withoutStartDate()
                .build();
        }

        function buildWithoutEndDate() {
            return new PeriodDataBuilder()
                .withoutEndDate()
                .build();
        }

    }

})();
