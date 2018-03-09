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
     * @name referencedata-lot.Lot
     *
     * @description
     * Represents a single lot.
     */
    angular
        .module('referencedata-lot')
        .factory('Lot', Lot);

    function Lot() {

        return Lot;

        /**
         * @ngdoc method
         * @methodOf referencedata-lot.Lot
         * @name Lot
         *
         * @description
         * Creates a new instance of the Lot class.
         *
         * @param  {String}  id                 the id
         * @param  {String}  lotCode            the lot code
         * @param  {String}  expirationDate     the expiration date
         * @param  {String}  manufactureDate    the manufacture date
         * @param  {Object}  tradeItemId        the id of trade item
         * @param  {Boolean} active             true if active; otherwise false
         * @return {Lot}                        the lot object
         */
        function Lot(id, lotCode, expirationDate, manufactureDate, tradeItemId, active) {
            this.id = id;
            this.lotCode = lotCode;
            this.expirationDate = expirationDate;
            this.manufactureDate = manufactureDate;
            this.tradeItemId = tradeItemId;
            this.active = active;
        }

    }

})();
