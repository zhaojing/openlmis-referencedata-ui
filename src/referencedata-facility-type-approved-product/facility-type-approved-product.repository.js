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
     * @name referencedata-facility-type-approved-product.FacilityTypeApprovedProductRepository
     * 
     * @description
     * Repository for managing FTAPs used throughout the system.
     */
    angular
        .module('referencedata-facility-type-approved-product')
        .factory('FacilityTypeApprovedProductRepository', FacilityTypeApprovedProductRepository);

    FacilityTypeApprovedProductRepository.$inject = ['classExtender', 'OpenlmisRepository',
        'FacilityTypeApprovedProduct', 'FacilityTypeApprovedProductResource'];

    function FacilityTypeApprovedProductRepository(classExtender, OpenlmisRepository,
                                                   FacilityTypeApprovedProduct, FacilityTypeApprovedProductResource) {

        classExtender.extend(FacilityTypeApprovedProductRepository, OpenlmisRepository);

        return FacilityTypeApprovedProductRepository;

        /**
         * @ngdoc method
         * @methodOf referencedata-facility-type-approved-product.FacilityTypeApprovedProductRepository
         * @name FacilityTypeApprovedProductRepository
         * @constructor
         * 
         * @description
         * Creates an instance of the FacilityTypeApprovedProductRepository. 
         * If no implementation is given a default one will be used.
         * The default implementation is an instance of the FacilityTypeApprovedProductResource class.
         * 
         * @param {Object} impl the implementation to be used by the repository, 
         *                      defaults to FacilityTypeApprovedProductResource
         */
        function FacilityTypeApprovedProductRepository(impl) {
            this.super(FacilityTypeApprovedProduct, impl || new FacilityTypeApprovedProductResource());
        }
    }
})();