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
     * @name admin-user-roles.userRoleAssignmentFactory
     *
     * @description
     * Allows the user to retrieve roles with additional info.
     */
    angular
        .module('admin-user-roles')
        .factory('userRoleAssignmentFactory', factory);

    factory.$inject = ['$filter'];

    function factory($filter) {

        return {
            addInfoToRoleAssignments: addInfoToRoleAssignments
        };

        /**
         * @ngdoc method
         * @methodOf admin-user-roles.userRoleAssignmentFactory
         * @name addInfoToRoleAssignments
         *
         * @description
         * Adds role type property to user role assignments based on given roles.
         *
         * @param {Array} roleAssignments array of role assignments
         * @param {Array} roles           array of roles
         */
        function addInfoToRoleAssignments(roleAssignments, roles, programs, supervisoryNodes, warehouses) {
            angular.forEach(roleAssignments, function(roleAssignment) {
                var filtered = $filter('filter')(roles, {
                    id: roleAssignment.roleId
                }, true);
                if(filtered.length > 0) {
                    roleAssignment.$type = filtered[0].rights[0].type;
                    roleAssignment.$roleName = filtered[0].name;
                } else {
                    roleAssignment.$type = '';
                    roleAssignment.$roleName = '';
                }

                if(roleAssignment.programCode) {
                    filtered = $filter('filter')(programs, {
                        code: roleAssignment.programCode
                    }, true);
                    if(filtered.length > 0) {
                        roleAssignment.$programName = filtered[0].name;
                    } else {
                        roleAssignment.$programName = '';
                    }
                }

                if(roleAssignment.supervisoryNodeCode) {
                    filtered = $filter('filter')(supervisoryNodes, {
                        code: roleAssignment.supervisoryNodeCode
                    }, true);
                    if(filtered.length > 0) {
                        roleAssignment.$supervisoryNodeName = filtered[0].$display;
                    } else {
                        roleAssignment.$supervisoryNodeName = '';
                    }
                }

                if(roleAssignment.warehouseCode) {
                    filtered = $filter('filter')(warehouses, {
                        code: roleAssignment.warehouseCode
                    }, true);
                    if(filtered.length > 0) {
                        roleAssignment.$warehouseName = filtered[0].name;
                    } else {
                        roleAssignment.$warehouseName = '';
                    }
                }
            });
        }
    }
})();
