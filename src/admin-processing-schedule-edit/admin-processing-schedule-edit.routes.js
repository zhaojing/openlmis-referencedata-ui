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
        .module('admin-processing-schedule-edit')
        .config(routes);

    routes.$inject = ['modalStateProvider'];

    function routes(modalStateProvider) {
        modalStateProvider.state('openlmis.administration.processingSchedules.edit', {
            controller: 'ProcessingScheduleEditController',
            controllerAs: 'vm',
            templateUrl: 'admin-processing-schedule-edit/processing-schedule-edit.html',
            url: '/:id?page&size',
            resolve: {
                processingSchedule: function($stateParams, processingScheduleService) {
                    return processingScheduleService.get($stateParams.id);
                },
                // processingSchedules resolve added to make sure that pagination is registered after parent state
                // should be fixed in OLMIS-5748
                processingPeriods: function(processingSchedules, $stateParams, periodFactory, paginationService) {
                    return paginationService.registerUrl($stateParams, function(stateParams) {
                        var params = angular.copy(stateParams);
                        delete params.id;
                        delete params.schedulesPage;
                        delete params.schedulesSize;
                        return periodFactory.getSortedPeriodsForSchedule(params, $stateParams.id);
                    });
                },
                newStartDate: function(periodFactory, $stateParams) {
                    return periodFactory.getNewStartDateForSchedule($stateParams.id);
                }
            },
            parentResolves: []
        });
    }
})();