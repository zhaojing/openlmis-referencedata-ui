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
     * @name admin-user-roles.controller:UserRolesTabController
     *
     * @description
     * Exposes method for adding/removing user roles.
     */
    angular
        .module('admin-user-roles')
        .controller('UserRolesTabController', controller);

    controller.$inject = [
        'user', 'supervisoryNodes', 'programs', 'warehouses', '$stateParams', '$q', 'tab', 'ROLE_TYPES',
        '$state', 'notificationService', 'confirmService', 'filteredRoleAssignments', 'filteredRoles'
    ];

    function controller(user, supervisoryNodes, programs, warehouses, $stateParams, $q, tab, ROLE_TYPES,
                        $state, notificationService, confirmService, filteredRoleAssignments, filteredRoles) {

        var vm = this;

        vm.$onInit = onInit;
        vm.removeRole = removeRole;
        vm.addRole = addRole;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesTabController
         * @name roles
         * @type {Array}
         *
         * @description
         * List of roles for given type.
         */
        vm.filteredRoles = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesTabController
         * @name supervisoryNodes
         * @type {Array}
         *
         * @description
         * List of all supervisory nodes.
         */
        vm.supervisoryNodes = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesTabController
         * @name warehouses
         * @type {Array}
         *
         * @description
         * List of all warehouses.
         */
        vm.warehouses = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesTabController
         * @name programs
         * @type {Array}
         *

         * @description
         * List of all programs.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesTabController
         * @name selectedType
         * @type {String}
         *
         * @description
         * Currently selected role type.
         */
        vm.selectedType = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesTabController
         * @name selectedRole
         * @type {Object}
         *
         * @description
         * Contains selected role.
         */
        vm.selectedRole = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesTabController
         * @name selectedSupervisoryNode
         * @type {Object}
         *
         * @description
         * Contains selected supervisory node.
         */
        vm.selectedSupervisoryNode = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesTabController
         * @name selectedProgram
         * @type {Object}
         *
         * @description
         * Contains selected program.
         */
        vm.selectedProgram = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesTabController
         * @name selectedWarehouse
         * @type {Object}
         *
         * @description
         * Contains selected warehouse.
         */
        vm.selectedWarehouse = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-user-roles.controller:UserRolesTabController
         * @name $onInit
         *
         * @description
         * Initialization method of the UserFormModalController.
         */
        function onInit() {
            vm.supervisoryNodes = supervisoryNodes;
            vm.warehouses = warehouses;
            vm.programs = programs;
            vm.selectedType = tab;
            vm.filteredRoleAssignments = filteredRoleAssignments;
            vm.filteredRoles = filteredRoles;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-roles.controller:UserRolesTabController
         * @name addRole
         *
         * @description
         * Adds new role assignment to user object.
         *
         * @return {Promise} resolves if new role is valid
         */
        function addRole() {
            var invalidMessage = isNewRoleInvalid();

            if (!invalidMessage) {
                try {
                    user.addRoleAssignment(vm.selectedRole.id, vm.selectedRole.name, tab,
                        vm.selectedProgram && tab === ROLE_TYPES.SUPERVISION ? vm.selectedProgram.id : undefined,
                        vm.selectedProgram && tab === ROLE_TYPES.SUPERVISION ? vm.selectedProgram.name : undefined,
                        vm.selectedSupervisoryNode && tab === ROLE_TYPES.SUPERVISION ? vm.selectedSupervisoryNode.id : undefined,
                        vm.selectedSupervisoryNode && tab === ROLE_TYPES.SUPERVISION ? vm.selectedSupervisoryNode.$display : undefined,
                        vm.selectedWarehouse && tab === ROLE_TYPES.ORDER_FULFILLMENT ? vm.selectedWarehouse.id : undefined,
                        vm.selectedWarehouse && tab === ROLE_TYPES.ORDER_FULFILLMENT ? vm.selectedWarehouse.name : undefined);
                    reloadState();
                    return $q.resolve();
                }
                catch (err) {
                    invalidMessage = 'adminUserRoles.roleAlreadyAssigned';
                }
            }
            notificationService.error(invalidMessage);
            return $q.reject();
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-roles.controller:UserRolesTabController
         * @name removeRole
         *
         * @description
         * Removes role from user object.
         *
         * @param {Object} roleAssignment the role assignment to be removed
         */
        function removeRole(roleAssignment) {
            confirmService.confirmDestroy('adminUserRoles.removeRole.question', 'adminUserRoles.removeRole.label')
            .then(function() {
                user.removeRoleAssignment(roleAssignment);
                reloadState();
            });
        }

        function isNewRoleInvalid() {
            if (vm.selectedType === ROLE_TYPES.SUPERVISION && !vm.selectedSupervisoryNode && !user.homeFacilityId) return 'adminUserRoles.homeFacilityRoleInvalid';
            return undefined;
        }

        function reloadState() {
            $state.go('openlmis.administration.users.roles.' + tab, $stateParams, {
				reload: 'openlmis.administration.users.roles.' + tab
			});
        }
    }
})();
