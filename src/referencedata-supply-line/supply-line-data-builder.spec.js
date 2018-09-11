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
        .module('referencedata-supply-line')
        .factory('SupplyLineDataBuilder', SupplyLineDataBuilder);

    SupplyLineDataBuilder.$inject = ['SupervisoryNodeDataBuilder', 'FacilityDataBuilder',
        'ProgramDataBuilder'];

    function SupplyLineDataBuilder(SupervisoryNodeDataBuilder, FacilityDataBuilder,
                                   ProgramDataBuilder) {

        SupplyLineDataBuilder.prototype.buildJson = buildJson;

        return SupplyLineDataBuilder;

        function SupplyLineDataBuilder() {
            SupplyLineDataBuilder.instanceNumber = (SupplyLineDataBuilder.instanceNumber || 0) + 1;

            this.id = 'supply-line-id-' + SupplyLineDataBuilder.instanceNumber;
            this.supervisoryNode = new SupervisoryNodeDataBuilder().build();
            this.description = 'description';
            this.facility = new FacilityDataBuilder().build();
            this.program = new ProgramDataBuilder().build();
        }

        function buildJson() {
            return {
                id: this.id,
                supervisoryNode: this.supervisoryNode,
                description: this.description,
                facility: this.facility,
                program: this.program
            };
        }
    }
})();
