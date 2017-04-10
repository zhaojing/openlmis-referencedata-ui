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
        .module('admin-user-form')
        .factory('UserAddRoleModal', userPasswordModalFactory);

    userPasswordModalFactory.$inject = ['openlmisModalService'];

    function userPasswordModalFactory(openlmisModalService) {

        return UserAddRoleModal;

        function UserAddRoleModal(user, supervisoryNodes, programs, warehouses, roles) {
            var persistent = {
                    user: user,
                    newRoleAssignment: {
                        role: undefined,
                        warehouse: undefined,
                        program: undefined,
                        supervisoryNode: undefined,
                        type: undefined
                    }
                };

            return openlmisModalService.createDialog({
                controller: 'UserAddRoleModalController',
                controllerAs: 'vm',
                templateUrl: 'admin-user-form/user-add-role-modal.html',
                show: true,
                resolve: {
                    user: function() {
                        return persistent.user;
                    },
                    supervisoryNodes: function() {
                        return supervisoryNodes;
                    },
                    programs: function() {
                        return programs;
                    },
                    warehouses: function() {
                        return warehouses;
                    },
                    roles: function() {
                        return roles;
                    },
                    newRoleAssignment: function() {
                        return persistent.newRoleAssignment;
                    }
                }
            }).promise.finally(function() {
                persistent = undefined;
            });
        }
    }
})();
