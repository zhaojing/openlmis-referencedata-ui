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

describe('FacilityProgramsController', function() {

    var vm, facility, programs, $rootScope, $q, $state, loadingModalService, notificationService,
        facilityService, $rootScope;

    beforeEach(prepareSuite);

    describe('$onInit', function() {

        it('should expose programs', function() {
            vm.$onInit();

            expect(vm.programs).toEqual(programs);
        });

        it('should copy facility', function() {
            vm.$onInit();

            expect(vm.facility).toEqual(angular.extend({}, facility, {
                supportedPrograms: []
            }));
            expect(vm.facility).not.toBe(facility);
        });

    });

    describe('addProgram', function() {

        beforeEach(function() {
            vm.$onInit();
        });

        it('should add supported program to the list', function() {
            vm.program = vm.programs[0];
            vm.startDate = new Date('08/10/2017');

            vm.addProgram();

            expect(vm.facility.supportedPrograms[0]).toEqual(angular.extend({}, vm.programs[0], {
                supportStartDate: new Date('08/10/2017'),
                supportActive: true
            }));
        });

        it('should clear selections', function() {
            vm.program = vm.programs[0];
            vm.startDate = new Date('08/10/2017');

            vm.addProgram();

            vm.program = undefined;
            vm.startDate = undefined;
        });

    });

    describe('save', function() {

        var loadingDeferred;

        beforeEach(function() {
            loadingDeferred = $q.defer();

            spyOn(facilityService, 'save').andReturn($q.when());
            spyOn(loadingModalService, 'close').andCallFake(loadingDeferred.resolve);
            spyOn(loadingModalService, 'open').andReturn(loadingDeferred.promise);
            spyOn($state, 'go').andCallFake(loadingDeferred.resolve);
            spyOn(notificationService, 'success');
            spyOn(notificationService, 'error');
        });

        it('should open loading modal', function() {
            vm.save();

            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should save facility', function() {
            vm.save();

            expect(facilityService.save).toHaveBeenCalledWith(vm.facility);
            expect(facilityService.save).not.toHaveBeenCalledWith(facility);
        });

        it('should take user to the facility list after save', function() {
            vm.save();
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.facilities', {}, {
                reload: true
            });
        });

        it('should return to the modal if save failed', function() {
            facilityService.save.andReturn($q.reject());

            vm.save();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalled();
        });

        it('should show success notification after save', function() {
            vm.save();
            $rootScope.$apply();

            expect(notificationService.success)
                .toHaveBeenCalledWith('adminFacilityPrograms.facilityAndProgramsHaveBeenSaved');
        });

        it('should show error notification if save failed', function() {
            facilityService.save.andReturn($q.reject());

            vm.save();
            $rootScope.$apply();

            expect(notificationService.error)
                .toHaveBeenCalledWith('adminFacilityPrograms.failedToSaveFacilityAndPrograms');
        });

        it('should hide loading modal if save failed', function() {
            facilityService.save.andReturn($q.reject());

            vm.save();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
        });


    });

    describe('cancel', function() {

        var loadingDeferred;

        beforeEach(function() {
            loadingDeferred = $q.defer();

            spyOn(facilityService, 'save').andReturn($q.when());
            spyOn(loadingModalService, 'close').andCallFake(loadingDeferred.resolve);
            spyOn(loadingModalService, 'open').andReturn(loadingDeferred.promise);
            spyOn($state, 'go').andCallFake(loadingDeferred.resolve);
            spyOn(notificationService, 'success');
            spyOn(notificationService, 'error');
        });

        it('should save facility', function() {
            vm.cancel();

            expect(facilityService.save).toHaveBeenCalledWith(facility);
            expect(facilityService.save).not.toHaveBeenCalledWith(vm.facility);
        });

        it('should show success notification after save', function() {
            vm.cancel();
            $rootScope.$apply();

            expect(notificationService.success)
                .toHaveBeenCalledWith('adminFacilityPrograms.facilityHasBeenSaved');
        });

        it('should show error notification if save failed', function() {
            facilityService.save.andReturn($q.reject());

            vm.cancel();
            $rootScope.$apply();

            expect(notificationService.error)
                .toHaveBeenCalledWith('adminFacilityPrograms.failedToSaveFacility');
        });

    });

    describe('isNotAssigned', function() {

        beforeEach(function() {
            vm.$onInit();
        });

        it('should return false if program is already assigned', function() {
            vm.facility.supportedPrograms = [{
                id: 'some-program-id'
            }];

            var result = vm.isNotAssigned()({
                id: 'some-program-id'
            });

            expect(result).toBe(false);
        });

        it('should return true if program is not yet assigned', function() {
            vm.facility.supportedPrograms = [{
                id: 'some-other-program-id'
            }];

            var result = vm.isNotAssigned()({
                id: 'some-program-id'
            });

            expect(result).toBe(true);
        });

    });

    function prepareSuite() {
        module('admin-facility-programs');

        var $controller;

        inject(function($injector) {
            $controller = $injector.get('$controller');
            notificationService = $injector.get('notificationService');
            loadingModalService = $injector.get('loadingModalService');
            facilityService = $injector.get('facilityService');
            $state = $injector.get('$state');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
        });

        facility = {
            id: 'some-facility-id'
        };

        programs = [{
            id: 'some-programs-id'
        }];

        vm = $controller('FacilityProgramsController', {
            facility: facility,
            programs: programs
        });
    }

});
