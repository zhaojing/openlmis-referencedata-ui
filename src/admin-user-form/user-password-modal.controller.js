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
     * @name admin-user-form.controller:UserPasswordModalController
     *
     * @description
     * Manages user password modal.
     */
    angular
        .module('admin-user-form')
        .controller('UserPasswordModalController', controller);

    controller.$inject = [
        'user', 'isNewUser', 'modalDeferred', 'authUserService', 'loadingModalService',
        'notificationService'
    ];

    function controller(user, isNewUser, modalDeferred, authUserService, loadingModalService,
                        notificationService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.createPassword = createPassword;
        vm.sendResetEmail = sendResetEmail;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserPasswordModalController
         * @name user
         * @type {Object}
         *
         * @description
         * User object with username, which will be updated with new password.
         */
        vm.user = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserPasswordModalController
         * @name isNewUser
         * @type {boolean}
         *
         * @description
         * Flag defining whether we're creating password for a new user or Updating
         * it for already existing user.
         */
        vm.isNewUser = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserPasswordModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the UserPasswordModalController.
         */
        function onInit() {
            vm.user = user;
            vm.isNewUser = isNewUser;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserPasswordModalController
         * @name createPassword
         *
         * @description
         * Saves password for given user in auth service.
         *
         * @return {Promise} resolves after password saves successfully on the server.
         */
        function createPassword() {
            var loadingPromise = loadingModalService.open(true);

            return authUserService.resetPassword(vm.user.username, vm.user.newPassword).then(function() {
                loadingPromise.then(function() {
                    notificationService.success('adminUserForm.passwordSetSuccessfully');
                });
                modalDeferred.resolve();
            }).finally(loadingModalService.close);
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserPasswordModalController
         * @name sendResetEmail
         *
         * @description
         * Requests sending reset password token to email address for given user.
         */
        function sendResetEmail() {
            var loadingPromise = loadingModalService.open();

            authUserService.sendResetEmail(vm.user.email).then(function() {
              loadingPromise.then(function() {
                  notificationService.success('adminUserForm.passwordResetSuccessfully');
              });
              modalDeferred.resolve();
            }).finally(loadingModalService.close);
        }
    }
})();
