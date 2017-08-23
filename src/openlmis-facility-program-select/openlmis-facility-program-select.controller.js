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

(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-facility-program-select.controller:OpenlmisFacilityProgramSelectController
     *
     * @description
     * Controller responsible for facilities and programs for the openlmis-facility-program-select
     * component.
     */
    angular
        .module('openlmis-facility-program-select')
        .controller('OpenlmisFacilityProgramSelectController', controller);

    controller.$inject = [
        '$q', '$stateParams', '$filter', 'loadingModalService', 'cacheService', 'CACHE_KEYS',
        'facilityProgramCacheService'
    ];

    function controller($q, $stateParams, $filter, loadingModalService, cacheService, CACHE_KEYS,
                        facilityProgramCacheService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.updateForm = updateForm;
        vm.updateFacilities = updateFacilities;

        /**
         * @ngdoc method
         * @methodOf openlmis-facility-program-select.controller:OpenlmisFacilityProgramSelectController
         * @name $onInit
         *
         * @description
         * Initialization method of the controller.
         */
        function onInit() {
            if (facilityProgramCacheService.isReady()) {
                doInit();
            } else {
                facilityProgramCacheService.whenReady().then(doInit);
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-facility-program-select.controller:OpenlmisFacilityProgramSelectController
         * @name updateForm
         *
         * @description
         * Updates the form by clearing program and facility selection and setting appropriate
         * lists.
         */
        function updateForm() {
            vm.program = undefined;
            vm.updateFacilities();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-facility-program-select.controller:OpenlmisFacilityProgramSelectController
         * @name updateFacilities
         *
         * @description
         * Updates the facility list by clearing the facility selection and setting appropriate
         * facility list.
         *
         * @param  {Boolean} init   the flag defining wether initial values should be set based on
         *                          on the state parameters
         */
        function updateFacilities(init) {
            vm.facility = undefined;

            if (!vm.isSupervised) {
                vm.facilities = [vm.homeFacility];
                vm.facility = vm.facilities[0];
                loadingModalService.close();
            } else if (!vm.program) {
                vm.facilities = [];
                loadingModalService.close();
            } else {
                var programId = vm.program.id;

                if (cacheService.isReady(programId)) {
                    setFacilities(cacheService.get(programId));
                } else {
                    loadingModalService.open();
                    $q.when(cacheService.get(programId)).then(setFacilities);
                }
            }

            function setFacilities(facilities) {
                if (vm.module) {
                    vm.facilities = facilities[vm.module];
                } else {
                    var allFacilities = [];
                    angular.forEach(facilities, function(facilityList) {
                        allFacilities = allFacilities.concat(facilityList);
                    });
                    vm.facilities = $filter('unique')(allFacilities, 'id');
                }

                if (init && $stateParams.facility) {
                    vm.facility = $filter('filter')(vm.facilities, {
                        id: $stateParams.facility
                    })[0];
                }

                loadingModalService.close();
            }
        }

        function doInit() {
            if (isDataReady()) {
                initVm(getData());
            } else {
                loadingModalService.open();
                $q.all(getData()).then(initVm);
            }
        }

        function initVm(responses) {
            vm.homeFacility = responses[0];
            vm.homePrograms = getSupportedHomeFacilityPrograms(responses[1]);

            vm.supervisedPrograms = responses[2];
            vm.isSupervised = $stateParams.supervised === 'true' || !vm.homeFacility;

            if ($stateParams.program) {
                vm.program = $filter('filter')(
                    vm.isSupervised ? vm.supervisedPrograms : vm.homePrograms,
                    {
                        id: $stateParams.program
                    }
                )[0];
            }

            vm.updateFacilities(true);
        }

        function getData() {
            return [
                cacheService.get(CACHE_KEYS.HOME_FACILITY),
                cacheService.get(CACHE_KEYS.HOME_PROGRAMS),
                cacheService.get(CACHE_KEYS.SUPERVISED_PROGRAMS)
            ];
        }

        function getSupportedHomeFacilityPrograms(programs) {
            if (!vm.homeFacility) return;

            var supportedProgramIds = vm.homeFacility.supportedPrograms.map(function(program) {
                return program.id;
            });

            return $filter('filter')(programs, function(program) {
                var programIndex = supportedProgramIds.indexOf(program.id);

                if (programIndex < 0) {
                    return false;
                }

                var supportedProgram = vm.homeFacility.supportedPrograms[programIndex];
                return supportedProgram.programActive && supportedProgram.supportActive;
            });
        }

        function isDataReady() {
            return cacheService.isReady(CACHE_KEYS.HOME_FACILITY) &&
                cacheService.isReady(CACHE_KEYS.HOME_PROGRAMS) &&
                cacheService.isReady(CACHE_KEYS.SUPERVISED_PROGRAMS);
        }
    }

})();
