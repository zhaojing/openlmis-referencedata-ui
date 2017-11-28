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
     * @name referencedata-period.Period
     *
     * @description
     * Represents a single period.
     */
    angular
        .module('referencedata-period')
        .factory('Period', Period);

    function Period() {

        return Period;

        /**
         * @ngdoc method
         * @methodOf referencedata-period.Period
         * @name Program
         *
         * @description
         * Creates a new instance of the Period class.
         *
         * @param  {String}  id                 the UUID of the period to be created
         * @param  {String}  name               the name of the period to be created
         * @param  {String}  description        the description of the period to be created
         * @param  {Date}    startDate          the start date of the period to be created
         * @param  {Date}    endDate            the end date of the period to be created
         * @param  {Object}  processingSchedule the processing schedule of the period to be created
         * @return {Object}                     the period object
         */
        function Period(id, name, description, startDate, endDate, processingSchedule) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.startDate = startDate;
            this.endDate = endDate;
            this.processingSchedule = processingSchedule;
        }

    }

})();
