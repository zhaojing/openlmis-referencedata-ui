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
     * @name admin-user-form.controller:UserFormController
     *
     * @description
     * Exposes method for creating/updating user to the modal view.
     */
    angular
        .module('admin-user-form')
        .controller('UserFormController', controller);

        controller.$inject = [
            'user', 'supervisoryNodes', 'programs', 'roles', 'warehouses', '$filter', 'referencedataUserService',
            'loadingModalService', '$state', 'notificationService', 'UserPasswordModal', 'authUserService', 'UserAddRoleModal'
        ];

        function controller(user, supervisoryNodes, programs, roles, warehouses, $filter, referencedataUserService,
                            loadingModalService, $state, notificationService, UserPasswordModal, authUserService, UserAddRoleModal) {

        var vm = this;

        vm.$onInit = onInit;
        vm.createUser = createUser;
        vm.getRoleName = getRoleName;
        vm.getProgramName = getProgramName;
        vm.getSupervisoryNodeName = getSupervisoryNodeName;
        vm.getWarehouseName = getWarehouseName;
        vm.removeRole = removeRole;
        vm.addRole = addRole;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserFormController
         * @name user
         * @type {Object}
         *
         * @description
         * User object to be created/updated.
         */
        vm.user = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserFormController
         * @name updateMode
         * @type {Boolean}
         *
         * @description
         * True if screen is in user update mode, false when create mode.
         */
        vm.updateMode = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserFormController
         * @name roles
         * @type {Array}
         *
         * @description
         * List of all roles.
         */
        vm.roles = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserFormController
         * @name supervisoryNodes
         * @type {Array}
         *
         * @description
         * List of all supervisory nodes.
         */
        vm.supervisoryNodes = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserFormController
         * @name warehouses
         * @type {Array}
         *
         * @description
         * List of all warehouses.
         */
        vm.warehouses = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserFormController
         * @name programs
         * @type {Array}
         *
         * @description
         * List of all programs.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserFormController
         * @name user
         * @type {String}
         *
         * @description
         * Message to be displayed when user is created/updated successfully.
         */
        vm.notification = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name $onInit
         *
         * @description
         * Initialization method of the UserFormModalController.
         */
        function onInit() {
            vm.updateMode = !!user;
            vm.user = user ? user : {
                roleAssignments: [],
                loginRestricted: false
            };
            vm.roles = roles;
            vm.supervisoryNodes = supervisoryNodes;
            vm.warehouses = warehouses;
            vm.programs = programs;
            vm.notification = 'adminUserForm.user' + (vm.updateMode ? 'Updated' : 'Created') + 'Successfully';
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name getSupervisoryNodeName
         *
         * @description
         * Returns name of the supervisory node.
         *
         * @param  {String} supervisoryNodeCode the supervisory node code
         * @return {String}                     the supervisory node name
         */
        function getSupervisoryNodeName(supervisoryNodeCode) {
            if(!supervisoryNodeCode) return undefined;
            return $filter('filter')(vm.supervisoryNodes, {
                code: supervisoryNodeCode
            }, true)[0].name;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name getProgramName
         *
         * @description
         * Returns name of the program.
         *
         * @param  {String} programCode the program code
         * @return {String}             the program name
         */
        function getProgramName(programCode) {
            if(!programCode) return undefined;
            var filtered = $filter('filter')(vm.programs, {
                code: programCode
            }, true);
            if(!filtered || filtered.length < 1) return undefined;
            return filtered[0].name;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name getWarehouseName
         *
         * @description
         * Returns name of the warehouse.
         *
         * @param  {String} warehouseCode the warehouse code
         * @return {String}               the warehouse name
         */
        function getWarehouseName(warehouseCode) {
            if(!warehouseCode) return undefined;
            var filtered = $filter('filter')(vm.warehouses, {
                code: warehouseCode
            }, true);
            if(!filtered || filtered.length < 1) return undefined;
            return filtered[0].name;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name getRoleName
         *
         * @description
         * Returns name of the role.
         *
         * @param  {String} roleId the role UUID
         * @return {String}        the role name
         */
        function getRoleName(roleId) {
            if(!roleId) return undefined;
            var filtered = $filter('filter')(vm.roles, {
                id: roleId
            }, true);
            if(!filtered || filtered.length < 1) return undefined;
            return filtered[0].name;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name addRole
         *
         * @description
         * Adds new role assignment to user object.
         */
        function addRole() {
            (new UserAddRoleModal(vm.user, vm.supervisoryNodes, vm.programs, vm.warehouses, vm.roles)).then(function(newRole) {
				vm.user.roleAssignments.push(newRole);
			});
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name removeRole
         *
         * @description
         * Removes role from user object.
         */
        function removeRole(roleAssignment) {
            var index = vm.user.roleAssignments.indexOf(roleAssignment);
            if(index < 0) return;
            vm.user.roleAssignments.splice(index, 1);
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name createUser
         *
         * @description
         * Creates or updates the user.
         *
         * @return {Promise} the promise resolving to th created/updated user
         */
        function createUser() {
            var loadingPromise = loadingModalService.open(true);

            return referencedataUserService.createUser(vm.user).then(function(savedUser) {
                if(vm.updateMode) {
                    loadingPromise.then(function () {
                        notificationService.success(vm.notification);
                    });
                    goToUserList();
                } else {
                    authUserService.saveUser({
                        enabled: true,
                        referenceDataUserId: savedUser.id,
                        role: 'USER',
                        username: savedUser.username
                    }).then(function() {
                        loadingPromise.then(function () {
                            notificationService.success(vm.notification);
                        });
                        (new UserPasswordModal(savedUser.username)).finally(function () {
                            goToUserList();
                        });
                    }, loadingModalService.close);
                }
            })
            .finally(loadingModalService.close);
        }

        function goToUserList() {
            $state.go('^', {}, {
                reload: true
            });
        }
    }
})();
