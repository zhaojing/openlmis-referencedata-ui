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
        .factory('GeographicLevelDataBuilder', GeographicLevelDataBuilder);

    GeographicLevelDataBuilder.$inject = ['GeographicLevel'];

    function GeographicLevelDataBuilder(GeographicLevel) {

        GeographicLevelDataBuilder.prototype.build = build;

        return GeographicLevelDataBuilder;

        function GeographicLevelDataBuilder() {
            this.id = '93c05138-4550-4461-9e8a-79d5f050c223';
            this.code = 'District';
            this.name = 'District';
            this.levelNumber = 3;
        }

        function build() {
            return new GeographicLevel(
                this.id,
                this.code,
                this.name,
                this.levelNumber
            );
        }

    }

})();
