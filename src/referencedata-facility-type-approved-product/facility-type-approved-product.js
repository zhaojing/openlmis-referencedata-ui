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
     * @name referencedata-facility-type-approved-product.FacilityTypeApprovedProduct
     *
     * @description
     * Represents a single FTAP.
     */
    angular
        .module('referencedata-facility-type-approved-product')
        .factory('FacilityTypeApprovedProduct', FacilityTypeApprovedProduct);

    function FacilityTypeApprovedProduct() {

        return FacilityTypeApprovedProduct;

        /**
         * @ngdoc method
         * @methodOf referencedata-facility-type-approved-product.FacilityTypeApprovedProduct
         * @name FacilityTypeApprovedProduct
         *
         * @description
         * Creates a new instance of the FacilityTypeApprovedProduct class.
         *
         * @param {Object} json the json representation of the FTAP
         */
        function FacilityTypeApprovedProduct(json) {
            this.id = json.id;
            this.orderable = json.orderable;
            this.program = json.program;
            this.facilityType = json.facilityType;
            this.maxPeriodsOfStock = json.maxPeriodsOfStock;
            this.minPeriodsOfStock = json.minPeriodsOfStock;
            this.emergencyOrderPoint = json.emergencyOrderPoint;
        }
    }
})();
