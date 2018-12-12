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

describe('openlmis.administration.requisitionGroupList', function() {

    beforeEach(function() {
        module('admin-requisition-group-list');

        var ProgramDataBuilder, GeographicZoneDataBuilder, RequisitionGroupDataBuilder,
            PageDataBuilder, ObjectMapper;

        inject(function($injector) {
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            GeographicZoneDataBuilder = $injector.get('GeographicZoneDataBuilder');
            RequisitionGroupDataBuilder = $injector.get('RequisitionGroupDataBuilder');
            PageDataBuilder = $injector.get('PageDataBuilder');
            ObjectMapper = $injector.get('ObjectMapper');

            this.$q = $injector.get('$q');
            this.$location = $injector.get('$location');
            this.$rootScope = $injector.get('$rootScope');
            this.geographicZoneService = $injector.get('geographicZoneService');
            this.programService = $injector.get('programService');
            this.paginationService = $injector.get('paginationService');
            this.requisitionGroupService = $injector.get('requisitionGroupService');
            this.FacilityResource = $injector.get('FacilityResource');
            this.$state = $injector.get('$state');
            this.$templateCache = $injector.get('$templateCache');
        });

        this.programs = [
            new ProgramDataBuilder().build(),
            new ProgramDataBuilder().build()
        ];

        this.geographicZones = [
            new GeographicZoneDataBuilder().build(),
            new GeographicZoneDataBuilder().build()
        ];

        this.requisitionGroups = [
            new RequisitionGroupDataBuilder()
                .buildJson(),
            new RequisitionGroupDataBuilder()
                .withoutSupervisoryNodeFacility()
                .buildJson(),
            new RequisitionGroupDataBuilder()
                .withoutSupervisoryNode()
                .buildJson()
        ];

        this.facilities = [
            this.requisitionGroups[0].supervisoryNode.facility
        ];

        this.objectMapper = new ObjectMapper();

        spyOn(this.requisitionGroupService, 'search')
            .andReturn(this.$q.resolve(new PageDataBuilder()
                .withContent(this.requisitionGroups)
                .build()));
        spyOn(this.programService, 'getAll').andReturn(this.$q.resolve(this.programs));
        spyOn(this.geographicZoneService, 'getAll')
            .andReturn(this.$q.resolve(new PageDataBuilder()
                .withContent(this.geographicZones)
                .build()));
        spyOn(this.FacilityResource.prototype, 'query').andReturn(this.$q.resolve(this.facilities));
        spyOn(this.$templateCache, 'get').andCallThrough();

        this.goToUrl = goToUrl;
        this.getResolvedValue = getResolvedValue;
    });

    describe('state', function() {

        it('should be available under "/administration/requisitionGroups" URI', function() {
            expect(this.$state.current.name).not.toEqual('openlmis.administration.requisitionGroupList');

            this.goToUrl('/administration/requisitionGroups');

            expect(this.$state.current.name).toEqual('openlmis.administration.requisitionGroupList');
        });

        it('should use template', function() {
            this.goToUrl('/administration/requisitionGroups');

            expect(this.$templateCache.get)
                .toHaveBeenCalledWith('admin-requisition-group-list/requisition-group-list.html');
        });

        it('should resolve geographicZones', function() {
            this.goToUrl('/administration/requisitionGroups');

            expect(this.getResolvedValue('geographicZones')).toEqual(this.geographicZones);
            expect(this.geographicZoneService.getAll).toHaveBeenCalled();
        });

        it('should resolve programs', function() {
            this.goToUrl('/administration/requisitionGroups');

            expect(this.getResolvedValue('programs')).toEqual(this.programs);
            expect(this.programService.getAll).toHaveBeenCalled();
        });

        it('should resolve facilitiesMap', function() {
            var facilitiesMap = this.objectMapper.map(this.facilities);

            this.goToUrl('/administration/requisitionGroups');

            expect(this.getResolvedValue('facilitiesMap')).toEqual(facilitiesMap);
            expect(this.FacilityResource.prototype.query).toHaveBeenCalledWith({
                id: [this.facilities[0].id],
                page: 0,
                size: 1
            });
        });
    });

    function goToUrl(url) {
        this.$location.url(url);
        this.$rootScope.$apply();
    }

    function getResolvedValue(name) {
        return this.$state.$current.locals.globals[name];
    }

});
