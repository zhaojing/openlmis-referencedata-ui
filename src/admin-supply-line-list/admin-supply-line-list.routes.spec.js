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

describe('openlmis.administration.supplyLine', function() {

    beforeEach(function() {
        module('admin-supply-line-list');

        var FacilityDataBuilder, ProgramDataBuilder, SupplyLineDataBuilder, RequisitionGroupDataBuilder,
            PageDataBuilder;
        inject(function($injector) {
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            SupplyLineDataBuilder = $injector.get('SupplyLineDataBuilder');
            RequisitionGroupDataBuilder = $injector.get('RequisitionGroupDataBuilder');
            PageDataBuilder = $injector.get('PageDataBuilder');

            this.$location = $injector.get('$location');
            this.$rootScope = $injector.get('$rootScope');
            this.$state = $injector.get('$state');
            this.$q = $injector.get('$q');
            this.facilityService = $injector.get('facilityService');
            this.programService = $injector.get('programService');
            this.supplyLineService = $injector.get('supplyLineService');
            this.RequisitionGroupResource = $injector.get('RequisitionGroupResource');
        });

        this.facilities = [
            new FacilityDataBuilder().build(),
            new FacilityDataBuilder().build()
        ];

        this.programs = [
            new ProgramDataBuilder().build(),
            new ProgramDataBuilder().build()
        ];

        this.supplyLines = [
            new SupplyLineDataBuilder().buildJson(),
            new SupplyLineDataBuilder().buildJson()
        ];

        this.requisitionGroups = [
            new RequisitionGroupDataBuilder().buildJson(),
            new RequisitionGroupDataBuilder().buildJson()
        ];

        this.facilitiesPage = new PageDataBuilder()
            .withContent(this.facilities)
            .build();

        this.supplyLinesPage = new PageDataBuilder()
            .withContent(this.supplyLines)
            .build();

        this.goToUrl = goToUrl;
        this.getResolvedValue = getResolvedValue;

        spyOn(this.facilityService, 'search').andReturn(this.$q.resolve(this.facilitiesPage));
        spyOn(this.programService, 'getAll').andReturn(this.$q.resolve(this.programs));
        spyOn(this.supplyLineService, 'search').andReturn(this.$q.resolve(this.supplyLinesPage));
        spyOn(this.RequisitionGroupResource.prototype, 'query').andReturn(this.$q.resolve(this.requisitionGroups));
    });

    it('should be available under "/profile" URI', function() {
        expect(this.$state.current.name).not.toEqual('openlmis.administration.supplyLines');

        this.goToUrl('/administration/supplyLines');

        expect(this.$state.current.name).toEqual('openlmis.administration.supplyLines');
    });

    it('should retrieve related supplying facilities', function() {
        this.goToUrl('/administration/supplyLines');

        expect(this.getResolvedValue('supplyingFacilities')).toEqual(this.facilities);
    });

    it('should retrieve related programs', function() {
        this.goToUrl('/administration/supplyLines');

        expect(this.getResolvedValue('programs')).toEqual(this.programs);
    });

    it('should retrieve supply lines', function() {
        this.goToUrl('/administration/supplyLines');

        expect(this.getResolvedValue('supplyLines')).toEqual(this.supplyLines);
    });

    it('should retrieve related requisition groups', function() {
        this.goToUrl('/administration/supplyLines');

        var expected = {};
        expected[this.requisitionGroups[0].id] = this.requisitionGroups[0];
        expected[this.requisitionGroups[1].id] = this.requisitionGroups[1];

        expect(this.getResolvedValue('requisitionGroupsMap')).toEqual(expected);
    });

    it('should get requisition groups only if supply line has requisition group', function() {
        this.supplyLines[0].supervisoryNode.requisitionGroup = undefined;

        var expected = {};
        expected[this.requisitionGroups[0].id] = this.requisitionGroups[0];
        expected[this.requisitionGroups[1].id] = this.requisitionGroups[1];

        this.goToUrl('/administration/supplyLines');

        var requisitionGroupdId = this.supplyLines[1].supervisoryNode.requisitionGroup.id;

        expect(this.RequisitionGroupResource.prototype.query).toHaveBeenCalledWith({
            id: [requisitionGroupdId]
        });

        expect(this.getResolvedValue('requisitionGroupsMap')).toEqual(expected);
    });

    it('should get empty object if there is no requisition group assigned', function() {
        this.supplyLines[0].supervisoryNode.requisitionGroup = undefined;
        this.supplyLines[1].supervisoryNode.requisitionGroup = undefined;

        var expected = {};

        this.goToUrl('/administration/supplyLines');

        expect(this.RequisitionGroupResource.prototype.query).not.toHaveBeenCalled();
        expect(this.getResolvedValue('requisitionGroupsMap')).toEqual(expected);
    });

    it('should not change state when fetching supplying facilities fails', function() {
        this.facilityService.search.andReturn(this.$q.reject());

        expect(this.$state.current.name).not.toEqual('openlmis.administration.supplyLines');
    });

    it('should not change state when fetching programs fails ', function() {
        this.programService.getAll.andReturn(this.$q.reject());

        expect(this.$state.current.name).not.toEqual('openlmis.administration.supplyLines');
    });

    it('should not change state when fetching supply lines fails', function() {
        this.supplyLineService.search.andReturn(this.$q.reject());

        expect(this.$state.current.name).not.toEqual('openlmis.administration.supplyLines');
    });

    it('should not change state when fetching requisition group fails', function() {
        this.RequisitionGroupResource.prototype.query.andReturn(this.$q.reject());

        expect(this.$state.current.name).not.toEqual('openlmis.administration.supplyLines');
    });

    function goToUrl(url) {
        this.$location.url(url);
        this.$rootScope.$apply();
    }

    function getResolvedValue(name) {
        return this.$state.$current.locals.globals[name];
    }

});