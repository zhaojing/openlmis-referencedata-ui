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
        .factory('ScheduleDataBuilder', ScheduleDataBuilder);

    ScheduleDataBuilder.$inject = ['Schedule'];

    function ScheduleDataBuilder(Schedule) {

        ScheduleDataBuilder.prototype.build = build;

        return ScheduleDataBuilder;

        function ScheduleDataBuilder() {
            this.id = '9c15bd6e-3f6b-4b91-b53a-36c199d35eac';
            this.code = 'SCH001';
            this.name = 'Monthly';
            this.description = 'description';
        }

        function build() {
            return new Schedule(
                this.id,
                this.code,
                this.name,
                this.description
            );
        }

    }

})();
