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

    var vm, $rootScope, $scope, facility, facilityTypes, geographicZones,
        facilityOperators, confirmService, confirmDeferred, facilityService, stateTrackerService,
        saveDeferred, $state, loadingModalService, loadingDeferred, notificationService,
        messageService;

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

        beforeEach(function() {
            vm.facility.code = 'FC01';
            vm.facility.name = 'Some Facility';
            vm.facility.type = facilityTypes[0];
            vm.facility.geographicZone = geographicZones[0];
            vm.facility.description = 'Some Description';
            vm.facility.operator = facilityOperators[0];
        });

        it('should prompt user to add programs', function() {
            vm.save();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'Do you want to add programs to Some Facility?',
                'adminFacilityAdd.addPrograms',
                'adminFacilityAdd.cancel'
            );
        });

        it('should not save facility unless user refuses to add programs', function() {
            vm.save();

            confirmDeferred.reject();
            $rootScope.$apply();

            expect(facilityService.save).toHaveBeenCalledWith(vm.facility);
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
            vm.save();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalledWith(
                'openlmis.administration.facilities.facility.programs', {
                    facility: vm.facility
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
        });

        facility = {
            id: 'some-facility-id',
            enabled: true,
            active: true
        };

        facilityTypes = [{
            id: 'e2faaa9e-4b2d-4212-bb60-fd62970b2113',
            name: 'Warehouse'
        }, {
            id: 'ac1d268b-ce10-455f-bf87-9c667da8f060',
            name: 'Health Center'
        }, {
            id: '663b1d34-cc17-4d60-9619-e553e45aa441',
            name: 'District Hospital'
        }];

        geographicZones = [{
            name: 'Malawi',
            id: '4e471242-da63-436c-8157-ade3e615c848'
        }, {
            name: 'Central Region',
            id: '58d51132-de7d-49f6-ba8d-fd2b5673c3ff'
        }, {
            name: 'Northern Region',
            id: '3daa08a2-69d4-40e8-8af1-e08e894f6b19'
        }];

        facilityOperators = [{
            "id": "9456c3e9-c4a6-4a28-9e08-47ceb16a4121",
            "name": "Ministry of Health"
        }, {
            "id": "1074353d-7364-4618-a127-708d7303a231",
            "name": "Doctors Without Borders"
        }];

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
