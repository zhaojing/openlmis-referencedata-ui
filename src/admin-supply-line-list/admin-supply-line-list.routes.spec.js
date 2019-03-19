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
            this.FacilityRepository = $injector.get('FacilityRepository');
            this.programService = $injector.get('programService');
            this.SupplyLineResource = $injector.get('SupplyLineResource');
            this.SupplyLineResourceV2 = $injector.get('SupplyLineResourceV2');
            this.RequisitionGroupResource = $injector.get('RequisitionGroupResource');
            this.FeatureFlagService = $injector.get('FeatureFlagService');
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

        this.supplyLinesV2 = [
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

        this.supplyLinesPageV2 = new PageDataBuilder()
            .withContent(this.supplyLinesV2)
            .build();

        this.goToUrl = goToUrl;
        this.getResolvedValue = getResolvedValue;

        spyOn(this.FacilityRepository.prototype, 'query').andReturn(this.$q.resolve(this.facilitiesPage));
        spyOn(this.programService, 'getAll').andReturn(this.$q.resolve(this.programs));
        spyOn(this.SupplyLineResource.prototype, 'query').andReturn(this.$q.resolve(this.supplyLinesPage));
        spyOn(this.SupplyLineResourceV2.prototype, 'query').andReturn(this.$q.resolve(this.supplyLinesPageV2));
        spyOn(this.RequisitionGroupResource.prototype, 'query').andReturn(this.$q.resolve(this.requisitionGroups));
        spyOn(this.FeatureFlagService.prototype, 'isEnabled').andReturn(this.$q.resolve(false));
    });

    it('should be available under "/profile" URI', function() {
        expect(this.$state.current.name).not.toEqual('openlmis.administration.supplyLines');

        this.goToUrl('/administration/supplyLines');

        expect(this.$state.current.name).toEqual('openlmis.administration.supplyLines');
    });

    it('should retrieve supply line expand feature flag', function() {
        this.goToUrl('/administration/supplyLines');

        expect(this.getResolvedValue('supplyLineExpandEnabled')).toEqual(false);
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

    it('should retrieve supply lines v2 if flag is enabled', function() {
        this.FeatureFlagService.prototype.isEnabled.andReturn(this.$q.resolve(true));

        this.goToUrl('/administration/supplyLines');

        expect(this.SupplyLineResourceV2.prototype.query).toHaveBeenCalledWith({
            supplyingFacilityId: undefined,
            programId: undefined,
            page: 0,
            size: 10,
            sort: 'supplyingFacility.name',
            expand: [
                'supervisoryNode.requisitionGroup.memberFacilities',
                'supplyingFacility',
                'program'
            ]
        });

        expect(this.getResolvedValue('supplyLines')).toEqual(this.supplyLinesV2);
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

    it('should get empty requisition group map if there is no assigned', function() {
        this.supplyLines[0].supervisoryNode.requisitionGroup = undefined;
        this.supplyLines[1].supervisoryNode.requisitionGroup = undefined;

        var expected = {};

        this.goToUrl('/administration/supplyLines');

        expect(this.RequisitionGroupResource.prototype.query).not.toHaveBeenCalled();
        expect(this.getResolvedValue('requisitionGroupsMap')).toEqual(expected);
    });

    it('should get empty requisition group map if supply line feature is enabled', function() {
        this.FeatureFlagService.prototype.isEnabled.andReturn(this.$q.resolve(true));

        this.goToUrl('/administration/supplyLines');

        expect(this.getResolvedValue('requisitionGroupsMap')).toEqual({});
    });

    it('should not change state when fetching supplying facilities fails', function() {
        this.FacilityRepository.prototype.query.andReturn(this.$q.reject());

        expect(this.$state.current.name).not.toEqual('openlmis.administration.supplyLines');
    });

    it('should not change state when fetching programs fails ', function() {
        this.programService.getAll.andReturn(this.$q.reject());

        expect(this.$state.current.name).not.toEqual('openlmis.administration.supplyLines');
    });

    it('should not change state when fetching supply lines fails', function() {
        this.SupplyLineResource.prototype.query.andReturn(this.$q.reject());

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