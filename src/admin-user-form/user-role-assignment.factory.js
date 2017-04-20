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
     * @ngdoc service
     * @name admin-user-form.userRoleAssignmentFactory
     *
     * @description
     * Allows the user to retrieve roles with additional info.
     */
    angular
        .module('admin-user-form')
        .factory('userRoleAssignmentFactory', factory);

    factory.$inject = ['$filter'];

    function factory($filter) {

        return {
            addInfoToRoleAssignments: addInfoToRoleAssignments
        };

        /**
         * @ngdoc method
         * @methodOf admin-user-form.userRoleAssignmentFactory
         * @name addInfoToRoleAssignments
         *
         * @description
         * Adds role type property to user role assignments based on given roles.
         *
         * @param {Array} roleAssignments array of role assignments
         * @param {Array} roles           array of roles
         */
        function addInfoToRoleAssignments(roleAssignments, roles) {
            angular.forEach(roleAssignments, function(roleAssignment) {
                var filteredRoles = $filter('filter')(roles, {
                    id: roleAssignment.roleId
                }, true);
                if(filteredRoles.length > 0) {
                    roleAssignment.$type = filteredRoles[0].rights[0].type;
                    roleAssignment.$name = filteredRoles[0].name;
                } else {
                    roleAssignment.$type = '';
                    roleAssignment.$name = '';
                }
            });
        }
    }
})();
