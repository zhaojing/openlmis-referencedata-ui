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
        .module('referencedata-facility-operator')
        .factory('FacilityOperatorDataBuilder', FacilityOperatorDataBuilder);

    FacilityOperatorDataBuilder.$inject = ['FacilityOperator'];

    function FacilityOperatorDataBuilder(FacilityOperator) {

        FacilityOperatorDataBuilder.prototype.build = build;

        return FacilityOperatorDataBuilder;

        function FacilityOperatorDataBuilder() {
            this.id = '9456c3e9-c4a6-4a28-9e08-47ceb16a4121';
            this.code = 'moh';
            this.name = 'Ministry of Health';
            this.description = 'description';
            this.displayOrder = 2;
        }

        function build() {
            return new FacilityOperator(
                this.id,
                this.code,
                this.name,
                this.description,
                this.displayOrder
            );
        }

    }

})();