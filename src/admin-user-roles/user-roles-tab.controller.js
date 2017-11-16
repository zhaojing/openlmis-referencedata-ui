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
        'user', 'supervisoryNodes', 'programs', 'roles', 'warehouses', '$stateParams', '$filter', '$q',
        '$state', 'notificationService', 'ROLE_TYPES', 'confirmService', 'filteredRoleAssignments'
    ];

    function controller(user, supervisoryNodes, programs, roles, warehouses, $stateParams, $filter, $q,
                        $state, notificationService, ROLE_TYPES, confirmService, filteredRoleAssignments) {

        var vm = this;

        vm.$onInit = onInit;
        vm.removeRole = removeRole;
        vm.addRole = addRole;
        vm.isFulfillmentType = isFulfillmentType;
        vm.isSupervisionType = isSupervisionType;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesTabController
         * @name roles
         * @type {Array}
         *
         * @description
         * List of all roles.
         */
        vm.roles = undefined;

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
         * @name types
         * @type {Array}
         *
         * @description
         * List of all role types.
         */
        vm.types = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesTabController
         * @name selectedType
         * @type {Number}
         *
         * @description
         * Currently selected type.
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
            vm.roles = roles;
            vm.supervisoryNodes = supervisoryNodes;
            vm.warehouses = warehouses;
            vm.programs = programs;
            vm.types = ROLE_TYPES;
            vm.selectedType = parseInt($stateParams.tab);

            vm.filteredRoleAssignments = filteredRoleAssignments;

            vm.filteredRoles = $filter('filter')(vm.roles, {
                $type: vm.types[vm.selectedType].name
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-roles.controller:UserRolesTabController
         * @name isSupervisionType
         *
         * @description
         * Checks if supervision tab is selected.
         */
        function isSupervisionType() {
            return vm.selectedType === 0;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-roles.controller:UserRolesTabController
         * @name isFulfillmentType
         *
         * @description
         * Checks if fulfillment tab is selected.
         */
        function isFulfillmentType() {
            return vm.selectedType === 1;
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
            var deferred = $q.defer(),
                invalidMessage = isNewRoleInvalid();

            if(!invalidMessage) {
                var roleAssignment = {
                    roleId: vm.selectedRole.id,
                    $roleName: vm.selectedRole.name,
                    $type: vm.types[vm.selectedType].name
                };
                if(isSupervisionType()) {
                    roleAssignment.programId = vm.selectedProgram.id;
                    roleAssignment.$programName = vm.selectedProgram.name;

                    if(vm.selectedSupervisoryNode) {
                        roleAssignment.supervisoryNodeId = vm.selectedSupervisoryNode.id;
                        roleAssignment.$supervisoryNodeName = vm.selectedSupervisoryNode.$display;
                    }
                } else if(isFulfillmentType()) {
                    roleAssignment.warehouseId = vm.selectedWarehouse.id;
                    roleAssignment.$warehouseName = vm.selectedWarehouse.name;
                }
                user.roleAssignments.push(roleAssignment);
                deferred.resolve();
                reloadState();
            } else {
                notificationService.error(invalidMessage);
                deferred.reject();
            }

            return deferred.promise;
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
            confirmService.confirmDestroy('adminUserRoles.removeRole.question', 'adminUserRoles.removeRole.label').then(function() {
                var index = user.roleAssignments.indexOf(roleAssignment);
                if(index < 0) return;
                user.roleAssignments.splice(index, 1);
                reloadState();
            });
        }

        function isNewRoleInvalid() {
            if(roleAlreadyAssigned()) return 'adminUserRoles.roleAlreadyAssigned';
            if(isSupervisionType() && !vm.selectedProgram) return 'adminUserRoles.supervisionInvalid';
            if(isSupervisionType() && !vm.selectedSupervisoryNode && !user.homeFacilityId) return 'adminUserRoles.homeFacilityRoleInvalid';
            else if(isFulfillmentType() && !vm.selectedWarehouse) return 'adminUserRoles.fulfillmentInvalid';
            return undefined;
        }

        function roleAlreadyAssigned() {
            if(!vm.selectedRole) return false;
            var alreadyExist = false;
            angular.forEach(user.roleAssignments, function(role) {
                var isEqual = vm.selectedRole.id === role.roleId;
                if(isSupervisionType()) {
                    isEqual = isEqual &&
                        vm.selectedProgram.id === role.programId;

                    if(role.supervisoryNodeId) {
                        if(vm.selectedSupervisoryNode){
                            isEqual = isEqual &&
                                vm.selectedSupervisoryNode.id === role.supervisoryNodeId;
                        } else {
                            isEqual = false;
                        }
                    } else if(vm.selectedSupervisoryNode) {
                        isEqual = false;
                    }
                }
                else if(isFulfillmentType()) {
                    isEqual = isEqual &&
                        vm.selectedWarehouse.id === role.warehouseId;
                }
                alreadyExist = alreadyExist || isEqual;
            });
            return alreadyExist;
        }

        function reloadState() {
            $state.go('openlmis.administration.users.roles.tab', $stateParams, {
				reload: 'openlmis.administration.users.roles.tab'
			});
        }
    }
})();
