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
        .module('referencedata-orderable')
        .factory('OrderableDataBuilder', OrderableDataBuilder);

    OrderableDataBuilder.$inject = ['Orderable'];

    function OrderableDataBuilder(Orderable) {

        OrderableDataBuilder.prototype.withFullProductName = withFullProductName;
        OrderableDataBuilder.prototype.withId = withId;
        OrderableDataBuilder.prototype.build = build;

        return OrderableDataBuilder;

        function OrderableDataBuilder() {
            OrderableDataBuilder.instanceNumber = (OrderableDataBuilder.instanceNumber || 0) + 1;

            this.id = 'orderable-id-' + OrderableDataBuilder.instanceNumber;
            this.productCode = 'C' + OrderableDataBuilder.instanceNumber;
            this.fullProductName = 'Acetylsalicylic Acid';
            this.dispensable = {
              dispensingUnit: ""
            };
        }

        function withFullProductName(fullProductName) {
            this.fullProductName = fullProductName;
            return this;
        }

        function withId(id) {
            this.id = id;
            return this;
        }

        function build() {
            return new Orderable(
                this.id,
                this.productCode,
                this.fullProductName,
                this.dispensable
            );
        }

    }

})();
