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
        'modalDeferred', '$filter', 'ROLE_TYPES', '$q', 'messageService', 'newRoleAssignment'
    ];

    function controller(user, supervisoryNodes, programs, warehouses, roles,
                        modalDeferred, $filter, ROLE_TYPES, $q, messageService, newRoleAssignment) {

        var vm = this;

        vm.$onInit = onInit;
        vm.addRole = addRole;
        vm.loadRoles = loadRoles;
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
         * @name newRoleAssignment
         * @type {Object}
         *
         * @description
         * Contains all selected properties of new role assignment.
         */
        vm.newRoleAssignment = undefined;

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
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserAddRoleModalController
         * @name supervisionFields
         * @type {Array}
         *
         * @description
         * List of fields for supervision role.
         */
        vm.supervisionFields = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserAddRoleModalController
         * @name requiredSupervisionField
         * @type {Array}
         *
         * @description
         * Indicates which field will be required for supervision role.
         */
        vm.requiredSupervisionField = undefined;

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
            vm.user = user;
            vm.supervisoryNodes = supervisoryNodes;
            vm.programs = programs;
            vm.warehouses = warehouses;
            vm.newRoleAssignment = newRoleAssignment;
            vm.types = ROLE_TYPES;
            vm.supervisionFields = [
                {
                    value: 'supervisoryNode',
                    message: messageService.get('adminUserForm.supervisoryNode')
                },
                {
                    value: 'program',
                    message: messageService.get('adminUserForm.program')
                }
            ];
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserAddRoleModalController
         * @name loadRoles
         *
         * @description
         * Filters roles with the given role type.
         */
        function loadRoles(shouldNotClear) {
            if(!shouldNotClear) vm.newRoleAssignment.role = undefined;
            vm.filteredRoles = $filter('filter')(vm.roles, {
                $type: vm.newRoleAssignment.type
            }, true);
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
            return vm.newRoleAssignment.type === ROLE_TYPES.SUPERVISION;
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
            return vm.newRoleAssignment.type === ROLE_TYPES.ORDER_FULFILLMENT;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserAddRoleModalController
         * @name addRole
         *
         * @description
         * Creates new role assignment for user.
         *
         * @return {Promise} the new created role assignment
         */
        function addRole() {
            var deferred = $q.defer(),
                invalidMessage = isNewRoleInvalid();

            if(!invalidMessage) {
                var roleAssignment = {
                    roleId: vm.newRoleAssignment.role.id
                };
                if(isSupervisionType()) {
                    roleAssignment.supervisoryNodeCode = vm.newRoleAssignment.supervisoryNode;
                    roleAssignment.programCode = vm.newRoleAssignment.program;
                } else if(isFulfillmentType()) {
                    roleAssignment.warehouseCode = vm.newRoleAssignment.warehouse;
                }
                deferred.resolve();
                modalDeferred.resolve(roleAssignment);
            } else {
                deferred.reject({
                    data: {
                        message: messageService.get(invalidMessage),
                        messageKey: invalidMessage
                    }
                });
            }

            return deferred.promise;
        }

        function isNewRoleInvalid() {
            if(roleAlreadyAssigned()) return 'adminUserForm.roleAlreadyAssigned';
            if(isSupervisionType() && !(vm.newRoleAssignment.supervisoryNode || vm.newRoleAssignment.program)) return 'adminUserForm.supervisionInvalid';
            else if(isFulfillmentType() && !vm.newRoleAssignment.warehouse) return 'adminUserForm.fulfillmentInvalid';
            return undefined;
        }

        function roleAlreadyAssigned() {
            if(!vm.newRoleAssignment.role) return false;
            var alreadyExist = false;
            angular.forEach(vm.user.roleAssignments, function(role) {
                var isEqual = vm.newRoleAssignment.role.id === role.roleId;
                if(isSupervisionType()) {
                    isEqual = isEqual &&
                        vm.newRoleAssignment.supervisoryNode === role.supervisoryNodeCode &&
                        vm.newRoleAssignment.program === role.programCode;
                }
                else if(isFulfillmentType()) {
                    isEqual = isEqual &&
                        vm.newRoleAssignment.warehouse === role.warehouseCode;
                }
                alreadyExist = alreadyExist || isEqual;
            });
            return alreadyExist;
        }
    }
})();
