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

describe('ProcessingScheduleEditController', function() {

    var $controller, $rootScope, $q, $state, confirmService, stateTrackerService, periodService, loadingModalService, notificationService, messageService, ProcessingScheduleDataBuilder, PeriodDataBuilder,
        vm, processingSchedule, processingPeriods, confirmDeferred, saveDeferred, loadingDeferred;

    beforeEach(function() {
        module('admin-processing-schedule-edit');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            confirmService = $injector.get('confirmService');
            $q = $injector.get('$q');
            periodService = $injector.get('periodService');
            stateTrackerService = $injector.get('stateTrackerService');
            $state = $injector.get('$state');
            loadingModalService = $injector.get('loadingModalService');
            notificationService = $injector.get('notificationService');
            messageService = $injector.get('messageService');
            ProcessingScheduleDataBuilder = $injector.get('ProcessingScheduleDataBuilder');
            PeriodDataBuilder = $injector.get('PeriodDataBuilder');
        });

        processingSchedule = new ProcessingScheduleDataBuilder().build();
        processingPeriods = [
            new PeriodDataBuilder().build(),
            new PeriodDataBuilder().build()
        ];

        confirmDeferred = $q.defer();
        saveDeferred = $q.defer();
        loadingDeferred = $q.defer();

        spyOn(confirmService, 'confirm').andReturn(confirmDeferred.promise);
        spyOn(stateTrackerService, 'goToPreviousState').andCallFake(loadingDeferred.resolve);
        spyOn(periodService, 'create').andReturn(saveDeferred.promise);
        spyOn($state, 'reload');
        spyOn($state, 'go');
        spyOn(loadingModalService, 'open').andReturn(loadingDeferred.promise);
        spyOn(loadingModalService, 'close').andCallFake(loadingDeferred.resolve);
        spyOn(notificationService, 'success');
        spyOn(notificationService, 'error');
        spyOn(messageService, 'get').andCallFake(function(key, param) {
            if (key === 'adminProcessingScheduleEdit.add.question') {
                return 'Do you want to add Processing Period ' + param.period + '?';
            }
        });

        vm = $controller('ProcessingScheduleEditController', {
            processingSchedule: processingSchedule,
            processingPeriods: processingPeriods
        });
    });

    describe('$onInit', function() {

        it('should expose resolved fields', function() {
            var newStartDate = angular.copy(processingPeriods[processingPeriods.length - 1].endDate);

            vm.$onInit();
            expect(vm.processingSchedule).toEqual(processingSchedule);
            expect(vm.newPeriod).toEqual({
                processingSchedule: processingSchedule,
                startDate: new Date(newStartDate.setTime(newStartDate.getTime() + 86400000))
            });
            expect(vm.processingPeriods).toEqual(processingPeriods);
        });
    });

    describe('add', function() {

        beforeEach(function() {
            vm.$onInit();
            vm.newPeriod = processingPeriods[0];
            vm.newPeriod.processingSchedule = processingSchedule;
        });

        it('should prompt user to add period', function() {
            vm.add();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'Do you want to add Processing Period ' + processingPeriods[0].name + '?',
                'adminProcessingScheduleEdit.add'
            );
        });

        it('should not add period if user does not confirm it', function() {
            vm.add();

            confirmDeferred.reject();
            $rootScope.$apply();

            expect(periodService.create).not.toHaveBeenCalled();
        });

        it('should add period and open loading modal after confirm', function() {
            vm.add();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(vm.newPeriod.processingSchedule).toEqual(processingSchedule);
            expect(periodService.create).toHaveBeenCalledWith(vm.newPeriod);
            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should show notification if period was added successfully', function() {
            vm.add();

            confirmDeferred.resolve();
            saveDeferred.resolve(processingPeriods[0]);
            loadingDeferred.resolve();
            $rootScope.$apply();

            expect(notificationService.success).toHaveBeenCalledWith('adminProcessingScheduleEdit.add.success');
        });

        it('should show notification if period save has failed', function() {
            vm.add();

            confirmDeferred.resolve();
            saveDeferred.reject();
            $rootScope.$apply();

            expect(notificationService.error).toHaveBeenCalledWith('adminProcessingScheduleEdit.add.fail');
            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('should reload state after successful add', function() {
            vm.add();

            confirmDeferred.resolve();
            saveDeferred.resolve(processingSchedule);
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
        });
    });

    describe('goToPreviousState', function() {

        it('should redirect to Processing Period screen', function() {
            vm.goToPreviousState();
            expect($state.go).toHaveBeenCalledWith('openlmis.administration.processingSchedules', {}, {
                reload: true
            });
        });
    });
});
