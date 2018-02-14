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
            FacilityTypeDataBuilder.instanceNumber = (FacilityTypeDataBuilder.instanceNumber || 0) + 1;

            this.id = 'facility-type-id-' + FacilityTypeDataBuilder.instanceNumber;
            this.code = 'health_center';
            this.name = 'Health Center';
            this.description = 'description';
            this.displayOrder = 2;
            this.active = true;
        }

        function buildAsDistrictHospital(){
            this.code = 'dist_hosp';
            this.name = 'District Hospital';
            this.displayOrder = 3;
            return this.build();
        }

        function buildAsDistrictStore(){
            this.code = 'dist_store';
            this.name = 'District Store';
            this.displayOrder = 4;
            return this.build();
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