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
        .factory('ProgramOrderableDataBuilder', ProgramOrderableDataBuilder);

    ProgramOrderableDataBuilder.$inject = [];

    function ProgramOrderableDataBuilder() {

        ProgramOrderableDataBuilder.prototype.withFullSupply = withFullSupply;
        ProgramOrderableDataBuilder.prototype.withPricePerPack = withPricePerPack;
        ProgramOrderableDataBuilder.prototype.withProgramId = withProgramId;
        ProgramOrderableDataBuilder.prototype.withOrderableCategoryDisplayOrder = withOrderableCategoryDisplayOrder;
        ProgramOrderableDataBuilder.prototype.withOrderableCategoryDisplayName = withOrderableCategoryDisplayName;
        ProgramOrderableDataBuilder.prototype.withOrderableDisplayCategoryId = withOrderableDisplayCategoryId;
        ProgramOrderableDataBuilder.prototype.buildJson = buildJson;

        return ProgramOrderableDataBuilder;

        function ProgramOrderableDataBuilder() {
            ProgramOrderableDataBuilder.instanceNumber = (ProgramOrderableDataBuilder.instanceNumber || 0) + 1;

            this.programId = 'program-id-' + ProgramOrderableDataBuilder.instanceNumber;
            this.orderableDisplayCategoryId = 'orderable-display-category-id-' +
                ProgramOrderableDataBuilder.instanceNumber;
            this.orderableCategoryDisplayName = 'Category ' + ProgramOrderableDataBuilder.instanceNumber;
            this.orderableCategoryDisplayOrder = 2;
            this.fullSupply = false;
            this.displayOrder = 6;
            this.pricePerPack = 4.34;
        }

        function withFullSupply() {
            this.fullSupply = true;
            return this;
        }

        function withPricePerPack(pricePerPack) {
            this.pricePerPack = pricePerPack;
            return this;
        }

        function withProgramId(programId) {
            this.programId = programId;
            return this;
        }

        function withOrderableCategoryDisplayOrder(displayOrder) {
            this.orderableCategoryDisplayOrder = displayOrder;
            return this;
        }

        function withOrderableCategoryDisplayName(name) {
            this.orderableCategoryDisplayName = name;
            return this;
        }

        function withOrderableDisplayCategoryId(categoryId) {
            this.orderableDisplayCategoryId = categoryId;
            return this;
        }

        function buildJson() {
            return {
                programId: this.programId,
                orderableDisplayCategoryId: this.orderableDisplayCategoryId,
                orderableCategoryDisplayName: this.orderableCategoryDisplayName,
                orderableCategoryDisplayOrder: this.orderableCategoryDisplayOrder,
                fullSupply: this.fullSupply,
                displayOrder: this.displayOrder,
                pricePerPack: this.pricePerPack
            };
        }

    }

})();
