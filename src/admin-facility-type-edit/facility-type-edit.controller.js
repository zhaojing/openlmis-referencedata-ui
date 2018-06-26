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
    * @name admin-facility-type-edit.controller:FacilityTypeEditController
    *
    * @description
    * Provides methods for Edit Facility Type modal. Allows returning to previous state and editing Facility Type.
    */
    angular
        .module('admin-facility-type-edit')
        .controller('FacilityTypeEditController', FacilityTypeEditController);

    FacilityTypeEditController.$inject = [
        'facilityType', 'confirmService', 'facilityTypeService', 'stateTrackerService',
        '$state', 'loadingModalService', 'notificationService'
    ];

    function FacilityTypeEditController(facilityType, confirmService, facilityTypeService, stateTrackerService,
                                        $state, loadingModalService, notificationService) {
        var vm = this;

        vm.save = save;
        vm.goToPreviousState = stateTrackerService.goToPreviousState;
        vm.$onInit = onInit;

        /**
         * @ngdoc property
         * @methodOf admin-facility-type-edit.controller:FacilityTypeEditController
         * @name facilityType
         * @type {Object}
         *
         * @description
         * Current Facility Type.
         */
        vm.facilityType = undefined;

        /**
         * @ngdoc property
         * @methodOf admin-facility-type-edit.controller:FacilityTypeEditController
         * @name editMode
         * @type {boolean}
         *
         * @description
         * Indicates if facility type is already created.
         */
        vm.editMode = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-facility-type-edit.controller:FacilityTypeEditController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating FacilityTypeEditController.
         */
        function onInit() {
            vm.facilityType = facilityType ? facilityType : {
                displayOrder: 1,
                active: true
            };
            vm.editMode = !!facilityType;
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-type-edit.controller:FacilityTypeEditController
         * @name save
         *
         * @description
         * Saves the Facility Type after confirm.
         */
        function save() {
            confirmService.confirm(
                vm.editMode ? 'adminFacilityTypeEdit.save.question' : 'adminFacilityTypeEdit.create.question',
                vm.editMode ? 'adminFacilityTypeEdit.save' : 'adminFacilityTypeEdit.create'
            ).then(function() {
                loadingModalService.open();
                getSavePromise()
                    .then(function() {
                        notificationService.success(vm.editMode ?
                            'adminFacilityTypeEdit.save.success' : 'adminFacilityTypeEdit.create.success');
                        stateTrackerService.goToPreviousState();
                    })
                    .catch(function() {
                        loadingModalService.close();
                        notificationService.error(
                            vm.editMode ? 'adminFacilityTypeEdit.save.failure' : 'adminFacilityTypeEdit.create.failure'
                        );
                    });
            });
        }

        function getSavePromise() {
            return vm.editMode ?
                facilityTypeService.update(vm.facilityType) :
                facilityTypeService.create(vm.facilityType);
        }
    }
})();
