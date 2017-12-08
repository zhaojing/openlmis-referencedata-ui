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
        .module('referencedata-program')
        .factory('ProgramDataBuilder', ProgramDataBuilder);

    ProgramDataBuilder.$inject = ['Program'];

    function ProgramDataBuilder(Program) {

        ProgramDataBuilder.prototype.build = build;

        return ProgramDataBuilder;

        function ProgramDataBuilder() {
            ProgramDataBuilder.instanceNumber = (ProgramDataBuilder.instanceNumber || 0) + 1;

            this.id = 'program-id-' + ProgramDataBuilder.instanceNumber;
            this.code = 'PRG' + ProgramDataBuilder.instanceNumber;
            this.name = 'EPI';
            this.description = 'description';
            this.active = true;
            this.periodsSkippable = true;
            this.skipAuthorization = false;
            this.showNonFullSupplyTab = false;
            this.enableDatePhysicalStockCountCompleted = false;
        }

        function build() {
            return new Program(
                this.id,
                this.code,
                this.name,
                this.description,
                this.active,
                this.periodsSkippable,
                this.skipAuthorization,
                this.showNonFullSupplyTab,
                this.enableDatePhysicalStockCountCompleted
            );
        }

    }

})();
