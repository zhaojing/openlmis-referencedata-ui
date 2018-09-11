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

describe('FacilityAddController', function() {

    var vm, $rootScope, facility, facilityTypes, geographicZones, facilityOperators, confirmService,
        confirmDeferred, facilityService, stateTrackerService, saveDeferred, $state, $q,
        loadingModalService, loadingDeferred, notificationService, messageService,
        FacilityTypeDataBuilder, GeographicZoneDataBuilder, FacilityOperatorDataBuilder,
        FacilityDataBuilder;

    beforeEach(prepareSuite);

    describe('$onInit', function() {

        it('should expose stateTrackerService.goToPreviousState method', function() {
            vm.$onInit();

            expect(vm.goToPreviousState).toBe(stateTrackerService.goToPreviousState);
        });

        it('should expose resolved fields', function() {
            vm.$onInit();

            expect(vm.facilityTypes).toEqual(facilityTypes);
            expect(vm.geographicZones).toEqual(geographicZones);
            expect(vm.facilityOperators).toEqual(facilityOperators);
        });

        it('should default active to true', function() {
            facility.active = undefined;

            vm.$onInit();

            expect(vm.facility.active).toBe(true);
        });

        it('should default enabled to true', function() {
            facility.enabled = undefined;

            vm.$onInit();

            expect(vm.facility.enabled).toBe(true);
        });

        it('should copy facility', function() {
            vm.$onInit();

            expect(vm.facility).toEqual(facility);
            expect(vm.facility).not.toBe(facility);
        });

    });

    describe('save', function() {

        it('should prompt user to add programs', function() {
            facilityService.save.andReturn($q.when(facility));
            vm.save();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'Do you want to add programs to Assumane, Lichinga Cidade?',
                'adminFacilityAdd.addPrograms',
                'adminFacilityAdd.cancel'
            );
        });

        it('should open loading modal if user refuses to add programs', function() {
            vm.save();

            confirmDeferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should show notification if facility was saved successfully', function() {
            vm.save();

            confirmDeferred.reject();
            saveDeferred.resolve();
            $rootScope.$apply();

            expect(notificationService.success).toHaveBeenCalledWith(
                'adminFacilityAdd.facilityHasBeenSaved'
            );
        });

        it('should show notification if facility save has failed', function() {
            vm.save();

            confirmDeferred.reject();
            saveDeferred.reject();
            $rootScope.$apply();

            expect(notificationService.error).toHaveBeenCalledWith(
                'adminFacilityAdd.failedToSaveFacility'
            );
        });

        it('should take to the user to add programs page if user agrees to it', function() {
            facilityService.save.andReturn($q.when(facility));
            vm.save();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalledWith(
                'openlmis.administration.facilities.facility.programs', {
                    facility: facility
                }
            );
        });

    });

    function prepareSuite() {
        var $controller;

        module('admin-facility-add');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            confirmService = $injector.get('confirmService');
            $q = $injector.get('$q');
            facilityService = $injector.get('facilityService');
            stateTrackerService = $injector.get('stateTrackerService');
            $state = $injector.get('$state');
            loadingModalService = $injector.get('loadingModalService');
            notificationService = $injector.get('notificationService');
            messageService = $injector.get('messageService');
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            GeographicZoneDataBuilder = $injector.get('GeographicZoneDataBuilder');
            FacilityOperatorDataBuilder = $injector.get('FacilityOperatorDataBuilder');
        });

        facility = new FacilityDataBuilder().withoutId()
            .build();

        facilityTypes = [
            new FacilityTypeDataBuilder().build(),
            new FacilityTypeDataBuilder().build(),
            new FacilityTypeDataBuilder().build()
        ];

        geographicZones = [
            new GeographicZoneDataBuilder().build(),
            new GeographicZoneDataBuilder().build(),
            new GeographicZoneDataBuilder().build()
        ];

        facilityOperators = [
            new FacilityOperatorDataBuilder().build(),
            new FacilityOperatorDataBuilder().build()
        ];

        confirmDeferred = $q.defer();
        saveDeferred = $q.defer();
        loadingDeferred = $q.defer();

        spyOn(confirmService, 'confirm').andReturn(confirmDeferred.promise);
        spyOn(stateTrackerService, 'goToPreviousState').andCallFake(loadingDeferred.resolve);
        spyOn(facilityService, 'save').andReturn(saveDeferred.promise);
        spyOn($state, 'go');
        spyOn(loadingModalService, 'open').andReturn(loadingDeferred.promise);
        spyOn(loadingModalService, 'close').andCallFake(loadingDeferred.resolve);
        spyOn(notificationService, 'success');
        spyOn(notificationService, 'error');
        spyOn(messageService, 'get').andCallFake(function(key, param) {
            if (key === 'adminFacilityAdd.doYouWantToAddPrograms') {
                return 'Do you want to add programs to ' + param.facility + '?';
            }
        });

        vm = $controller('FacilityAddController', {
            facility: facility,
            facilityTypes: facilityTypes,
            geographicZones: geographicZones,
            facilityOperators: facilityOperators
        });
        vm.$onInit();

        $rootScope.$apply();
    }

});
