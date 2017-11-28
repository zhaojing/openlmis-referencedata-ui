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
     * @name referencedata-period.ProcessingSchedule
     *
     * @description
     * Represents a single processing schedule.
     */
    angular
        .module('referencedata-period')
        .factory('ProcessingSchedule', ProcessingSchedule);

    function ProcessingSchedule() {

        return ProcessingSchedule;

        /**
         * @ngdoc method
         * @methodOf referencedata-period.ProcessingSchedule
         * @name ProcessingSchedule
         *
         * @description
         * Creates a new instance of the ProcessingSchedule class.
         *
         * @param  {String}  id                 the UUID of the schedule to be created
         * @param  {Stting}  code               the code of the schedule to be created
         * @param  {String}  name               the name of the schedule to be created
         * @param  {String}  description        the description of the schedule to be created
         * @return {Object}                     the schedule object
         */
        function ProcessingSchedule(id, code, name, description) {
            this.id = id;
            this.code = code;
            this.name = name;
            this.description = description;
        }

    }

})();
