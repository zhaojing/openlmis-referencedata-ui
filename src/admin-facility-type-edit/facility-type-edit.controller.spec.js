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

describe('FacilityTypeEditController', function() {

    var $controller, $rootScope, $q, confirmService, stateTrackerService, facilityTypeService, loadingModalService,
        notificationService, FacilityTypeDataBuilder, vm, facilityType, confirmDeferred, saveDeferred;

    beforeEach(function() {
        module('admin-facility-type-edit');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            confirmService = $injector.get('confirmService');
            $q = $injector.get('$q');
            facilityTypeService = $injector.get('facilityTypeService');
            stateTrackerService = $injector.get('stateTrackerService');
            loadingModalService = $injector.get('loadingModalService');
            notificationService = $injector.get('notificationService');
            FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
        });

        facilityType = new FacilityTypeDataBuilder().build();

        confirmDeferred = $q.defer();
        saveDeferred = $q.defer();

        spyOn(confirmService, 'confirm').andReturn(confirmDeferred.promise);
        spyOn(stateTrackerService, 'goToPreviousState').andReturn(true);
        spyOn(facilityTypeService, 'update').andReturn(saveDeferred.promise);
        spyOn(facilityTypeService, 'create').andReturn(saveDeferred.promise);
        spyOn(loadingModalService, 'open').andReturn(true);
        spyOn(loadingModalService, 'close').andReturn(true);
        spyOn(notificationService, 'success');
        spyOn(notificationService, 'error');

        vm = $controller('FacilityTypeEditController', {
            facilityType: facilityType
        });
        vm.$onInit();
    });

    describe('$onInit', function() {

        it('should expose facilityType', function() {
            expect(vm.facilityType).toEqual(facilityType);
        });

        it('should expose resolved fields', function() {
            expect(vm.editMode).toEqual(true);
        });

        it('should expose default field values', function() {
            vm = $controller('FacilityTypeEditController', {
                facilityType: undefined
            });
            vm.$onInit();

            expect(vm.editMode).toEqual(false);
            expect(vm.facilityType).toEqual({
                displayOrder: 1,
                active: true
            });
        });
    });

    describe('save', function() {

        it('should reload state after successful save', function() {
            vm.save();

            confirmDeferred.resolve();
            saveDeferred.resolve(facilityType);
            $rootScope.$apply();

            expect(stateTrackerService.goToPreviousState).toHaveBeenCalled();
        });

        describe('while editing', function() {

            beforeEach(function() {
                vm.editMode = true;
            });

            it('should prompt user to save period', function() {
                vm.save();

                expect(confirmService.confirm).toHaveBeenCalledWith(
                    'adminFacilityTypeEdit.save.question',
                    'adminFacilityTypeEdit.save'
                );
            });

            it('should not save facility type if user does not confirm it', function() {
                vm.save();

                confirmDeferred.reject();
                $rootScope.$apply();

                expect(facilityTypeService.update).not.toHaveBeenCalled();
                expect(facilityTypeService.create).not.toHaveBeenCalled();
            });

            it('should save facility type and open loading modal after confirm', function() {
                vm.save();

                confirmDeferred.resolve();
                $rootScope.$apply();

                expect(facilityTypeService.update).toHaveBeenCalledWith(vm.facilityType);
                expect(facilityTypeService.create).not.toHaveBeenCalled();
                expect(loadingModalService.open).toHaveBeenCalled();
            });

            it('should show notification if facility type was saveed successfully', function() {
                vm.save();

                confirmDeferred.resolve();
                saveDeferred.resolve(facilityType);
                $rootScope.$apply();

                expect(notificationService.success).toHaveBeenCalledWith('adminFacilityTypeEdit.save.success');
            });

            it('should show notification if period save has failed', function() {
                vm.save();

                confirmDeferred.resolve();
                saveDeferred.reject();
                $rootScope.$apply();

                expect(notificationService.error).toHaveBeenCalledWith('adminFacilityTypeEdit.save.failure');
                expect(loadingModalService.close).toHaveBeenCalled();
            });
        });

        describe('while creating', function() {

            beforeEach(function() {
                vm.editMode = false;
            });

            it('should prompt user to save period', function() {
                vm.save();

                expect(confirmService.confirm).toHaveBeenCalledWith(
                    'adminFacilityTypeEdit.create.question',
                    'adminFacilityTypeEdit.create'
                );
            });

            it('should not save facility type if user does not confirm it', function() {
                vm.save();

                confirmDeferred.reject();
                $rootScope.$apply();

                expect(facilityTypeService.create).not.toHaveBeenCalled();
                expect(facilityTypeService.update).not.toHaveBeenCalled();
            });

            it('should save facility type and open loading modal after confirm', function() {
                vm.save();

                confirmDeferred.resolve();
                $rootScope.$apply();

                expect(facilityTypeService.create).toHaveBeenCalledWith(vm.facilityType);
                expect(facilityTypeService.update).not.toHaveBeenCalled();
                expect(loadingModalService.open).toHaveBeenCalled();
            });

            it('should show notification if facility type was saveed successfully', function() {
                vm.save();

                confirmDeferred.resolve();
                saveDeferred.resolve(facilityType);
                $rootScope.$apply();

                expect(notificationService.success).toHaveBeenCalledWith('adminFacilityTypeEdit.create.success');
            });

            it('should show notification if period save has failed', function() {
                vm.save();

                confirmDeferred.resolve();
                saveDeferred.reject();
                $rootScope.$apply();

                expect(notificationService.error).toHaveBeenCalledWith('adminFacilityTypeEdit.create.failure');
                expect(loadingModalService.close).toHaveBeenCalled();
            });
        });
    });

    describe('goToPreviousState', function() {

        it('should redirect to Facility Type List screen', function() {
            vm.goToPreviousState();

            expect(stateTrackerService.goToPreviousState).toHaveBeenCalled();
        });
    });
});
