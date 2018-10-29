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

    function SupplyPartner() {

        return SupplyPartner;

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartner
         * @name SupplyPartner
         *
         * @description
         * Creates a new instance of the SupplyPartner class.
         *
         * @param  {String} id         the UUID of the supply partner to be created
         * @param  {String} name       the name of the supply partner to be created
         * @param  {String} code       the code of the supply partner to be created
         * @return {Object}            the supply partner object
         */
        function SupplyPartner(id, name, code) {
            this.id = id;
            this.name = name;
            this.code = code;
        }
    }
})();
