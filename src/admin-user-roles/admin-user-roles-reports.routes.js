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

    angular
        .module('admin-user-roles')
        .config(routes);

    routes.$inject = ['$stateProvider', 'ADMINISTRATION_RIGHTS', 'ROLE_TYPES'];

    function routes($stateProvider, ADMINISTRATION_RIGHTS, ROLE_TYPES) {

        $stateProvider.state('openlmis.administration.users.roles.' + ROLE_TYPES.REPORTS, {
            label: ROLE_TYPES.getLabel(ROLE_TYPES.REPORTS),
            url: '/reports?page&size',
            accessRights: [ADMINISTRATION_RIGHTS.USERS_MANAGE],
            controller: 'UserRolesTabController',
            templateUrl: 'admin-user-roles/user-roles-tab.html',
            controllerAs: 'vm',
            resolve: {
                tab: function(ROLE_TYPES) {
                    return ROLE_TYPES.REPORTS;
                },
                roleAssignments: function(paginationService, $stateParams, user, tab) {
                    return paginationService.registerList(null, $stateParams, function() {
                        var filtered = user.roleAssignments.filter(function(role) {
                            return role.type === tab;
                        });

                        return filtered.sort(function(a, b) {
                            return (a.roleName > b.roleName) ? 1 : ((b.roleName > a.roleName) ? -1 : 0);
                        });
                    });
                },
                filteredRoles: function(roles, tab) {
                    return roles.filter(function(role) {
                        return role.type === tab;
                    });
                }
            }
        });
    }
})();