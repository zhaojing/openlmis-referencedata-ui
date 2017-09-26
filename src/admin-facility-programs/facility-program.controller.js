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
     * @name admin-facility-programs.controller:FacilityProgramsController
     *
     * @description
     * Controller for the Add Programs page.
     */
    angular
        .module('admin-facility-programs')
        .controller('FacilityProgramsController', FacilityProgramsController);

    FacilityProgramsController.$inject = [
        'facility', 'programs', 'loadingModalService', 'facilityService', '$state',
        'notificationService', '$filter', '$q'
    ];

    function FacilityProgramsController(facility, programs, loadingModalService, facilityService,
                                        $state, notificationService, $filter, $q) {
        var vm = this;

        vm.$onInit = onInit;
        vm.addProgram = addProgram;
        vm.save = save;
        vm.cancel = cancel;
        vm.isNotAssigned = isNotAssigned;

        /**
         * @ngdoc method
         * @methodOf admin-facility-programs.controller:FacilityProgramsController
         * @name $onInit
         *
         * @description
         * Initialization method of the FacilityProgramsController.
         */
        function onInit() {
            vm.facility = angular.copy(facility);
            vm.programs = programs;

            if (!vm.facility.supportedPrograms) {
                vm.facility.supportedPrograms = [];
            }
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-programs.controller:FacilityProgramsController
         * @name addProgram
         *
         * @description
         * Add the program to the list of the supported programs of the facility.
         */
        function addProgram() {
            vm.facility.supportedPrograms.push(angular.extend({}, vm.program, {
                supportStartDate: vm.startDate,
                supportActive: true
            }));

            vm.program = undefined;
            vm.startDate = undefined;

            return $q.when();
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-programs.controller:FacilityProgramsController
         * @name save
         *
         * @description
         * Saves the facility along with the supported programs
         */
        function save() {
            doSave(
                vm.facility,
                'adminFacilityPrograms.facilityAndProgramsHaveBeenSaved',
                'adminFacilityPrograms.failedToSaveFacilityAndPrograms'
            );
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-programs.controller:FacilityProgramsController
         * @name cancel
         *
         * @description
         * Saves the facility without the supported programs
         */
        function cancel() {
            doSave(
                facility,
                'adminFacilityPrograms.facilityHasBeenSaved',
                'adminFacilityPrograms.failedToSaveFacility'
            );
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-programs.controller:FacilityProgramsController
         * @name isNotAssigned
         *
         * @description
         * Returns a method used for sorting programs.
         *
         * @return  {Function}  the function that filters out already assigned programs
         */
        function isNotAssigned() {
            return isProgramNotAssigned;
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-programs.controller:FacilityProgramsController
         * @name isProgramNotAssigned
         * @private
         *
         * @description
         * Check if the given programs is already assigned to the facility.
         *
         * @param   {Object}    program the program to be checked
         * @return  {Boolean}           true if the program is already assigned, false otherwise
         */
        function isProgramNotAssigned(program) {
            return $filter('filter')(vm.facility.supportedPrograms, {
                id: program.id
            }).length === 0;
        }

        function doSave(facility, successMessage, errorMessage) {
            var loadingPromise = loadingModalService.open();
            facilityService.save(facility).then(function() {
                loadingPromise.then(function() {
                    notificationService.success(successMessage);
                });
                $state.go('openlmis.administration.facilities', {}, {
                    reload: true
                });
            }).catch(function() {
                loadingPromise.then(function() {
                    notificationService.error(errorMessage);
                });
                loadingModalService.close();
            });
        }
    }

})();
