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
     * @name referencedata-geographic-zone.GeographicLevel
     *
     * @description
     * Represents a single geographic level.
     */
    angular
        .module('referencedata-geographic-zone')
        .factory('GeographicLevel', GeographicLevel);

    function GeographicLevel() {

        return GeographicLevel;

        /**
         * @ngdoc method
         * @methodOf referencedata-geographic-zone.GeographicLevel
         * @name GeographicLevel
         *
         * @description
         * Creates a new instance of the GeographicLevel class.
         *
         * @param  {String}  id             the UUID of the geographic level to be created
         * @param  {String}  code           the code of the geographic level to be created
         * @param  {String}  name           the name of the geographic level to be created
         * @param  {Number}  levelNumber    the level number of the geographic level to be created
         * @return {Object}                 the geographic level object
         */
        function GeographicLevel(id, code, name, levelNumber) {
            this.id = id;
            this.code = code;
            this.name = name;
            this.levelNumber = levelNumber;
        }

    }

})();
