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
        .module('referencedata-geographic-zone')
        .factory('GeographicZoneDataBuilder', GeographicZoneDataBuilder);

    GeographicZoneDataBuilder.$inject = ['GeographicZone', 'GeographicLevelDataBuilder'];

    function GeographicZoneDataBuilder(GeographicZone, GeographicLevelDataBuilder) {

        GeographicZoneDataBuilder.prototype.build = build;
        GeographicZoneDataBuilder.prototype.withParent = withParent;

        return GeographicZoneDataBuilder;

        function GeographicZoneDataBuilder() {
            this.id = '88b7eef3-b3f3-4f1a-9782-f5a88f78c56b';
            this.code = 'lichinga-distrito';
            this.name = 'Lichinga Distrito';
            this.level = new GeographicLevelDataBuilder().build();
            this.catchmentPopulation = 12300;
            this.latitude = 35.189;
            this.longitude = -13.378;
            this.boundary = 'POLYGON ((35.16567199896879 -15.216449002092054))';
            this.parent = null;
        }

        function withParent(newParent) {
            this.parent = newParent;
            return this;
        }

        function build() {
            return new GeographicZone(
                this.id,
                this.code,
                this.name,
                this.level,
                this.catchmentPopulation,
                this.latitude,
                this.longitude,
                this.boundary,
                this.parent
            );
        }

    }

})();
