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
        .module('referencedata-facility')
        .factory('FacilityBuilder', FacilityBuilder);

    FacilityBuilder.$inject = ['Facility', 'GeographicZoneBuilder', 'FacilityTypeBuilder',
        'FacilityOperatorBuilder'];

    function FacilityBuilder(Facility, GeographicZoneBuilder, FacilityTypeBuilder,
        FacilityOperatorBuilder) {

        FacilityBuilder.prototype.build = build;

        return FacilityBuilder;

        function FacilityBuilder() {
            this.id = '97546f93-ac93-435f-a437-cd629deb7d6d';
            this.code = 'N036';
            this.name = 'Assumane, Lichinga Cidade';
            this.description = 'description';
            this.geographicZone = new GeographicZoneBuilder().build();
            this.type = new FacilityTypeBuilder().build();
            this.operator = new FacilityOperatorBuilder().build();
            this.active = true;
            this.goLiveDate = '2010-09-01';
            this.goDownDate = '2020-09-01';
            this.comment = 'comment';
            this.enabled = true;
            this.openLmisAccessible = true;
            this.location = 'POINT(35.23962 -13.30037)';
            this.extraData = {};
        }

        function build() {
            return new Facility(
                this.id,
                this.code,
                this.name,
                this.description,
                this.type,
                this.operator,
                this.active,
                this.goLiveDate,
                this.goDownDate,
                this.comment,
                this.enabled,
                this.openLmisAccessible,
                this.location,
                this.extraData
            );
        }

    }

})();
