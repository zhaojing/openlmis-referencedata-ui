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

describe('SupplyLineListController', function () {

    var $state, $controller, vm, supplyLines, stateParams, supplyingFacilities, FacilityDataBuilder,
        SupplyLineDataBuilder, ProgramDataBuilder, programs;

    beforeEach(function() {
        module('admin-supply-line-list');
        module('referencedata-supply-line');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            SupplyLineDataBuilder = $injector.get('SupplyLineDataBuilder');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
        });

        supplyingFacilities = [
            new FacilityDataBuilder().build(),
            new FacilityDataBuilder().build()
        ];
        supplyLines = [
            new SupplyLineDataBuilder().buildJson(),
            new SupplyLineDataBuilder().buildJson()
        ];
        programs = [
            new ProgramDataBuilder().build(),
            new ProgramDataBuilder().build()
        ];
        stateParams = {
            page: 0,
            size: 10,
            supplyingFacility: supplyingFacilities[0].code,
            program: programs[0].code
        };

        vm = $controller('SupplyLineListController', {
            supplyLines: supplyLines,
            supplyingFacilities: supplyingFacilities,
            programs: programs,
            $stateParams: stateParams
        });
        vm.$onInit();

        spyOn($state, 'go').andReturn();
    });

    describe('onInit', function() {

        it('should expose search method', function() {
            expect(angular.isFunction(vm.search)).toBe(true);
        });

        it('should expose filtered supply lines array', function() {
            expect(vm.supplyLines).toEqual(supplyLines);
        });

        it('should expose supplying facilities array', function() {
            expect(vm.supplyingFacilities).toEqual(supplyingFacilities);
        });

        it('should expose supplying facility', function() {
            expect(vm.supplyingFacility).toEqual(stateParams.supplyingFacility);
        });

        it('should expose programs array', function() {
            expect(vm.programs).toEqual(programs);
        });

        it('should expose program', function() {
            expect(vm.program).toEqual(stateParams.program);
        });
    });

    describe('search', function() {

        it('should search by supplying facility', function() {
            vm.supplyingFacility = 'facility-code';
            vm.program = undefined;

            vm.search();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.supplyLines', {
                page: stateParams.page,
                size: stateParams.size,
                supplyingFacility: vm.supplyingFacility
            }, {reload: true});
        });

        it('should search by program', function() {
            vm.program = 'program-code';
            vm.supplyingFacility = undefined;

            vm.search();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.supplyLines', {
                page: stateParams.page,
                size: stateParams.size,
                program: vm.program
            }, {reload: true});
        });

        it('should call state go method', function() {
            vm.search();
            expect($state.go).toHaveBeenCalled();
        });
    });
});
