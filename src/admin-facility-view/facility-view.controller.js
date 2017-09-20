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
     * @name admin-facility-view.controller:FacilityViewController
     *
     * @description
     * Controller for managing facility view screen.
     */
    angular
        .module('admin-facility-view')
        .controller('FacilityViewController', controller);

    controller.$inject = [
        '$state', 'facility', 'facilityTypes', 'geographicZones', 'facilityOperators',
        'facilityService', 'confirmService', 'loadingModalService', 'notificationService'
    ];

    function controller($state, facility, facilityTypes, geographicZones, facilityOperators,
        facilityService, confirmService, loadingModalService, notificationService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToFacilityList = goToFacilityList;
        vm.saveFacility = saveFacility;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name facility
         * @type {Object}
         *
         * @description
         * Contains facility object.
         */
        vm.facility = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name facilityTypes
         * @type {Array}
         *
         * @description
         * Contains all facility types.
         */
        vm.facilityTypes = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name geographicZones
         * @type {Array}
         *
         * @description
         * Contains all geographic zones.
         */
        vm.geographicZones = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name facilityOperators
         * @type {Array}
         *
         * @description
         * Contains all facility operators.
         */
        vm.facilityOperators = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name selectedTab
         * @type {String}
         *
         * @description
         * Contains currently selected tab.
         */
        vm.selectedTab = undefined;

        /**
         * @ngdoc method
         * @propertyOf admin-facility-view.controller:FacilityViewController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating FacilityListController.
         */
        function onInit() {
            vm.facility = facility;
            vm.facilityTypes = facilityTypes;
            vm.geographicZones = geographicZones;
            vm.facilityOperators = facilityOperators;
            vm.selectedTab = 0;
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-list.controller:FacilityListController
         * @name goToFacilityList
         *
         * @description
         * Redirects to facility list screen.
         */
        function goToFacilityList() {
            $state.go('^', {}, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-facility-list.controller:FacilityListController
         * @name saveFacility
         *
         * @description
         * Saves facility and redirects to facility list screen.
         */
        function saveFacility() {
            var message = {
                    messageKey: 'adminFacilityView.saveFacility.confirm',
                    messageParams: {
                        facility: vm.facility.name
                    }
                };
            confirmService.confirm(message, 'adminFacilityView.save')
            .then(function() {
                var loadingPromise = loadingModalService.open();
                facilityService.save(vm.facility)
                .then(function() {
                    loadingPromise.then(function() {
                        notificationService.success('adminFacilityView.saveFacility.success');
                    });
                    goToFacilityList();
                }).catch(function() {
                    loadingModalService.close();
                    notificationService.error('adminFacilityView.saveFacility.fail');
                });
            });
        }
    }
})();
