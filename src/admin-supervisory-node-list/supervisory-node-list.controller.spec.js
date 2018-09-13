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

describe('SupervisoryNodeListController', function() {

    var $state, $controller,
        vm, geographicZones, supervisoryNodes, stateParams;

    beforeEach(function() {

        module('admin-supervisory-node-list');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
        });

        supervisoryNodes = [
            {
                id: 1,
                name: 'facility-1'
            },
            {
                id: 2,
                name: 'facility-2'
            }
        ];
        stateParams = {
            page: 0,
            size: 10,
            zoneId: 'zone-id',
            name: '1'
        };

        vm = $controller('SupervisoryNodeListController', {
            supervisoryNodes: supervisoryNodes,
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

        it('should expose facilities array', function() {
            expect(vm.supervisoryNodes).toEqual(supervisoryNodes);
        });

        it('should expose geographic zones array', function() {
            expect(vm.geographicZones).toEqual(geographicZones);
        });

        it('should expose facility name', function() {
            expect(vm.supervisoryNodeName).toEqual(stateParams.name);
        });

        it('should expose geographic zone id', function() {
            expect(vm.geographicZone).toEqual(stateParams.zoneId);
        });
    });

    describe('search', function() {

        it('should set name param', function() {
            vm.supervisoryNodeName = 'name';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.supervisoryNodes', {
                page: stateParams.page,
                size: stateParams.size,
                name: 'name',
                zoneId: stateParams.zoneId
            }, {
                reload: true
            });
        });

        it('should set firstName param', function() {
            vm.geographicZone = 'some-id';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.supervisoryNodes', {
                page: stateParams.page,
                size: stateParams.size,
                name: stateParams.name,
                zoneId: 'some-id'
            }, {
                reload: true
            });
        });

        it('should call state go method', function() {
            vm.search();

            expect($state.go).toHaveBeenCalled();
        });
    });
});
