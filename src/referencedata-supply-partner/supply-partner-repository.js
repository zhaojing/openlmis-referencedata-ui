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
     * @name referencedata-supply-partner.SupplyPartnerRepository
     *
     * @description
     * Interface for managing supply partners.
     */
    angular
        .module('referencedata-supply-partner')
        .factory('SupplyPartnerRepository', SupplyPartnerRepository);

    SupplyPartnerRepository.inject = [
        'SupplyPartner', 'OpenlmisRepository', 'classExtender', 'SupplyPartnerRepositoryImpl'
    ];

    function SupplyPartnerRepository(SupplyPartner, OpenlmisRepository, classExtender, SupplyPartnerRepositoryImpl) {

        classExtender.extend(SupplyPartnerRepository, OpenlmisRepository);

        return SupplyPartnerRepository;

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartnerRepository
         * @name SupplyPartnerRepository
         * @constructor
         * 
         * @description
         * Creates an object of the SupplyPartnerRepository class. It no implementation is provided it
         * will use an instance of the SupplyPartnerRepositoryImpl class by default.
         */
        function SupplyPartnerRepository(impl) {
            this.super(SupplyPartner, impl || new SupplyPartnerRepositoryImpl());
        }
    }

})();