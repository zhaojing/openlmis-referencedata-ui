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

describe('FacilityTypeApprovedProduct', function() {

    beforeEach(function() {
        module('referencedata-facility-type-approved-product');

        inject(function($injector) {
            this.FacilityTypeApprovedProduct = $injector.get('FacilityTypeApprovedProduct');
            this.FacilityTypeApprovedProductDataBuilder = $injector.get('FacilityTypeApprovedProductDataBuilder');
        });
    });

    describe('constructor', function() {

        beforeEach(function() {
            this.facilityTypeApprovedProductJson = new this.FacilityTypeApprovedProductDataBuilder().buildJson();
            this.facilityTypeApprovedProduct =
                new this.FacilityTypeApprovedProduct(this.facilityTypeApprovedProductJson);
        });

        it('should set id', function() {
            expect(this.facilityTypeApprovedProduct.id).toBe(this.facilityTypeApprovedProductJson.id);
        });

        it('should set orderable', function() {
            expect(this.facilityTypeApprovedProduct.orderable).toBe(this.facilityTypeApprovedProductJson.orderable);
        });

        it('should set program', function() {
            expect(this.facilityTypeApprovedProduct.program).toBe(this.facilityTypeApprovedProductJson.program);
        });

        it('should set facilityType', function() {
            expect(this.facilityTypeApprovedProduct.facilityType)
                .toBe(this.facilityTypeApprovedProductJson.facilityType);
        });

        it('should set maxPeriodsOfStock', function() {
            expect(this.facilityTypeApprovedProduct.maxPeriodsOfStock)
                .toBe(this.facilityTypeApprovedProductJson.maxPeriodsOfStock);
        });

        it('should set minPeriodsOfStock', function() {
            expect(this.facilityTypeApprovedProduct.minPeriodsOfStock)
                .toBe(this.facilityTypeApprovedProductJson.minPeriodsOfStock);
        });

        it('should set emergencyOrderPoint', function() {
            expect(this.facilityTypeApprovedProduct.emergencyOrderPoint)
                .toBe(this.facilityTypeApprovedProductJson.emergencyOrderPoint);
        });

        it('should deactivate', function() {
            this.facilityTypeApprovedProduct.deactivate();

            expect(this.facilityTypeApprovedProduct.active).toBe(false);
        });
    });

});