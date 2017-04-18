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
     * @name admin-role-form.controller:RoleFormController
     *
     * @description
     * Manages role form allowing for role creation and modification.
     */
    angular
        .module('admin-role-form')
        .controller('RoleFormController', controller);

    controller.$inject = [
        '$q', '$filter', '$state', 'role', 'type', 'rights', 'referencedataRoleService',
        'typeNameFactory', 'loadingModalService', 'notificationService', 'confirmService'
    ];

    function controller($q, $filter, $state, role, type, rights, referencedataRoleService,
        typeNameFactory, loadingModalService, notificationService, confirmService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.saveRole = saveRole;
        vm.getLabel = typeNameFactory.getLabel;
        vm.getMessage = typeNameFactory.getMessage;
        vm.isNoneSelected = isNoneSelected;

        /**
         * @ngdoc property
         * @propertyOf admin-role-form.controller:RoleFormController
         * @type {Object}
         * @name role
         *
         * @description
         * The role that is being created/modified.
         */
        vm.role = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-role-form.controller:RoleFormController
         * @type {String}
         * @name type
         *
         * @description
         * The type of the role that is being created/modified.
         */
        vm.type = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-role-form.controller:RoleFormController
         * @type {List}
         * @name rights
         *
         * @description
         * The list of rights available for this role type,
         */
        vm.rights = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-role-form.controller:RoleFormController
         * @name $onInit
         *
         * @description
         * Initialization method fired after the controller has been created.
         */
        function onInit() {
            vm.role = role;
            vm.type = type;
            vm.rights = rights;
        }

        /**
         * @ngdoc method
         * @methodOf admin-role-form.controller:RoleFormController
         * @name saveRole
         *
         * @description
         * Saves the role on the OpenLMIS server.
         *
         * @return  {Promise}   the promise resolving to saved role
         */
        function saveRole() {
            vm.role.rights = getSelectedRights();
            return vm.role.id ? updateRole() : createRole();
        }

        /**
         * @ngdoc method
         * @methodOf admin-role-form.controller:RoleFormController
         * @name isNoneSelected
         *
         * @description
         * Checks whether there are any rights selected.
         *
         * @return  {Boolean}   true if at least on right is selected, false otherwise
         */
        function isNoneSelected() {
            return getSelectedRights().length === 0;
        }

        function getSelectedRights() {
            return $filter('filter')(vm.rights, {
                checked: true
            });
        }

        function updateRole() {
            var deferred = $q.defer();

            confirmService.confirm('adminRoleForm.confirm').then(function() {
                var loadingPromise = loadingModalService.open();

                referencedataRoleService.update(vm.role).then(function(role) {
                    loadingPromise.then(function() {
                        notificationService.success('adminRoleForm.roleUpdatedSuccessfully');
                    });
                    deferred.resolve(role);
                    goToRoleList();
                }, function(error) {
                    loadingModalService.close();
                    deferred.reject(error);
                });
            }, deferred.reject);

            return deferred.promise;
        }

        function createRole() {
            var loadingPromise = loadingModalService.open();

            return referencedataRoleService.create(vm.role).then(function(role) {
                loadingPromise.then(function() {
                    notificationService.success('adminRoleForm.roleCreatedSuccessfully');
                });
                goToRoleList();
            }, loadingModalService.close);
        }

        function goToRoleList() {
            $state.go('^', {}, {
                reload: true
            });
        }
    }

})();
