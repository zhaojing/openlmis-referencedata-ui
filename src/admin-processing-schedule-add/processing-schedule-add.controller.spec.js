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

describe('ProcessingScheduleAddController', function() {

    var $controller, $rootScope, $q, $state, confirmService, processingScheduleService, stateTrackerService, loadingModalService, notificationService, messageService, ProcessingScheduleDataBuilder,
        vm, processingSchedule, confirmDeferred, saveDeferred, loadingDeferred;

    beforeEach(function() {
        module('admin-processing-schedule-add');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            confirmService = $injector.get('confirmService');
            $q = $injector.get('$q');
            processingScheduleService = $injector.get('processingScheduleService');
            stateTrackerService = $injector.get('stateTrackerService');
            $state = $injector.get('$state');
            loadingModalService = $injector.get('loadingModalService');
            notificationService = $injector.get('notificationService');
            messageService = $injector.get('messageService');
            ProcessingScheduleDataBuilder = $injector.get('ProcessingScheduleDataBuilder');
        });

        processingSchedule = new ProcessingScheduleDataBuilder().build();

        confirmDeferred = $q.defer();
        saveDeferred = $q.defer();
        loadingDeferred = $q.defer();

        spyOn(confirmService, 'confirm').andReturn(confirmDeferred.promise);
        spyOn(stateTrackerService, 'goToPreviousState').andCallFake(loadingDeferred.resolve);
        spyOn(processingScheduleService, 'create').andReturn(saveDeferred.promise);
        spyOn($state, 'go');
        spyOn(loadingModalService, 'open').andReturn(loadingDeferred.promise);
        spyOn(loadingModalService, 'close').andCallFake(loadingDeferred.resolve);
        spyOn(notificationService, 'success');
        spyOn(notificationService, 'error');
        spyOn(messageService, 'get').andCallFake(function(key, param) {
            if (key === 'adminProcessingScheduleAdd.save.question') {
                return 'Do you want to save Processing Schedule ' + param.processingSchedule + '?';
            }
        });

        vm = $controller('ProcessingScheduleAddController');
    });

    describe('$onInit', function() {

        it('should expose resolved fields', function() {
            expect(vm.processingSchedule).toEqual({});
        });
    });

    describe('save', function() {

        beforeEach(function() {
            vm.processingSchedule = processingSchedule;
        });

        it('should prompt user to save schedule', function() {
            vm.save();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'Do you want to save Processing Schedule ' + processingSchedule.name + '?',
                'adminProcessingScheduleAdd.save'
            );
        });

        it('should not save period if user does not confirm it', function() {
            vm.save();

            confirmDeferred.reject();
            $rootScope.$apply();

            expect(processingScheduleService.create).not.toHaveBeenCalled();
        });

        it('should save schedule and open loading modal after confirm', function() {
            vm.save();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(processingScheduleService.create).toHaveBeenCalledWith(processingSchedule);
            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should show notification if schedule was saved successfully', function() {
            vm.save();

            confirmDeferred.resolve();
            saveDeferred.resolve(processingSchedule);
            loadingDeferred.resolve();
            $rootScope.$apply();

            expect(notificationService.success).toHaveBeenCalledWith('adminProcessingScheduleAdd.save.success');
        });

        it('should show notification if schedule save has failed', function() {
            vm.save();

            confirmDeferred.resolve();
            saveDeferred.reject();
            $rootScope.$apply();

            expect(notificationService.error).toHaveBeenCalledWith('adminProcessingScheduleAdd.save.fail');
            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('should take the user to processing schedule list page after successful save', function() {
            vm.save();

            confirmDeferred.resolve();
            saveDeferred.resolve(processingSchedule);
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.processingSchedules', {}, {
                reload: true
            });
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
