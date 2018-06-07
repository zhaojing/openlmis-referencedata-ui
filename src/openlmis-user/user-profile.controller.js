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
     * @name openlmis-user.controller:UserProfileController
     *
     * @description
     * Allows user to see his own profile info.
     */
    angular
        .module('openlmis-user')
        .controller('UserProfileController', controller);

    controller.$inject = [
        'user', 'homeFacility', 'ROLE_TYPES', 'loadingModalService', 'referencedataUserService', 'notificationService',
        'userPasswordModalFactory', 'loginService', '$rootScope', '$state', 'alertService'
    ];

    function controller(user, homeFacility, ROLE_TYPES, loadingModalService, referencedataUserService,
                        notificationService, userPasswordModalFactory, loginService, $rootScope, $state, alertService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.getRoleTypeLabel = ROLE_TYPES.getLabel;
        vm.updateProfile = updateProfile;
        vm.restoreProfile = restoreProfile;
        vm.changePassword = changePassword;

        /**
         * @ngdoc property
         * @propertyOf openlmis-user.controller:UserProfileController
         * @name user
         * @type {Object}
         *
         * @description
         * Contains user detailed info.
         */
        vm.user = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-user.controller:UserProfileController
         * @name homeFacility
         * @type {Object}
         *
         * @description
         * Contains user home facility detailed info.
         */
        vm.homeFacility = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-user.controller:UserProfileController
         * @type {Array}
         * @name roleTypes
         *
         * @description
         * The list of all role types.
         */
        vm.roleTypes = undefined;

        /**
         * @ngdoc method
         * @propertyOf openlmis-user.controller:UserProfileController
         * @name $onInit
         *
         * @description
         * Initialization method of the UserProfileController.
         */
        function onInit() {
            vm.user = user;
            vm.homeFacility = homeFacility;
            vm.roleTypes = ROLE_TYPES.getRoleTypes();
        }

        /**
         * @ngdoc method
         * @propertyOf openlmis-user.controller:UserProfileController
         * @name updateProfile
         *
         * @description
         * Updates user profile.
         */
        function updateProfile() {
            loadingModalService.open();

            return referencedataUserService.saveUser(vm.user)
            .then(function() {
                notificationService.success('openlmisUser.updateProfile.updateSuccessful');
            })
            .catch(function() {
                notificationService.error('openlmisUser.updateProfile.updateFailed');
            })
            .finally(loadingModalService.close);
        }

        /**
         * @ngdoc method
         * @propertyOf openlmis-user.controller:UserProfileController
         * @name restoreProfile
         *
         * @description
         * Restore user profile.
         */
        function restoreProfile() {
            loadingModalService.open();
            $state.reload();
            notificationService.success('openlmisUser.cancel.restoreSuccessful');
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-user.controller:UserProfileController
         * @name changePassword
         *
         * @description
         * Open password management modal allowing user to send a password reset link or change the password. After
         * successful action is taken the modal is closed and the user is logged out. User is brought back to the
         * user profile page if the modal is dismissed.
         */
        function changePassword() {
            userPasswordModalFactory.resetPassword(user)
            .then(function() {
                loginService.logout()
                .then(function() {
                    return alertService.info({
                        title: 'openlmisUser.passwordResetAlert.title',
                        message: 'openlmisUser.passwordResetAlert.message',
                        buttonLabel: 'openlmisUser.passwordResetAlert.label'
                    });
                })
                .then(function() {
                    $rootScope.$emit('openlmis-auth.logout');
                    $state.go('auth.login');
                });
            });
        }

    }

})();
