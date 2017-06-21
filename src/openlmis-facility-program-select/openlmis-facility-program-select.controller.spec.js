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

    var vm, $stateParams, cacheService, homeFacility, homePrograms, supervisedPrograms,
        CACHE_KEYS, loadingModalService, facilities;

    beforeEach(function() {
        module('openlmis-facility-program-select');

        inject(function($injector) {
            cacheService = $injector.get('cacheService');
            $stateParams = $injector.get('$stateParams');
            CACHE_KEYS = $injector.get('CACHE_KEYS');
            loadingModalService = $injector.get('loadingModalService');
            vm = $injector.get('$controller')('OpenlmisFacilityProgramSelectController');
        });

        homePrograms = [
            {
                id: 'program-one-id',
                supportActive: true,
                programActive: true
            },
            {
                id: 'program-two-id',
                supportActive: true,
                programActive: true
            },
            {
               id: 'e7a503c8-9f74-45d5-97c0-7041d91321b1',
               supportActive: false,
               programActive: true
            }
        ];

        supervisedPrograms = [{
            id: 'program-two-id'
        }, {
            id: 'program-three-id'
        }];

        facilities = [{
            id: 'facility-one-id'
        }, {
            id: 'facility-two-id'
        }];

        homeFacility = {
            id: 'home-facility-id',
            supportedPrograms: [
                homePrograms[0]
            ]
        };

        spyOn(cacheService, 'get');
        spyOn(cacheService, 'isReady').andReturn(true);
    });

    describe('$onInit', function() {

        beforeEach(function() {
            cacheService.get.andCallFake(function(key) {
                if (key === CACHE_KEYS.HOME_FACILITY) return homeFacility;
                if (key === CACHE_KEYS.HOME_PROGRAMS) return homePrograms;
                if (key === CACHE_KEYS.SUPERVISED_PROGRAMS) return supervisedPrograms;
            });
        });

        it('should expose home facility', function() {
            vm.$onInit();

            expect(vm.homeFacility).toEqual(homeFacility);
        });

        it('should expose supervised programs', function() {
            vm.$onInit();

            expect(vm.supervisedPrograms).toEqual(supervisedPrograms);
        });

        it('should expose isSupervised', function() {
            $stateParams.supervised = 'true';

            vm.$onInit();

            expect(vm.isSupervised).toEqual(true);
        });

        it('should expose program for home facility', function() {
            $stateParams.program = 'program-one-id';

            vm.$onInit();

            expect(vm.program).toEqual(homePrograms[0]);
        });

        it('should update facilities', function() {
            spyOn(vm, 'updateFacilities');

            vm.$onInit();

            expect(vm.updateFacilities).toHaveBeenCalledWith(true);
        });

        it('should expose only supported programs for home facility', function() {
            vm.$onInit();

            expect(vm.homePrograms).toEqual(homeFacility.supportedPrograms);
        });

        it('should not expose home programs if home facility is undefined', function() {
            cacheService.get.andCallFake(function(key) {
                if (key === CACHE_KEYS.HOME_FACILITY) return undefined;
                if (key === CACHE_KEYS.HOME_PROGRAMS) return homePrograms;
                if (key === CACHE_KEYS.SUPERVISED_PROGRAMS) return supervisedPrograms;
            });

            vm.$onInit();

            expect(vm.homePrograms).toBeUndefined();
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

    describe('updateFacilities for home facility', function() {

        beforeEach(function() {
            vm.homeFacility = homeFacility;
            vm.isSupervised = false;

            spyOn(loadingModalService, 'close');
        });

        it('should expose home facility as facility list', function() {
            vm.updateFacilities();

            expect(vm.facilities).toEqual([homeFacility]);
        });

        it('should select home facility', function() {
            vm.updateFacilities();

            expect(vm.facility).toEqual(homeFacility);
        });

        it('should close loading modal', function() {
            vm.updateFacilities();

            expect(loadingModalService.close).toHaveBeenCalled();
        });

    });

    describe('updateFacilities for supervised facilities', function() {

        beforeEach(function() {
            vm.homeFacility = homeFacility;
            vm.isSupervised = true;

            spyOn(loadingModalService, 'close');
        });

        it('should clear facility list if program was not selected', function() {
            vm.updateFacilities();

            expect(vm.facilities).toEqual([]);
        });

        it('should close loading modal if no program was selected', function() {
            vm.updateFacilities();

            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('should retrieve facility list from the cache', function() {
            vm.program = homePrograms[1];

            vm.updateFacilities();

            expect(cacheService.get).toHaveBeenCalledWith(homePrograms[1].id);
        });

        it('should set facility based on state params on init', function() {
            $stateParams.facility = 'facility-two-id';
            vm.program = homePrograms[1];

            cacheService.isReady.andReturn(true);
            cacheService.get.andCallFake(function(key) {
                if (key === 'program-two-id') return facilities;
            });

            vm.updateFacilities(true);

            expect(vm.facility).toEqual(facilities[1]);
        });

        it('should expose facilities for the program', function() {
            vm.program = homePrograms[1];

            cacheService.isReady.andReturn(true);
            cacheService.get.andCallFake(function(key) {
                if (key === 'program-two-id') return facilities;
            });

            vm.updateFacilities();

            expect(vm.facilities).toEqual(facilities);
        });

        it('should clear facility', function() {
            vm.facility = facilities[0];

            vm.updateFacilities();

            expect(vm.facility).toBeUndefined();
        });

    });
});
