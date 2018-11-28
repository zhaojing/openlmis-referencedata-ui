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
        .module('referencedata-supply-partner')
        .factory('SupplyPartnerAssociationDataBuilder', SupplyPartnerAssociationDataBuilder);

    SupplyPartnerAssociationDataBuilder.$inject = ['ObjectReferenceDataBuilder'];

    function SupplyPartnerAssociationDataBuilder(ObjectReferenceDataBuilder) {

        SupplyPartnerAssociationDataBuilder.prototype.withProgram = withProgram;
        SupplyPartnerAssociationDataBuilder.prototype.withSupervisoryNode = withSupervisoryNode;
        SupplyPartnerAssociationDataBuilder.prototype.withoutProgram = withoutProgram;
        SupplyPartnerAssociationDataBuilder.prototype.withoutSupervisoryNode = withoutSupervisoryNode;
        SupplyPartnerAssociationDataBuilder.prototype.addFacility = addFacility;
        SupplyPartnerAssociationDataBuilder.prototype.addOrderable = addOrderable;
        SupplyPartnerAssociationDataBuilder.prototype.build = build;
        SupplyPartnerAssociationDataBuilder.prototype.buildAsNew = buildAsNew;
        SupplyPartnerAssociationDataBuilder.prototype.withoutId = withoutId;
        SupplyPartnerAssociationDataBuilder.prototype.buildWithFacilitiesAndOrderables =
            buildWithFacilitiesAndOrderables;
        SupplyPartnerAssociationDataBuilder.prototype.buildCleanNew = buildCleanNew;
        SupplyPartnerAssociationDataBuilder.prototype.buildJson = buildJson;

        return SupplyPartnerAssociationDataBuilder;

        function SupplyPartnerAssociationDataBuilder() {
            SupplyPartnerAssociationDataBuilder.instanceNumber =
                (SupplyPartnerAssociationDataBuilder.instanceNumber || 0) + 1;

            this.id = 'partner-association-id-' + SupplyPartnerAssociationDataBuilder.instanceNumber;
            this.program = new ObjectReferenceDataBuilder()
                .withResource('program')
                .build();
            this.supervisoryNode = new ObjectReferenceDataBuilder()
                .withResource('supervisoryNode')
                .build();
            this.facilities = [];
            this.orderables = [];
        }

        function withProgram(program) {
            this.program = program;
            return this;
        }

        function withSupervisoryNode(supervisoryNode) {
            this.supervisoryNode = supervisoryNode;
            return this;
        }

        function withoutProgram() {
            return this.withProgram(undefined);
        }

        function withoutSupervisoryNode() {
            return this.withSupervisoryNode(undefined);
        }

        function addFacility(facility) {
            this.facilities.push(facility);
            return this;
        }

        function addOrderable(orderable) {
            this.orderables.push(orderable);
            return this;
        }

        function withoutId() {
            this.id = undefined;
            return this;
        }

        function build() {
            return this.buildJson();
        }

        function buildWithFacilitiesAndOrderables() {
            return this
                .addFacility(new ObjectReferenceDataBuilder().withResource('facility')
                    .build())
                .addFacility(new ObjectReferenceDataBuilder().withResource('facility')
                    .build())
                .addOrderable(new ObjectReferenceDataBuilder().withResource('orderable')
                    .build())
                .addOrderable(new ObjectReferenceDataBuilder().withResource('orderable')
                    .build())
                .build();
        }

        function buildCleanNew() {
            return this
                .withoutProgram()
                .withSupervisoryNode()
                .build();
        }

        function buildAsNew() {
            return this
                .withoutId()
                .build();
        }

        function buildJson() {
            return {
                id: this.id,
                program: this.program,
                supervisoryNode: this.supervisoryNode,
                facilities: this.facilities,
                orderables: this.orderables
            };
        }
    }
})();
