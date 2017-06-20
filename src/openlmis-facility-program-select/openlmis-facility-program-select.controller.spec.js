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

    var $state, $scope, $controller, cacheService, CACHE_KEYS, vm, user;

    beforeEach(function() {
        module('referencedata-facility');

        module('openlmis-facility-program-select');

        module('openlmis-cache', function($provide) {
            cacheService = jasmine.createSpyObj('cacheService', ['isReady', 'get']);
            $provide.service('cacheService', function() {
                return cacheService;
            });
        });

        inject(function($injector) {
            $controller = $injector.get('$controller');
            cacheService = $injector.get('cacheService');
            CACHE_KEYS = $injector.get("CACHE_KEYS");
        });
    });

    describe('init', function() {

        beforeEach(function() {
            supervisedPrograms = [
                {'id': '7938919f-6f61-4d1a-a4dc-923c31e9cd45'}
            ];

            homePrograms = [
                {'id': 'dce17f2e-af3e-40ad-8e00-3496adef44c3'},
                {'id': '9456c3e9-c4a6-4a28-9e08-47ceb16a4121'}
            ];

            homeFacility = {
                'id': 'ac1d268b-ce10-455f-bf87-9c667da8f060',
                'supportedPrograms': [
                    homePrograms[0]
                ]
            };

            cacheService.isReady.andReturn(true);
            cacheService.get.andCallFake(function(key) {
                if (key === CACHE_KEYS.HOME_FACILITY) {
                    return homeFacility;
                } else if (key === CACHE_KEYS.HOME_PROGRAMS) {
                    return homePrograms;
                } else {
                    return supervisedPrograms;
                }
            });
        });

        it('should display only supported programs for home facility', function() {
            vm = $controller('OpenlmisFacilityProgramSelectController', {
                $stateParams: {supervised: 'false'}
            });

            vm.$onInit();

            expect(vm.homePrograms).toEqual(homeFacility.supportedPrograms)
        });

        it('should display all supervised programs in supervised mode', function() {
            vm = $controller('OpenlmisFacilityProgramSelectController', {
                $stateParams: {supervised: 'true'}
            });

            vm.$onInit();

            expect(vm.supervisedPrograms).toEqual(supervisedPrograms)
        });

        it('should display only home facility in non-supervised mode', function() {
            vm = $controller('OpenlmisFacilityProgramSelectController', {
                $stateParams: {supervised: 'false'}
            });

            vm.$onInit();

            expect(vm.facilities).toEqual([homeFacility])
        });

        it('should display empty facility list in supervised mode', function() {
            vm = $controller('OpenlmisFacilityProgramSelectController', {
                $stateParams: {supervised: 'true'}
            });

            vm.$onInit();

            expect(vm.facilities).toEqual([])
        });
    });
});
