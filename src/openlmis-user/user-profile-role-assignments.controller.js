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
     * @name openlmis-user.controller:UserProfileRoleAssignmentsController
     *
     * @description
     * Allows user to see his own role assignments info.
     */
    angular
        .module('openlmis-user')
        .controller('UserProfileRoleAssignmentsController', controller);

    controller.$inject = ['user', 'ROLE_TYPES'];

    function controller(user, ROLE_TYPES) {

        var vm = this;

        vm.$onInit = onInit;
        vm.getRoleTypeLabel = ROLE_TYPES.getLabel;

        /**
         * @ngdoc property
         * @propertyOf openlmis-user.controller:UserProfileRoleAssignmentsController
         * @name user
         * @type {Object}
         *
         * @description
         * Contains user detailed info.
         */
        vm.user = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-user.controller:UserProfileRoleAssignmentsController
         * @type {Array}
         * @name roleTypes
         *
         * @description
         * The list of all role types.
         */
        vm.roleTypes = undefined;

        /**
         * @ngdoc method
         * @propertyOf openlmis-user.controller:UserProfileRoleAssignmentsController
         * @name $onInit
         *
         * @description
         * Initialization method of the UserProfileRoleAssignmentsController.
         */
        function onInit() {
            vm.user = user;
            vm.roleTypes = ROLE_TYPES.getRoleTypes();
        }

    }

})();
