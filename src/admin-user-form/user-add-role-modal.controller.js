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
     * @name admin-user-form.controller:UserAddRoleModalController
     *
     * @description
     * Manages user add role modal.
     */
    angular
        .module('admin-user-form')
        .controller('UserAddRoleModalController', controller);

    controller.$inject = [
        'user', 'supervisoryNodes', 'programs', 'warehouses', 'roles',
        'modalDeferred', '$filter', 'ROLE_TYPES'
    ];

    function controller(user, supervisoryNodes, programs, warehouses, roles,
                        modalDeferred, $filter, ROLE_TYPES) {

        var vm = this;

        vm.$onInit = onInit;
        vm.addRole = addRole;
        vm.loadRoles = loadRoles;
        vm.isNewRoleInvalid = isNewRoleInvalid;
        vm.isSupervisionType = isSupervisionType;
        vm.isFulfillmentType = isFulfillmentType;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserAddRoleModalController
         * @name user
         * @type {Object}
         *
         * @description
         * User object with role assignments.
         */
        vm.user = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserAddRoleModalController
         * @name supervisoryNodes
         * @type {Array}
         *
         * @description
         * List of all supervisory nodes.
         */
        vm.supervisoryNodes = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserAddRoleModalController
         * @name programs
         * @type {Array}
         *
         * @description
         * List of all programs.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserAddRoleModalController
         * @name warehouses
         * @type {Array}
         *
         * @description
         * List of all warehouses.
         */
        vm.warehouses = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserAddRoleModalController
         * @name roles
         * @type {Array}
         *
         * @description
         * List of all roles.
         */
        vm.roles = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserAddRoleModalController
         * @name types
         * @type {Array}
         *
         * @description
         * List of all role types.
         */
        vm.types = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserAddRoleModalController
         * @name supervisoryNodes
         * @type {Object}
         *
         * @description
         * Selected supervisory node code.
         */
        vm.supervisoryNode = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserAddRoleModalController
         * @name programs
         * @type {String}
         *
         * @description
         * Selected program code.
         */
        vm.program = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserAddRoleModalController
         * @name warehouses
         * @type {String}
         *
         * @description
         * Selected warehouse code.
         */
        vm.warehouse = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserAddRoleModalController
         * @name roles
         * @type {Object}
         *
         * @description
         * Selected role.
         */
        vm.role = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserAddRoleModalController
         * @name type
         * @type {String}
         *
         * @description
         * Selected role type.
         */
        vm.type = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserAddRoleModalController
         * @name filteredRoles
         * @type {Array}
         *
         * @description
         * List of roles filtered by selected role type.
         */
        vm.filteredRoles = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserAddRoleModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the UserPasswordModalController.
         */
        function onInit() {
            vm.roles = roles;
            angular.forEach(vm.roles, function(role) {
                role.$type = role.rights[0].type;
            });
            vm.user = user;
            vm.supervisoryNodes = supervisoryNodes;
            vm.programs = programs;
            vm.warehouses = warehouses;
            vm.types = ROLE_TYPES;
            vm.type = ROLE_TYPES.SUPERVISION;
            loadRoles();
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserAddRoleModalController
         * @name loadRoles
         *
         * @description
         * Filters roles with given role type.
         */
        function loadRoles() {
            vm.role = undefined;
            vm.filteredRoles = $filter('filter')(vm.roles, {
                $type: vm.type
            }, true);
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserAddRoleModalController
         * @name addRole
         *
         * @description
         * Adds new role to user.
         *
         * @return {Promise} the user with new role
         */
        function addRole() {
            if(!isNewRoleInvalid()) {
                var roleAssignment = {
                    roleId: vm.role.id
                }
                if(isSupervisionType()) {
                    roleAssignment.supervisoryNodeCode = vm.supervisoryNode;
                    roleAssignment.programCode = vm.program;
                } else if(isFulfillmentType()) {
                    roleAssignment.warehouseCode = vm.warehouse;
                }
                vm.user.roleAssignments.push(roleAssignment);
                modalDeferred.resolve(vm.user);
            }
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserAddRoleModalController
         * @name isNewRoleInvalid
         *
         * @description
         * Checks if currently selected values are already assigned as role to user
         * or if some fields are missing.
         *
         * @return {String} error message if new role is invalid, undefined otherwise
         */
        function isNewRoleInvalid() {
            if(roleAlreadyAssigned()) return 'adminUserForm.roleAlreadyAssigned';
            if(isSupervisionType() && !(vm.supervisoryNode || vm.program)) return 'adminUserForm.supervisionInvalid';
            else if(isFulfillmentType() && !vm.warehouse) return 'adminUserForm.fulfillmentInvalid';
            return undefined;
        }

        function roleAlreadyAssigned() {
            if(!vm.role) return false;
            var alreadyExist = false;
            angular.forEach(vm.user.roleAssignments, function(role) {
                var isEqual = vm.role.id === role.roleId;
                if(isSupervisionType()) {
                    isEqual = isEqual &&
                        vm.supervisoryNode === role.supervisoryNodeCode &&
                        vm.program === role.programCode;
                }
                else if(isFulfillmentType()) {
                    isEqual = isEqual &&
                        vm.warehouse === role.warehouseCode;
                }
                alreadyExist = alreadyExist || isEqual;
            });
            return alreadyExist;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserAddRoleModalController
         * @name isSupervisionType
         *
         * @description
         * Checks if supervisory nodes and programs selects should be displayed together with current role type.
         *
         * @return {Boolean} true if selects should be displayed, false otherwise
         */
        function isSupervisionType() {
            return vm.type === ROLE_TYPES.SUPERVISION;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserAddRoleModalController
         * @name isFulfillmentType
         *
         * @description
         * Checks if warehouses select should be displayed together with current role type.
         *
         * @return {Boolean} true if select should be displayed, false otherwise
         */
        function isFulfillmentType() {
            return vm.type === ROLE_TYPES.ORDER_FULFILLMENT;
        }
    }
})();
