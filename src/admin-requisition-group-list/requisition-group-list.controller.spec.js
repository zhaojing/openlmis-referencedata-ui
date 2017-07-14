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

describe('RequisitionGroupListController', function () {

    var $state, $controller,
        vm, requisitionGroups, programs, geographicZones, stateParams;

    beforeEach(function() {
        module('admin-requisition-group-list');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
        });

        programs = [
            {
                id: 'program-id-1',
                name: 'program-1',
                code: 'program-1-code'
            },
            {
                id: 'program-id-2',
                name: 'program-2',
                code: 'program-2-code'
            }
        ];
        geographicZones = [
            {
                id: 'zone-1',
                code: 'zone-1-code'
            },
            {
                id: 'zone-2',
                code: 'zone-2-code'
            }
        ];
        requisitionGroups = [
            {
                id: 'group-id-1',
                name: 'group-1',
                code: 'group-code-1'
            },
            {
                id: 'group-id-2',
                name: 'group-2',
                code: 'group-code-2'
            }
        ];
        stateParams = {
            page: 0,
            size: 10,
            zone: geographicZones[0].code,
            name: 'requisition-group',
            program: programs[0].code
        };

        vm = $controller('RequisitionGroupListController', {
            requisitionGroups: requisitionGroups,
            programs: programs,
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

        it('should expose requisition groups array', function() {
            expect(vm.requisitionGroups).toEqual(requisitionGroups);
        });

        it('should expose programs array', function() {
            expect(vm.programs).toEqual(programs);
        });

        it('should expose programs array', function() {
            expect(vm.programs).toEqual(programs);
        });

        it('should expose name', function() {
            expect(vm.name).toEqual(stateParams.name);
        });

        it('should expose program', function() {
            expect(vm.program).toEqual(stateParams.program);
        });

        it('should expose geographic zone', function() {
            expect(vm.geographicZone).toEqual(stateParams.zone);
        });
    });

    describe('search', function() {

        it('should set all params', function() {
            vm.geographicZone = 'some-zone';
            vm.program = 'some-program';
            vm.name = 'some-name';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.requisitionGroups', {
                page: stateParams.page,
                size: stateParams.size,
                zone: 'some-zone',
                name: 'some-name',
                program: 'some-program'
            }, {reload: true});
        });

        it('should call state go method', function() {
            vm.search();
            expect($state.go).toHaveBeenCalled();
        });
    });
});
