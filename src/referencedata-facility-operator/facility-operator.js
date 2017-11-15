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
     * @name referencedata-facility-operator.FacilityOperator
     *
     * @description
     * Represents a single facility operator.
     */
    angular
        .module('referencedata-facility-operator')
        .factory('FacilityOperator', FacilityOperator);

    function FacilityOperator() {

        return FacilityOperator;

        /**
         * @ngdoc method
         * @methodOf referencedata-facility-operator.FacilityOperator
         * @name FacilityOperator
         *
         * @description
         * Creates a new instance of the FacilityOperator class.
         *
         * @param  {String}  id             the UUID of the facility operator to be created
         * @param  {String}  code           the code of the facility operator to be created
         * @param  {String}  name           the name of the facility operator to be created
         * @param  {String}  description    the description of the facility operator to be created
         * @param  {Number}  displayOrder   the display order of the facility operator to be created
         * @return {Object}                 the facility operator object
         */
        function FacilityOperator(id, code, name, description, displayOrder) {
            this.id = id;
            this.code = code;
            this.name = name;
            this.description = levelNumber;
            this.displayOrder = displayOrder;
        }

    }

})();
