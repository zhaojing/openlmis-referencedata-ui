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
     * @name admin-processing-schedule-add.controller:ProcessingScheduleAddController
     *
     * @description
     * Provides methods for Add Processing Schedule modal. Allows returning to previous states and saving Processing Schedule.
     */
    angular
        .module('admin-processing-schedule-add')
        .controller('ProcessingScheduleAddController', ProcessingScheduleAddController);

    ProcessingScheduleAddController.$inject = [
        'confirmService', 'processingScheduleService', '$state',
        'loadingModalService', 'notificationService', 'messageService'
    ];

    function ProcessingScheduleAddController(confirmService, processingScheduleService, $state,
                        loadingModalService, notificationService, messageService) {
        var vm = this;

        vm.save = save;
        vm.goToPreviousState = goToPreviousState;

        /**
         * @ngdoc property
         * @methodOf admin-processing-schedule-add.controller:ProcessingScheduleAddController
         * @name processingSchedule
         * @type {Object}
         *
         * @description
         * New Processing Schedule to be saved.
         */
        vm.processingSchedule = {};

        /**
         * @ngdoc method
         * @methodOf admin-processing-schedule-add.controller:ProcessingScheduleAddController
         * @name save
         *
         * @description
         * Saves the Processing Schedule and takes user back to the previous state.
         */
        function save() {
            var confirmMessage = messageService.get('adminProcessingScheduleAdd.save.question', {
                processingSchedule: vm.processingSchedule.name
            });

            confirmService.confirm(
                confirmMessage,
                'adminProcessingScheduleAdd.save'
            ).then(function() {
                var loadingPromise = loadingModalService.open();
                processingScheduleService.create(vm.processingSchedule).then(function() {
                    loadingPromise.then(function() {
                        notificationService.success('adminProcessingScheduleAdd.save.success');
                    });
                    goToPreviousState();
                }).catch(function() {
                    loadingModalService.close();
                    notificationService.error('adminProcessingScheduleAdd.save.fail');
                });
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-processing-schedule-add.controller:ProcessingScheduleAddController
         * @name goToPreviousState
         *
         * @description
         * Redirects user to Processing Schedule List screen.
         */
        function goToPreviousState() {
            $state.go('openlmis.administration.processingSchedules', {}, {
                reload: true
            });
        }
    }

})();
