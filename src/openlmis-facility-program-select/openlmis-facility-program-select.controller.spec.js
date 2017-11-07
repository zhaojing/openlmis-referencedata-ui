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

describe('OpenlmisFacilityProgramSelectController', function() {

    var $q, $stateParams, $rootScope, facilityProgramCacheService,
        vm, facilities, supervisedPrograms, homeFacility;

    beforeEach(function() {
        module('openlmis-facility-program-select');

        inject(function($injector) {
            $q = $injector.get('$q');
            $stateParams = $injector.get('$stateParams');
            $rootScope = $injector.get('$rootScope');
            facilityProgramCacheService = $injector.get('facilityProgramCacheService');
            vm = $injector.get('$controller')('OpenlmisFacilityProgramSelectController');
        });

        supervisedPrograms = [{
            id: 'program-two-id'
        }, {
            id: 'program-three-id'
        }];

        facilities = [
            {
                id: 'facility-one-id'
            },
            {
                id: 'facility-two-id'
            },
            {
                id: 'facility-three-id'
            }
        ];

        homeFacility = {
            id: 'home-facility-id'
        };

        spyOn(facilityProgramCacheService, 'loadData').andReturn($q.when(true));
        spyOn(facilityProgramCacheService, 'getUserHomeFacility').andReturn(homeFacility);
        spyOn(facilityProgramCacheService, 'getUserPrograms').andReturn(supervisedPrograms);
        spyOn(facilityProgramCacheService, 'getSupervisedFacilities').andReturn(facilities);

        vm.$onInit();
        $rootScope.$apply();
    });

    describe('$onInit', function() {

        it('should expose home facility', function() {
            expect(vm.homeFacility).toEqual(homeFacility);
        });

        it('should expose supervised programs', function() {
            expect(vm.supervisedPrograms).toEqual(supervisedPrograms);
        });

        it('should expose isSupervised', function() {
            $stateParams.supervised = 'true';
            vm.$onInit();
            $rootScope.$apply();

            expect(vm.isSupervised).toEqual(true);
        });

        it('should expose program for home facility', function() {
            $stateParams.program = 'program-two-id';
            vm.$onInit();
            $rootScope.$apply();

            expect(vm.program).toEqual(supervisedPrograms[0]);
        });

        it('should update facilities', function() {
            spyOn(vm, 'updateFacilities');
            vm.$onInit();
            $rootScope.$apply();

            expect(vm.updateFacilities).toHaveBeenCalledWith(true);
        });
    });

    describe('updateForm', function() {

        it('should clear program', function() {
            vm.program = {
                id: 'some-program-id'
            };

            vm.updateForm();

            expect(vm.program).toBeUndefined();
        });

        it('should update facilities', function() {
            spyOn(vm, 'updateFacilities');

            vm.updateForm();

            expect(vm.updateFacilities).toHaveBeenCalledWith();
        });

    });

    describe('updateFacilities', function() {

        it('should expose home facility as facility list and select it', function() {
            vm.isSupervised = false;
            vm.updateFacilities();

            expect(vm.facilities).toEqual([homeFacility]);
            expect(vm.facility).toEqual(homeFacility);
        });

        it('should clear facilities if program is undefined', function() {
            vm.isSupervised = true;
            vm.program = undefined;
            vm.updateFacilities();

            expect(vm.facilities).toEqual([]);
        });

        it('should get supervised programs', function() {
            vm.isSupervised = true;
            vm.module = 'module';
            vm.program = programs[1];

            vm.updateFacilities();

            expect(vm.facilities).toEqual(facilities);
            expect(facilityProgramCacheService.getSupervisedFacilities).toHaveBeenCalledWith(vm.module, vm.program.id);
        });
    });
});
