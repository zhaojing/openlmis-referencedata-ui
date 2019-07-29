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
        .module('referencedata-facility-type-approved-product')
        .factory('FacilityTypeApprovedProductDataBuilder', FacilityTypeApprovedProductDataBuilder);

    FacilityTypeApprovedProductDataBuilder.$inject = ['FacilityTypeApprovedProduct', 'OrderableDataBuilder',
        'ProgramDataBuilder', 'FacilityTypeDataBuilder'];

    function FacilityTypeApprovedProductDataBuilder(FacilityTypeApprovedProduct, OrderableDataBuilder,
                                                    ProgramDataBuilder, FacilityTypeDataBuilder) {

        FacilityTypeApprovedProductDataBuilder.prototype.withOrderable = withOrderable;
        FacilityTypeApprovedProductDataBuilder.prototype.withFacilityType = withFacilityType;
        FacilityTypeApprovedProductDataBuilder.prototype.withProgram = withProgram;
        FacilityTypeApprovedProductDataBuilder.prototype.build = build;
        FacilityTypeApprovedProductDataBuilder.prototype.buildJson = buildJson;

        return FacilityTypeApprovedProductDataBuilder;

        function FacilityTypeApprovedProductDataBuilder() {
            FacilityTypeApprovedProductDataBuilder.instanceNumber =
                (FacilityTypeApprovedProductDataBuilder.instanceNumber || 0) + 1;

            this.id = 'facility-type-approved-product-id-' + FacilityTypeApprovedProductDataBuilder.instanceNumber;
            this.orderable = new OrderableDataBuilder().build();
            this.program = new ProgramDataBuilder().build();
            this.facilityType = new FacilityTypeDataBuilder().build();
            this.maxPeriodsOfStock = 3;
            this.minPeriodsOfStock = 1;
            this.emergencyOrderPoint = 10;
        }

        function withOrderable(orderable) {
            this.orderable = orderable;
            return this;
        }

        function withFacilityType(facilityType) {
            this.facilityType = facilityType;
            return this;
        }

        function withProgram(program) {
            this.program = program;
            return this;
        }

        function build() {
            return new FacilityTypeApprovedProduct(this.buildJson());
        }

        function buildJson() {
            return {
                id: this.id,
                orderable: this.orderable,
                program: this.program,
                facilityType: this.facilityType,
                maxPeriodsOfStock: this.maxPeriodsOfStock,
                minPeriodsOfStock: this.minPeriodsOfStock,
                emergencyOrderPoint: this.emergencyOrderPoint
            };
        }
    }
})();