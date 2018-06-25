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
     * @ngdoc service
     * @name auth-user.authUserService
     *
     * @description
     * Responsible for retrieving user info from the auth service.
     */
    angular
        .module('auth-user')
        .service('authUserService', service);

    service.$inject = [
        'openlmisUrlFactory', '$resource'
    ];

    function service(openlmisUrlFactory, $resource) {
        var resource = $resource(openlmisUrlFactory('/api/users/auth'), {}, {
            saveUser: {
                method: 'POST'
            },
            resetPassword: {
                method: 'POST',
                url: openlmisUrlFactory('/api/users/auth/passwordReset')
            },
            sendResetEmail: {
                method: 'POST',
                url: openlmisUrlFactory('/api/users/auth/forgotPassword')
            },
            sendVerificationEmail: {
                method: 'POST',
                url: openlmisUrlFactory('/api/userContactDetails/:userId/verifications')
            },
            getVerificationEmail: {
                method: 'GET',
                url: openlmisUrlFactory('/api/userContactDetails/:userId/verifications')
            }
        });

        this.saveUser = saveUser;
        this.resetPassword = resetPassword;
        this.sendResetEmail = sendResetEmail;
        this.sendVerificationEmail = sendVerificationEmail;
        this.getVerificationEmail = getVerificationEmail;

        /**
         * @ngdoc method
         * @methodOf auth-user.authUserService
         * @name saveUser
         *
         * @description
         * Saves the given user in the auth service.
         *
         * @param   {Object}    user    the user to be saved
         * @return  {Promise}           the promise resolving to the saved user
         */
        function saveUser(user) {
            return resource.saveUser(undefined, user).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf auth-user.authUserService
         * @name resetPassword
         *
         * @description
         * Resets password for the given user.
         *
         * @param   {String}    username     the username of user for which the password should be changed
         * @param   {String}    newPassword  the new password for the user
         * @return  {Promise}                the promise resolving to the reset password
         */
        function resetPassword(username, newPassword) {
            return resource.resetPassword(undefined, {
                username: username,
                newPassword: newPassword
            }).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf auth-user.authUserService
         * @name sendResetEmail
         *
         * @description
         * Sends a reset password to the given user.
         *
         * @param   {String}    email   the email address on which the reset email should be sent
         * @return  {Promise}           the promise resolving to the send reset email
         */
        function sendResetEmail(email) {
            return resource.sendResetEmail({
                email: email
            }, undefined).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf auth-user.authUserService
         * @name sendVerificationEmail
         *
         * @description
         * Sends verification email to the given user.
         *
         * @param   {String}    userId  the ID of the user
         * @return  {Promise}           the promise resolving to the send verification email
         */
        function sendVerificationEmail(userId) {
            return resource.sendVerificationEmail({
                userId: userId
            }, {}).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf auth-user.authUserService
         * @name getVerificationEmail
         *
         * @description
         * Gets pending verification for the given user.
         *
         * @param   {String}    userId  the ID of the user
         * @return  {Promise}           the promise resolving to the get pending verification
         */
        function getVerificationEmail(userId) {
            return resource.getVerificationEmail({
                userId: userId
            })
                .$promise
                .then(function(response) {
                    return angular.equals(response, {}) ? undefined : response;
                });
        }
    }
})();
