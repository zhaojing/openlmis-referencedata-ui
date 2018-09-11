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

describe('FacilityViewController', function() {

    var $q, $rootScope, $state, $controller, loadingModalService, notificationService,
        facilityService, loadingModalPromise, vm, facility, facilityTypes, geographicZones,
        facilityOperators, programs, FacilityTypeDataBuilder, GeographicZoneDataBuilder,
        FacilityOperatorDataBuilder, ProgramDataBuilder, FacilityDataBuilder;

    beforeEach(function() {
        module('admin-facility-view');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
            notificationService = $injector.get('notificationService');
            loadingModalService = $injector.get('loadingModalService');
            facilityService = $injector.get('facilityService');
            FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            GeographicZoneDataBuilder = $injector.get('GeographicZoneDataBuilder');
            FacilityOperatorDataBuilder = $injector.get('FacilityOperatorDataBuilder');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
        });

        spyOn(facilityService, 'save').andReturn($q.when());

        loadingModalPromise = $q.defer();
        spyOn(loadingModalService, 'close').andCallFake(loadingModalPromise.resolve);
        spyOn(loadingModalService, 'open').andReturn(loadingModalPromise.promise);

        spyOn(notificationService, 'success').andReturn(true);
        spyOn(notificationService, 'error').andReturn(true);
        spyOn($state, 'go').andCallFake(loadingModalPromise.resolve);

        facilityTypes = [
            new FacilityTypeDataBuilder().build(),
            new FacilityTypeDataBuilder().build()
        ];

        geographicZones = [
            new GeographicZoneDataBuilder().build(),
            new GeographicZoneDataBuilder().build()
        ];

        facilityOperators = [
            new FacilityOperatorDataBuilder().build(),
            new FacilityOperatorDataBuilder().build()
        ];

        programs = [
            new ProgramDataBuilder().build(),
            new ProgramDataBuilder().build()
        ];

        facility = new FacilityDataBuilder().withFacilityType(facilityTypes[0])
            .build();

        vm = $controller('FacilityViewController', {
            facility: facility,
            facilityTypes: facilityTypes,
            geographicZones: geographicZones,
            facilityOperators: facilityOperators,
            programs: programs
        });
        vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose goToFacilityList method', function() {
            expect(angular.isFunction(vm.goToFacilityList)).toBe(true);
        });

        it('should expose saveFacility method', function() {
            expect(angular.isFunction(vm.saveFacilityDetails)).toBe(true);
        });

        it('should expose facility', function() {
            expect(vm.facility).toEqual(facility);
        });

        it('should expose facilityTypes list', function() {
            expect(vm.facilityTypes).toEqual(facilityTypes);
        });

        it('should expose geographicZones list', function() {
            expect(vm.geographicZones).toEqual(geographicZones);
        });

        it('should expose facilityOperators list', function() {
            expect(vm.facilityOperators).toEqual(facilityOperators);
        });

        it('should expose program list', function() {
            expect(vm.programs).toEqual(programs);
        });

        it('should expose supported programs list', function() {
            expect(vm.facilityWithPrograms.supportedPrograms).toEqual([]);
        });

        it('should expose supported programs list as empty list if undefined', function() {
            vm.facility.supportedPrograms = undefined;
            vm.$onInit();

            expect(vm.facilityWithPrograms.supportedPrograms).toEqual([]);
        });
    });

    describe('goToFacilityList', function() {

        it('should call state go with correct params', function() {
            vm.goToFacilityList();
            expect($state.go).toHaveBeenCalledWith('openlmis.administration.facilities', {}, {
                reload: true
            });
        });
    });

    describe('saveFacility', function() {

        it('should open loading modal', function() {
            vm.saveFacilityDetails();
            $rootScope.$apply();
            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should call facilityService save method', function() {
            vm.saveFacilityDetails();
            $rootScope.$apply();
            expect(facilityService.save).toHaveBeenCalledWith(vm.facility);
        });

        it('should close loading modal and show error notification after save fails', function() {
            facilityService.save.andReturn($q.reject());
            vm.saveFacilityDetails();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
            expect(notificationService.error).toHaveBeenCalledWith('adminFacilityView.saveFacility.fail');
        });

        it('should go to facility list after successful save', function() {
            vm.saveFacilityDetails();
            $rootScope.$apply();
            expect($state.go).toHaveBeenCalledWith('openlmis.administration.facilities', {}, {
                reload: true
            });
        });

        it('should show success notification after successful save', function() {
            vm.saveFacilityDetails();
            $rootScope.$apply();
            expect(notificationService.success).toHaveBeenCalledWith('adminFacilityView.saveFacility.success');
        });
    });

    describe('addProgram', function() {

        beforeEach(function() {
            vm.facilityWithPrograms = {};
            vm.facilityWithPrograms.supportedPrograms = [];
        });

        it('should add supported program to the list', function() {
            vm.selectedProgram = vm.programs[0];
            vm.selectedStartDate = new Date('08/10/2017');

            var program = vm.selectedProgram;

            vm.addProgram();

            expect(vm.facilityWithPrograms.supportedPrograms[0])
                .toEqual(angular.extend({}, program, {
                    supportStartDate: new Date('08/10/2017'),
                    supportActive: true
                }));
        });

        it('should clear selections', function() {
            vm.selectedProgram = vm.programs[0];
            vm.selectedStartDate = new Date('08/10/2017');

            vm.addProgram();

            vm.selectedProgram = undefined;
            vm.selectedStartDate = undefined;
        });

    });
});
