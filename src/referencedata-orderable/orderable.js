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
     * @name referencedata-orderable.Orderable
     *
     * @description
     * Represents a single orderable.
     */
    angular
        .module('referencedata-orderable')
        .factory('Orderable', Orderable);

    function Orderable() {

        return Orderable;

        /**
         * @ngdoc method
         * @methodOf referencedata-orderable.Orderable
         * @name Orderable
         *
         * @description
         * Creates a new instance of the Orderable class.
         *
         * @param  {String}  id                                     the UUID of the orderable to be created
         * @param  {String}  productCode                            the code of the orderable to be created
         * @param  {String}  fullProductName                        the name of the orderable to be created
         * @param  {Object}  dispensable                            the dispensable of the orderable to be created
         * @param  {Object}  extraData                              the extra data
         * @return {Orderable}                                      the orderable object
         */
        function Orderable(id, productCode, fullProductName, dispensable, extraData) {
            this.id = id;
            this.productCode = productCode;
            this.fullProductName = fullProductName;
            this.dispensable = dispensable;
            this.extraData = extraData;
        }

    }

})();
