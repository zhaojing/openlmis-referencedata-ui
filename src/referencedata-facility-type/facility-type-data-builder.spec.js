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
        .module('referencedata-facility-type')
        .factory('FacilityTypeDataBuilder', FacilityTypeDataBuilder);

    FacilityTypeDataBuilder.$inject = ['FacilityType'];

    function FacilityTypeDataBuilder(FacilityType) {

        FacilityTypeDataBuilder.prototype.build = build;
        FacilityTypeDataBuilder.prototype.buildDistrictHospital = buildAsDistrictHospital;
        FacilityTypeDataBuilder.prototype.buildDistrictStore = buildAsDistrictStore;

        return FacilityTypeDataBuilder;

        function FacilityTypeDataBuilder() {
            this.id = 'ac1d268b-ce10-455f-bf87-9c667da8f060';
            this.code = 'health_center';
            this.name = 'Health Center';
            this.description = 'description';
            this.displayOrder = 2;
            this.active = true;
        }

        function buildAsDistrictHospital(){
            this.id = '663b1d34-cc17-4d60-9619-e553e45aa441';
            this.code = 'dist_hosp';
            this.name = 'District Hospital';
            this.displayOrder = 3;
            return this;
        }

        function buildAsDistrictStore(){
            this.id = '5fc213c6-1bd7-46f0-9883-57c05250ca90';
            this.code = 'dist_store';
            this.name = 'District Store';
            this.displayOrder = 4;
            return this;
        }

        function build() {
            return new FacilityType(
                this.id,
                this.code,
                this.name,
                this.description,
                this.displayOrder,
                this.active
            );
        }

    }

})();