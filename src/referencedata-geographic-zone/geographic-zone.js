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
     * @name referencedata-geographic-zone.GeographicZone
     *
     * @description
     * Represents a single geographic zone.
     */
    angular
        .module('referencedata-geographic-zone')
        .factory('GeographicZone', GeographicZone);

    function GeographicZone() {

        return GeographicZone;

        /**
         * @ngdoc method
         * @methodOf referencedata-geographic-zone.GeographicZone
         * @name GeographicZone
         *
         * @description
         * Creates a new instance of the GeographicZone class.
         *
         * @param  {String}  id                     the UUID of the geographic zone to be created
         * @param  {String}  code                   the code of the geographic zone to be created
         * @param  {String}  name                   the name of the geographic zone to be created
         * @param  {Object}  level                  the level of the geographic zone to be created
         * @param  {Number}  catchmentPopulation    the catchment population of the geographic zone to be created
         * @param  {Number}  latitude               the latitude of the geographic zone to be created
         * @param  {Number}  longitude              the longitude of the geographic zone to be created
         * @param  {Object}  boundary               the boundary of the geographic zone to be created
         * @param  {Object}  parent                 the parent of the geographic zone to be created
         * @return {Object}                         the geographic zone object
         */
        function GeographicZone(id, code, name, level, catchmentPopulation, latitude, longitude,
                                boundary, parent) {
            this.id = id;
            this.code = code;
            this.name = name;
            this.level = level;
            this.catchmentPopulation = catchmentPopulation;
            this.latitude = latitude;
            this.longitude = longitude;
            this.boundary = boundary;
            this.parent = parent;
        }

    }

})();
