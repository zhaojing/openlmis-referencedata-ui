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

    angular
        .module('admin-user-form')
        .factory('userPasswordModalFactory', factory);

    factory.$inject = ['openlmisModalService'];

    function factory(openlmisModalService) {

        return {
            createPassword: createPassword,
            resetPassword: resetPassword
        };

        function createPassword(user) {
            return open(user, 'adminUserForm.createPassword', true);
        }

        function resetPassword(user) {
            return open(user, 'adminUserForm.resetPassword', false);
        }

        function open(user, title, hideCancel) {
            var persistent = {
                user: {
                    username: user.username,
                    newPassword: undefined,
                    email: user.email
                }
            };

            return openlmisModalService.createDialog({
                controller: 'UserPasswordModalController',
                controllerAs: 'vm',
                templateUrl: 'admin-user-form/user-password-modal.html',
                show: true,
                resolve: {
                    user: function() {
                        return persistent.user;
                    },
                    title: function() {
                        return title;
                    },
                    hideCancel: function() {
                        return hideCancel;
                    }
                }
            }).promise.finally(function() {
                persistent = undefined;
            });
        }

    }

})();
