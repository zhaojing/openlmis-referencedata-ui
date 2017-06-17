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

    angular
        .module('openlmis-facility-program-select')
        .controller('OpenlmisFacilityProgramSelectController', controller);

    controller.$inject = [
        '$q', '$stateParams', '$filter', 'loadingModalService',  'facilityProgramCacheService'
    ];

    function controller($q, $stateParams, $filter, loadingModalService, facilityProgramCacheService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.updateForm = updateForm;
        vm.updateFacilities = updateFacilities;

        function onInit() {
            if (isDataReady()) {
                doInit([
                    facilityProgramCacheService.getHomeFacility(),
                    facilityProgramCacheService.getHomePrograms(),
                    facilityProgramCacheService.getSupervisedProgram()
                ]);
            } else {
                loadingModalService.open();
                $q.all([
                    $q.when(facilityProgramCacheService.getHomeFacility()),
                    $q.when(facilityProgramCacheService.getHomePrograms()),
                    $q.when(facilityProgramCacheService.getSupervisedProgram())
                ]).then(doInit);
            }
        }

        function doInit(responses) {
            vm.homeFacility = responses[0];
            vm.homePrograms = responses[1];
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

            updateFacilities(true);
        }

        function updateForm() {
            vm.program = undefined;
            updateFacilities();
        }

        function updateFacilities(init) {
            if (!init) {
                vm.facility = undefined;
            }

            if (!vm.isSupervised) {
                vm.facilities = [vm.homeFacility];
                vm.facility = vm.facilities[0];
                loadingModalService.close();
            } else if (!vm.program) {
                vm.facilities = [];
                loadingModalService.close();
            } else {
                var programId = vm.program.id;

                if (facilityProgramCacheService.areFacilitiesReady(programId)) {
                    setFacilities(facilityProgramCacheService.getFacilities(programId));
                } else {
                    loadingModalService.open();
                    $q.when(
                        facilityProgramCacheService.getFacilities(programId)
                    ).then(setFacilities);
                }
            }

            function setFacilities(facilities) {
                vm.facilities = facilities;

                if (init && $stateParams.facility) {
                    vm.facility = $filter('filter')(vm.facilities, {
                        id: $stateParams.facility
                    })[0];
                }

                loadingModalService.close();
            }
        }

        function isDataReady() {
            return facilityProgramCacheService.isHomeFacilityReady() &&
                facilityProgramCacheService.areHomeProgramsReady() &&
                facilityProgramCacheService.areSupervisedProgramsReady();
        }
    }

})();
