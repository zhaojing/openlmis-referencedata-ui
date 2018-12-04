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

describe('adminRequisitionGroupListService', function() {

    beforeEach(function() {
        var requisitionGroupPage;

        module('admin-requisition-group-list');

        inject(function($injector) {
            this.adminRequisitionGroupListService = $injector.get('adminRequisitionGroupListService');

            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');

            this.requisitionGroupService = $injector.get('requisitionGroupService');
            this.facilityService = $injector.get('facilityService');

            this.RequisitionGroupDataBuilder = $injector.get('RequisitionGroupDataBuilder');
            this.SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.expectedRequisitionGroups = [
            new this.RequisitionGroupDataBuilder().buildJson(),
            new this.RequisitionGroupDataBuilder().buildJson(),
            new this.RequisitionGroupDataBuilder().buildJson(),
            new this.RequisitionGroupDataBuilder().buildJson(),
            new this.RequisitionGroupDataBuilder().buildJson()
        ];

        this.backendRequisitionGroups = this.expectedRequisitionGroups.slice();
        requisitionGroupPage = this.PageDataBuilder.buildWithContent(this.backendRequisitionGroups);

        this.facilities = this.backendRequisitionGroups.map(function(group) {
            var facility = group.supervisoryNode.facility;

            // currently backend returns object references for fields
            // inside supervisory node resource.
            group.supervisoryNode.facility = {
                id: facility.id
            };

            return facility;
        });

        spyOn(this.requisitionGroupService, 'search').andReturn(this.$q.resolve(requisitionGroupPage));
        spyOn(this.facilityService, 'query').andReturn(this.$q.resolve(this.facilities));
    });

    describe('search', function() {

        it('should combine requisition groups with facilities by id', function() {
            var result;

            this.adminRequisitionGroupListService.search()
                .then(function(page) {
                    result = page.content;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.expectedRequisitionGroups);
        });

        it('should handle requisition groups with supervisory node without facility', function() {
            var supervisoryNode = new this.SupervisoryNodeDataBuilder().buildWithoutFacility(),
                requisitionGroup = new this.RequisitionGroupDataBuilder()
                    .withSupervisoryNode(supervisoryNode)
                    .buildJson(),
                page = this.PageDataBuilder.buildWithContent([requisitionGroup]),
                result;

            this.requisitionGroupService.search.andReturn(this.$q.resolve(page));

            this.adminRequisitionGroupListService.search()
                .then(function(page) {
                    result = page.content;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(page.content);
            expect(result[0].supervisoryNode.facility).toEqual(undefined);
        });

    });

});
