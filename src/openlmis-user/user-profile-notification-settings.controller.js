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
     * @name openlmis-user.controller:UserProfileNotificationSettingsController
     *
     * @description
     * Allows user to see his notification settings.
     */
    angular
        .module('openlmis-user')
        .controller('UserProfileNotificationSettingsController', controller);

    controller.$inject = ['digestConfigurations'];

    function controller(digestConfigurations) {
        var vm = this;

        vm.$onInit = onInit;

        /**
         * @ngdoc property
         * @propertyOf openlmis-user.controller:UserProfileNotificationSettingsController
         * @type {Array}
         * @name digestConfigurations
         *
         * @description
         * The list of digest configurations available in the system.
         */
        vm.digestConfigurations = undefined;

        /**
         * @ngdoc method
         * @propertyOf openlmis-user.controller:UserProfileNotificationSettingsController
         * @name $onInit
         *
         * @description
         * Initialization method of the UserProfileNotificationSetttingsController.
         */
        function onInit() {
            vm.digestConfigurations = digestConfigurations;
        }
    }

})();
