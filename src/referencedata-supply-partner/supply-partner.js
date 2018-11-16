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
     * @name referencedata-supply-partner.SupplyPartner
     *
     * @description
     * Represents a single supply partner.
     */
    angular
        .module('referencedata-supply-partner')
        .factory('SupplyPartner', SupplyPartner);

    SupplyPartner.$inject = [];

    function SupplyPartner() {

        SupplyPartner.prototype.create = create;

        return SupplyPartner;

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartner
         * @name SupplyPartner
         * @constructor
         * 
         * @description
         * Creates an instance of the SupplyPartner class.
         * 
         * @param {Object}                  json       the JSON representation of the supply partner
         * @param {SupplyPartnerRepository} repository the instance of the SupplyPartnerRepository class
         */
        function SupplyPartner(json, repository) {
            angular.copy(json, this);
            this.repository = repository;

            if (json.associations) {
                this.associations = json.associations.map(function(associationJson) {
                    return {
                        program: associationJson.program,
                        supervisoryNode: associationJson.supervisoryNode,
                        facilities: associationJson.facilities,
                        orderables: associationJson.orderables
                    };
                });
            } else {
                this.associations = [];
            }
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartner
         * @name save
         * 
         * @description
         * Creates this supply partner in the the repository.
         * 
         * @return {Promise}  the promise resolved when updating is successful, rejected otherwise
         */
        function create() {
            return this.repository.create(this);
        }
    }
})();
