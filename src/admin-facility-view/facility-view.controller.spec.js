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

describe('FacilityViewController', function () {

    var $q, $rootScope, $state, $controller, loadingModalService, confirmService, notificationService, facilityService, facilitySavePromise, loadingModalPromise,
        vm, facility, facilityTypes, geographicZones, facilityOperators, programs;

    beforeEach(function() {
        module('admin-facility-view', function($provide) {
            facilityService = jasmine.createSpyObj('facilityService', ['save']);
            $provide.service('facilityService', function() {
                return facilityService;
            });

            loadingModalService = jasmine.createSpyObj('loadingModalService', ['open', 'close']);
            $provide.service('loadingModalService', function() {
                return loadingModalService;
            });
        });

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
            confirmService = $injector.get('confirmService');
            notificationService = $injector.get('notificationService');
        });

        facilitySavePromise = $q.defer();
        facilityService.save.andReturn(facilitySavePromise.promise);

        loadingModalPromise = $q.defer();
        loadingModalService.open.andReturn(loadingModalPromise.promise);

        spyOn(confirmService, 'confirm').andReturn($q.when(true));
        spyOn(notificationService, 'success').andReturn(true);
        spyOn(notificationService, 'error').andReturn(true);
        spyOn($state, 'go').andReturn();

        facilityTypes = [
            {
                id: 'type-1-id',
                name: 'type-1'
            },
            {
                id: 'type-2-id',
                name: 'type-2'
            }
        ];

        geographicZones = [
            {
                id: 'zone-1-id',
                name: 'zone-1'
            },
            {
                id: 'zone-2-id',
                name: 'zone-2'
            }
        ];

        facilityOperators = [
            {
                id: 'operator-1-id',
                name: 'operator-1'
            },
            {
                id: 'operator-2-id',
                name: 'operator-2'
            }
        ];

        programs = [
            {
                id: 'program-1-id',
                name: 'program-1'
            },
            {
                id: 'program-2-id',
                name: 'program-2'
            }
        ];

        facility = {
            id: 'facility-id',
            name: 'facility-name',
            type: facilityTypes[0]
        };

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

        it('should expose saveFacilitySupportedPrograms method', function() {
            expect(angular.isFunction(vm.saveFacilitySupportedPrograms)).toBe(true);
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
    });

    describe('goToFacilityList', function() {

        it('should call state go with correct params', function() {
            vm.goToFacilityList();
            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });
    });

    describe('saveFacility', function() {

        it('should call confirm service', function() {
            vm.saveFacilityDetails();
            expect(confirmService.confirm).toHaveBeenCalledWith({
                messageKey: 'adminFacilityView.saveFacility.confirm',
                messageParams: {
                    facility: vm.facility.name
                }
            }, 'adminFacilityView.save');
        });

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
            facilitySavePromise.reject();
            vm.saveFacilityDetails();
            $rootScope.$apply();
            expect(loadingModalService.close).toHaveBeenCalled();
            expect(notificationService.error).toHaveBeenCalledWith('adminFacilityView.saveFacility.fail');
        });

        it('should go to facility list after successful save', function() {
            facilitySavePromise.resolve(vm.facility);
            vm.saveFacilityDetails();
            $rootScope.$apply();
            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should show success notification after successful save', function() {
            facilitySavePromise.resolve(vm.facility);
            loadingModalPromise.resolve();
            vm.saveFacilityDetails();
            $rootScope.$apply();
            expect(notificationService.success).toHaveBeenCalledWith('adminFacilityView.saveFacility.success');
        });
    });
});
