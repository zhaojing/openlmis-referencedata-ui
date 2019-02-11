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

describe('SupplyLineListController', function() {

    beforeEach(function() {
        module('admin-supply-line-list');
        module('referencedata-requisition-group');
        module('referencedata-supply-line');

        var FacilityDataBuilder, SupplyLineDataBuilder, ProgramDataBuilder, $controller, RequisitionGroupDataBuilder;
        inject(function($injector) {
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            SupplyLineDataBuilder = $injector.get('SupplyLineDataBuilder');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            $controller = $injector.get('$controller');
            RequisitionGroupDataBuilder = $injector.get('RequisitionGroupDataBuilder');

            this.$state = $injector.get('$state');
        });

        this.supplyingFacilities = [
            new FacilityDataBuilder().build(),
            new FacilityDataBuilder().build()
        ];
        this.supplyLines = [
            new SupplyLineDataBuilder().buildJson(),
            new SupplyLineDataBuilder().buildJson()
        ];
        this.programs = [
            new ProgramDataBuilder().build(),
            new ProgramDataBuilder().build()
        ];
        this.requisitionGroups = [
            new RequisitionGroupDataBuilder().buildJson(),
            new RequisitionGroupDataBuilder().buildJson()
        ];

        this.requisitionGroupsMap = {};
        this.requisitionGroupsMap[this.requisitionGroups[0].id] = this.requisitionGroups[0];
        this.requisitionGroupsMap[this.requisitionGroups[1].id] = this.requisitionGroups[1];

        this.stateParams = {
            page: 0,
            size: 10,
            supplyingFacilityId: this.supplyingFacilities[0].id,
            programId: this.programs[0].id
        };

        this.vm = $controller('SupplyLineListController', {
            supplyLines: this.supplyLines,
            supplyingFacilities: this.supplyingFacilities,
            programs: this.programs,
            requisitionGroupsMap: this.requisitionGroupsMap,
            $stateParams: this.stateParams
        });
        this.vm.$onInit();

        spyOn(this.$state, 'go').andReturn();
    });

    describe('onInit', function() {

        it('should expose search method', function() {
            expect(angular.isFunction(this.vm.search)).toBe(true);
        });

        it('should expose filtered supply lines array', function() {
            expect(this.vm.supplyLines).toEqual(this.supplyLines);
        });

        it('should expose supplying facilities array', function() {
            expect(this.vm.supplyingFacilities).toEqual(this.supplyingFacilities);
        });

        it('should expose supplying facility id', function() {
            expect(this.vm.supplyingFacilityId).toEqual(this.stateParams.supplyingFacilityId);
        });

        it('should expose programs array', function() {
            expect(this.vm.programs).toEqual(this.programs);
        });

        it('should expose program id', function() {
            expect(this.vm.programId).toEqual(this.stateParams.programId);
        });

        it('should expose a map of requisition groups', function() {
            expect(this.vm.requisitionGroupsMap).toEqual(this.requisitionGroupsMap);
        });
    });

    describe('search', function() {

        it('should search by supplying facility', function() {
            this.vm.supplyingFacilityId = 'facility-id';
            this.vm.programId = undefined;

            this.vm.search();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.supplyLines', {
                page: this.stateParams.page,
                size: this.stateParams.size,
                supplyingFacilityId: this.vm.supplyingFacilityId
            }, {
                reload: true
            });
        });

        it('should search by program', function() {
            this.vm.programId = 'program-id';
            this.vm.supplyingFacilityId = undefined;

            this.vm.search();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.supplyLines', {
                page: this.stateParams.page,
                size: this.stateParams.size,
                programId: this.vm.programId
            }, {
                reload: true
            });
        });

        it('should call state go method', function() {
            this.vm.search();

            expect(this.$state.go).toHaveBeenCalled();
        });
    });
});
