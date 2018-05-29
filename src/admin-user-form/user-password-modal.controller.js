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
        'user', 'title', 'hideCancel', 'modalDeferred', 'authUserService', 'loadingModalService',
        'notificationService', 'USER_PASSWORD_OPTIONS'
    ];

    function controller(user, title, hideCancel, modalDeferred, authUserService,
        loadingModalService, notificationService, USER_PASSWORD_OPTIONS) {
        var vm = this;

        vm.$onInit = onInit;
        vm.submitForm = submitForm;
        vm.isResetPasswordOption = isResetPasswordOption;
        vm.canSelectOption = canSelectOption;
        vm.getLabel = USER_PASSWORD_OPTIONS.getLabel;

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
         * @name title
         * @type {boolean}
         *
         * @description
         * The modal title.
         */
        vm.title = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserPasswordModalController
         * @name hideCancel
         * @type {boolean}
         *
         * @description
         * True if cancel button should be hidden; otherwise false.
         */
        vm.hideCancel = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserPasswordModalController
         * @name selectedOption
         * @type {String}
         *
         * @description
         * The selected option.
         */
        vm.selectedOption = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserPasswordModalController
         * @name options
         * @type {Array}
         *
         * @description
         * The available options.
         */
        vm.options = undefined;

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
            vm.title = title;
            vm.hideCancel = hideCancel;
            vm.selectedOption = vm.user.email
                ? USER_PASSWORD_OPTIONS.SEND_EMAIL
                : USER_PASSWORD_OPTIONS.RESET_PASSWORD;
            vm.options = USER_PASSWORD_OPTIONS.getOptions();
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserPasswordModalController
         * @name isResetPasswordSelected
         *
         * @description
         * Check if user selects reset password option.
         *
         * @param  {String}  one of available user password options
         * @return {Boolean} true if user selects reset password option; otherwise false.
         */
        function isResetPasswordOption(option) {
            return option === USER_PASSWORD_OPTIONS.RESET_PASSWORD;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserPasswordModalController
         * @name canSelectOption
         *
         * @description
         * Check if user can select reset password option.
         *
         * @param  {String}  one of available user password options
         * @return {Boolean} true if user can select an option; otherwise false.
         */
        function canSelectOption(option) {
            if(option === USER_PASSWORD_OPTIONS.SEND_EMAIL) {
                return !!vm.user.email;
            }

            return true;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserPasswordModalController
         * @name submitForm
         *
         * @description
         * submit user password modal. Depends on the selected option other actions are taken.
         */
        function submitForm() {
            loadingModalService.open();

            if(vm.selectedOption === USER_PASSWORD_OPTIONS.SEND_EMAIL) {
                sendResetEmail();
            } else if (vm.selectedOption === USER_PASSWORD_OPTIONS.RESET_PASSWORD) {
                resetPassword();
            }
        }

        function resetPassword() {
            authUserService.resetPassword(vm.user.username, vm.user.newPassword)
            .then(function() {
                notificationService.success('adminUserForm.passwordSetSuccessfully');
                modalDeferred.resolve();
            })
            .finally(loadingModalService.close);
        }

        function sendResetEmail() {
            loadingModalService.open();

            authUserService.sendResetEmail(vm.user.email)
            .then(function() {
                    notificationService.success('adminUserForm.passwordResetSuccessfully');
                modalDeferred.resolve();
            })
            .finally(loadingModalService.close);
        }
    }
})();
