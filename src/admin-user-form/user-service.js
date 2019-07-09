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
        .factory('UserService', UserService);

    UserService.$inject = [
        'UserRepository', 'User', '$q', 'loadingModalService', 'notificationService', '$state',
        'userPasswordModalFactory'
    ];

    function UserService(UserRepository, User, $q, loadingModalService, notificationService, $state,
                         userPasswordModalFactory) {

        UserService.prototype.get = get;

        return UserService;

        function UserService() {}

        function get(id) {
            var userPromise;
            if (id) {
                userPromise = new UserRepository().get(id);
            } else {
                userPromise = $q.resolve(new User(undefined, new UserRepository()));
            }

            return userPromise
                .then(decorateUser);
        }

        function decorateUser(user) {
            decorateSave(user);
            return user;
        }

        function decorateSave(user) {
            var originalSave = user.save;

            user.save = function() {
                var newUser = user.isNewUser,
                    successMessage = 'adminUserForm.user' + (newUser ? 'Created' : 'Updated') + 'Successfully',
                    errorMessage = 'adminUserForm.failedTo' + (newUser ? 'Create' : 'Update') + 'User';

                loadingModalService.open();
                return originalSave.apply(this, arguments)
                    .then(function(user) {
                        notificationService.success(successMessage);

                        if (newUser) {
                            loadingModalService.close();
                            return userPasswordModalFactory.createPassword(user)
                                .finally(function() {
                                    return user;
                                });
                        }

                        return user;
                    })
                    .then(function(user) {
                        $state.go('^', {}, {
                            reload: true
                        });
                        return user;
                    })
                    .catch(function(error) {
                        notificationService.error(errorMessage);
                        loadingModalService.close();
                        return $q.reject(error);
                    });
            };
        }
    }

})();