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
     * @name openlmis-user.controller:UserProfileRolesTabController
     *
     * @description
     * Exposes method for adding/removing user roles.
     */
    angular
        .module('openlmis-user')
        .controller('UserProfileRolesTabController', controller);

    controller.$inject = ['roleAssignments', 'roleRightsMap', 'typeNameFactory'];

    function controller(roleAssignments, roleRightsMap, typeNameFactory) {

        var vm = this;

        vm.$onInit = onInit;
        vm.getMessage = typeNameFactory.getMessage;

        /**
         * @ngdoc property
         * @propertyOf openlmis-user.controller:UserProfileRolesTabController
         * @name roles
         * @type {Array}
         *
         * @description
         * List of role assignments of the user.
         */
        vm.roleAssignments = undefined;

        /**
         * @ngdoc method
         * @methodOf openlmis-user.controller:UserProfileRolesTabController
         * @name $onInit
         *
         * @description
         * Initialization method of the UserProfileRolesTabController
         */
        function onInit() {
            vm.roleAssignments = roleAssignments;
            vm.showErrorColumn = roleAssignments.filter(function(role) {
                return role.errors && role.errors.length;
            }).length > 0;
            vm.roleRightsMap = roleRightsMap;
        }
    }
})();
