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
     * @name admin-user-roles.controller:UserRolesController
     *
     * @description
     * Exposes method for adding/removing user roles.
     */
    angular
        .module('admin-user-roles')
        .controller('UserRolesController', controller);

        controller.$inject = [
            'user', 'supervisoryNodes', 'programs', 'roles', 'warehouses', '$filter', 'referencedataUserService',
            'loadingModalService', '$state', 'notificationService', 'ROLE_TYPES', '$scope', '$q', 'confirmService'
        ];

        function controller(user, supervisoryNodes, programs, roles, warehouses, $filter, referencedataUserService,
                            loadingModalService, $state, notificationService, ROLE_TYPES, $scope, $q, confirmService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.removeRole = removeRole;
        vm.addRole = addRole;
        vm.saveUserRoles = saveUserRoles;
        vm.isFulfillmentType = isFulfillmentType;
        vm.isSupervisionType = isSupervisionType;
        vm.goToUserList = goToUserList;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesController
         * @name user
         * @type {Object}
         *
         * @description
         * User object to be created/updated.
         */
        vm.user = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesController
         * @name roles
         * @type {Array}
         *
         * @description
         * List of all roles.
         */
        vm.roles = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesController
         * @name roles
         * @type {Array}
         *
         * @description
         * List of roles for given type.
         */
        vm.filteredRoles = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesController
         * @name supervisoryNodes
         * @type {Array}
         *
         * @description
         * List of all supervisory nodes.
         */
        vm.supervisoryNodes = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesController
         * @name warehouses
         * @type {Array}
         *
         * @description
         * List of all warehouses.
         */
        vm.warehouses = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesController
         * @name programs
         * @type {Array}
         *

         * @description
         * List of all programs.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesController
         * @name programs
         * @type {Array}
         *
         * @description
         * List of all supervisory nodes that were not assigned to user yet.
         */
        vm.unusedSupervisoryNodes = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesController
         * @name types
         * @type {Array}
         *
         * @description
         * List of all role types.
         */
        vm.types = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesController
         * @name selectedType
         * @type {Number}
         *
         * @description
         * Currently selected type.
         */
        vm.selectedType = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesController
         * @name selectedRole
         * @type {Object}
         *
         * @description
         * Contains selected role.
         */
        vm.selectedRole = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesController
         * @name selectedSupervisoryNode
         * @type {Object}
         *
         * @description
         * Contains selected supervisory node.
         */
        vm.selectedSupervisoryNode = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesController
         * @name selectedProgram
         * @type {Object}
         *
         * @description
         * Contains selected program.
         */
        vm.selectedProgram = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-roles.controller:UserRolesController
         * @name selectedWarehouse
         * @type {Object}
         *
         * @description
         * Contains selected warehouse.
         */
        vm.selectedWarehouse = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-user-roles.controller:UserRolesController
         * @name $onInit
         *
         * @description
         * Initialization method of the UserFormModalController.
         */
        function onInit() {
            vm.user = user;
            vm.roles = roles;
            vm.supervisoryNodes = supervisoryNodes;
            vm.warehouses = warehouses;
            vm.programs = programs;
            vm.types = ROLE_TYPES;
            vm.selectedType = 0;
            reloadTable();
            $scope.$watch(function() {
                return vm.selectedType;
            }, function(oldValue, newValue) {
                if(oldValue !== newValue) {
                    reloadTable();
                    clearSelectedValues();
                }
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-roles.controller:UserRolesController
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
         * @methodOf admin-user-roles.controller:UserRolesController
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
         * @methodOf admin-user-roles.controller:UserRolesController
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
                    roleAssignment.programCode = vm.selectedProgram.code;
                    roleAssignment.$programName = vm.selectedProgram.name;

                    if(vm.selectedSupervisoryNode) {
                        roleAssignment.supervisoryNodeCode = vm.selectedSupervisoryNode.code;
                        roleAssignment.$supervisoryNodeName = vm.selectedSupervisoryNode.$display;
                    }
                } else if(isFulfillmentType()) {
                    roleAssignment.warehouseCode = vm.selectedWarehouse.code;
                    roleAssignment.$warehouseName = vm.selectedWarehouse.name;
                }
                user.roleAssignments.push(roleAssignment);
                reloadTable();
                clearSelectedValues();
                deferred.resolve();
            } else {
                notificationService.error(invalidMessage);
                deferred.reject();
            }

            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-roles.controller:UserRolesController
         * @name removeRole
         *
         * @description
         * Removes role from user object.
         *
         * @param {Object} roleAssignment the role assignment to be removed
         */
        function removeRole(roleAssignment) {
            confirmService.confirmDestroy('adminUserRoles.removeRole.question', 'adminUserRoles.removeRole.label').then(function() {
                var index = vm.user.roleAssignments.indexOf(roleAssignment);
                if(index < 0) return;
                vm.user.roleAssignments.splice(index, 1);
                reloadTable();
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-roles.controller:UserRolesController
         * @name saveUserRoles
         *
         * @description
         * Updates user roles.
         */
        function saveUserRoles() {
            var loadingPromise = loadingModalService.open(true);

            return referencedataUserService.saveUser(vm.user).then(function() {
                loadingPromise.then(function() {
                    notificationService.success('adminUserRoles.updateSuccessful');
                });
                goToUserList();
            }, function() {
                notificationService.error('adminUserRoles.updateFailed');
            }).finally(loadingModalService.close);
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-roles.controller:UserRolesController
         * @name goToUserList
         *
         * @description
         * Redirects to user list.
         */
        function goToUserList() {
            $state.go('^', {}, {
                reload: true
            });
        }

        function getUnusedSupervisoryNodes() {
            var nodes = [];

            angular.forEach(vm.supervisoryNodes , function(node) {
                var filtered = $filter('filter')(vm.user.roleAssignments, {
                    supervisoryNodeCode: node.code
                });
                if(filtered.length < 1) nodes.push(node);
            });

            return nodes;
        }

        function reloadTable() {
            var groupedRoleAssignments = $filter('groupBy')(vm.user.roleAssignments, '$type');
            vm.filteredRoleAssignments = groupedRoleAssignments[vm.types[vm.selectedType].name];

            vm.filteredRoles = $filter('filter')(vm.roles, {
                $type: vm.types[vm.selectedType].name
            });

            vm.unusedSupervisoryNodes = getUnusedSupervisoryNodes();

            if(vm.warehouses.length === 1) vm.selectedWarehouse = vm.warehouses[0];
            if(vm.filteredRoles.length === 1) vm.selectedRole = vm.filteredRoles[0];
        }

        function clearSelectedValues() {
            vm.selectedProgram = undefined;
            vm.selectedSupervisoryNode = undefined;
            if(vm.warehouses.length !== 1) vm.selectedWarehouse = undefined;
            if(vm.filteredRoles.length !== 1) vm.selectedRole = undefined;
        }

        function isNewRoleInvalid() {
            if(roleAlreadyAssigned()) return 'adminUserRoles.roleAlreadyAssigned';
            if(isSupervisionType() && !vm.selectedProgram) return 'adminUserRoles.supervisionInvalid';
            else if(isFulfillmentType() && !vm.selectedWarehouse) return 'adminUserRoles.fulfillmentInvalid';
            return undefined;
        }

        function roleAlreadyAssigned() {
            if(!vm.selectedRole) return false;
            var alreadyExist = false;
            angular.forEach(vm.user.roleAssignments, function(role) {
                var isEqual = vm.selectedRole.id === role.roleId;
                if(isSupervisionType()) {
                    isEqual = isEqual &&
                        vm.selectedSupervisoryNode.code === role.supervisoryNodeCode &&
                        vm.selectedProgram.code === role.programCode;
                }
                else if(isFulfillmentType()) {
                    isEqual = isEqual &&
                        vm.selectedWarehouse.code === role.warehouseCode;
                }
                alreadyExist = alreadyExist || isEqual;
            });
            return alreadyExist;
        }
    }
})();
