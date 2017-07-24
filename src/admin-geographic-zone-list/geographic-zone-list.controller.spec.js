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

describe('GeographicZoneListController', function () {

    var $state, $controller,
        vm, geographicZones, stateParams;

    beforeEach(function() {
        module('admin-geographic-zone-list');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
        });

        geographicZones = [
            {
                id: 'zone-1',
                code: 'zone-1-code',
                name: 'geographic-zone-1'
            },
            {
                id: 'zone-2',
                code: 'zone-2-code',
                name: 'geographic-zone-2'
            }
        ];
        stateParams = {
            page: 0,
            size: 10,
            parent: geographicZones[0].code,
            name: 'geographic-zone-1'
        };

        vm = $controller('GeographicZoneListController', {
            filteredGeographicZones: [geographicZones[0]],
            geographicZones: geographicZones,
            $stateParams: stateParams
        });
        vm.$onInit();

        spyOn($state, 'go').andReturn();
    });

    describe('onInit', function() {

        it('should expose search method', function() {
            expect(angular.isFunction(vm.search)).toBe(true);
        });

        it('should expose filtered geographic zones array', function() {
            expect(vm.filteredGeographicZones).toEqual([geographicZones[0]]);
        });

        it('should expose geographic zones array', function() {
            expect(vm.geographicZones).toEqual(geographicZones);
        });

        it('should expose name', function() {
            expect(vm.name).toEqual(stateParams.name);
        });

        it('should expose parent', function() {
            expect(vm.parent).toEqual(stateParams.parent);
        });
    });

    describe('search', function() {

        it('should set all params', function() {
            vm.parent = 'some-zone';
            vm.name = 'some-name';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.geographicZones', {
                page: stateParams.page,
                size: stateParams.size,
                parent: 'some-zone',
                name: 'some-name'
            }, {reload: true});
        });

        it('should call state go method', function() {
            vm.search();
            expect($state.go).toHaveBeenCalled();
        });
    });
});
