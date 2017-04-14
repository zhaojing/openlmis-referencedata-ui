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
            'user', 'referencedataUserService', 'loadingModalService', '$state',
            'notificationService', 'UserPasswordModal', 'authUserService'
        ];

        function controller(user, referencedataUserService, loadingModalService,
                            $state, notificationService, UserPasswordModal, authUserService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.createUser = createUser;

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
                loginRestricted: false
            };
            vm.notification = 'adminUserForm.user' + (vm.updateMode ? 'Updated' : 'Created') + 'Successfully';
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
