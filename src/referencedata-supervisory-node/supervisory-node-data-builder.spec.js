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
        .module('referencedata-supervisory-node')
        .factory('SupervisoryNodeDataBuilder', SupervisoryNodeDataBuilder);

    SupervisoryNodeDataBuilder.$inject = [
        'SupervisoryNode', 'FacilityDataBuilder', 'SupervisoryNodeRepository', 'ObjectReferenceDataBuilder'
    ];

    function SupervisoryNodeDataBuilder(SupervisoryNode, FacilityDataBuilder, SupervisoryNodeRepository,
                                        ObjectReferenceDataBuilder) {

        SupervisoryNodeDataBuilder.prototype.build = build;
        SupervisoryNodeDataBuilder.prototype.buildJson = buildJson;
        SupervisoryNodeDataBuilder.prototype.buildWithoutFacility = buildWithoutFacility;
        SupervisoryNodeDataBuilder.prototype.buildWithChildNodes = buildWithChildNodes;
        SupervisoryNodeDataBuilder.prototype.withChildNode = withChildNode;
        SupervisoryNodeDataBuilder.prototype.withId = withId;
        SupervisoryNodeDataBuilder.prototype.withFacility = withFacility;
        SupervisoryNodeDataBuilder.prototype.withName = withName;
        SupervisoryNodeDataBuilder.prototype.withChildNodes = withChildNodes;
        SupervisoryNodeDataBuilder.prototype.withId = withId;
        SupervisoryNodeDataBuilder.prototype.withParentNode = withParentNode;
        SupervisoryNodeDataBuilder.prototype.withPartnerNodes = withPartnerNodes;
        SupervisoryNodeDataBuilder.prototype.withPartnerNode = withPartnerNode;
        SupervisoryNodeDataBuilder.prototype.withPartnerNodeOf = withPartnerNodeOf;
        SupervisoryNodeDataBuilder.prototype.buildPartnerNode = buildPartnerNode;
        SupervisoryNodeDataBuilder.prototype.withRequisitionGroup = withRequisitionGroup;

        return SupervisoryNodeDataBuilder;

        function SupervisoryNodeDataBuilder() {
            SupervisoryNodeDataBuilder.instanceNumber = (SupervisoryNodeDataBuilder.instanceNumber || 0) + 1;

            this.id = 'node-id-' + SupervisoryNodeDataBuilder.instanceNumber;
            this.name = 'node-' + SupervisoryNodeDataBuilder.instanceNumber;
            this.code = 'SN' + SupervisoryNodeDataBuilder.instanceNumber;
            this.parentNode = undefined;
            this.facility = new FacilityDataBuilder().build();
            this.childNodes = [];
            this.description = 'Node description ' + SupervisoryNodeDataBuilder.instanceNumber;
            this.partnerNodes = [];
            this.partnerNodeOf = undefined;
            this.requisitionGroup = new ObjectReferenceDataBuilder().build();
        }

        function build() {
            return new SupervisoryNode(this.buildJson(), new SupervisoryNodeRepository());
        }

        function buildJson() {
            return {
                id: this.id,
                name: this.name,
                code: this.code,
                facility: this.facility,
                childNodes: this.childNodes,
                description: this.description,
                parentNode: this.parentNode,
                partnerNodes: this.partnerNodes,
                partnerNodeOf: this.partnerNodeOf,
                requisitionGroup: this.requisitionGroup
            };
        }

        function withPartnerNodeOf(partnerNodeOf) {
            this.partnerNodeOf = partnerNodeOf || new SupervisoryNodeDataBuilder().build();
            return this;
        }

        function buildPartnerNode() {
            return this
                .withPartnerNodeOf()
                .build();
        }

        function buildWithoutFacility() {
            return this.withFacility().build();
        }

        function buildWithChildNodes() {
            return this.withChildNodes().build();
        }

        function withChildNode(node) {
            this.childNodes.push(node);
            return this;
        }

        function withPartnerNode(node) {
            this.partnerNodes.push(node);
            return this;
        }

        function withId(newId) {
            this.id = newId;
            return this;
        }

        function withFacility(facility) {
            this.facility = facility;
            return this;
        }

        function withName(name) {
            this.name = name;
            return this;
        }

        function withChildNodes() {
            return this
                .withChildNode(new SupervisoryNodeDataBuilder().build())
                .withChildNode(new SupervisoryNodeDataBuilder().build());
        }

        function withPartnerNodes() {
            return this
                .withPartnerNode(new SupervisoryNodeDataBuilder().build())
                .withPartnerNode(new SupervisoryNodeDataBuilder().build());
        }

        function withParentNode(parentNode) {
            this.parentNode = parentNode || new SupervisoryNodeDataBuilder().build();
            return this;
        }

        function withRequisitionGroup(requisitionGroup) {
            this.requisitionGroup = requisitionGroup;
            return this;
        }
    }
})();
