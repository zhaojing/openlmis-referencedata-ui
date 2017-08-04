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

    var $state, $controller,
        vm, supplyLines, stateParams;

    beforeEach(function() {
        module('admin-supply-line-list');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
        });

        warehouses = [
            {
                name: 'facility-1',
                id: 'facility-1-id',
                code: 'facility-1-code'
            },
            {

                name: 'facility-2',
                id: 'facility-2-id',
                code: 'facility-2-code'
            }
        ];
        supplyLines = [
            {
                id: '1',
                code: 'line-1-code',
                name: 'supply-line-1'
            },
            {
                id: '2',
                code: 'line-2-code',
                name: 'supply-line-2'
            }
        ];
        stateParams = {
            page: 0,
            size: 10,
            supplyingFacility: warehouses[0].code
        };

        vm = $controller('SupplyLineListController', {
            supplyLines: supplyLines,
            warehouses: warehouses,
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

        it('should expose warehouses array', function() {
            expect(vm.warehouses).toEqual(warehouses);
        });

        it('should expose supplying facility', function() {
            expect(vm.supplyingFacility).toEqual(stateParams.supplyingFacility);
        });
    });

    describe('search', function() {

        it('should set search params', function() {
            vm.supplyingFacility = 'facility-code';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.supplyLines', {
                page: stateParams.page,
                size: stateParams.size,
                supplyingFacility: vm.supplyingFacility
            }, {reload: true});
        });

        it('should call state go method', function() {
            vm.search();
            expect($state.go).toHaveBeenCalled();
        });
    });
});
