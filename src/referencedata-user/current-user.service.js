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
     * @name referencedata-user.currentUserService
     *
     * @description
     * Responsible for fetching and caching currently logged user.
     */
    angular
        .module('referencedata-user')
        .service('currentUserService', currentUserInfo);

    currentUserInfo.$inject = ['$q', 'UserRepository', 'localStorageService', 'authorizationService', 'User'];

    function currentUserInfo($q, UserRepository, localStorageService, authorizationService, User) {

        var CURRENT_USER = 'currentUser',
            userRepository = new UserRepository();

        this.getUserInfo = getUserInfo;
        this.clearCache = clearCache;

        /**
         * @ngdoc method
         * @methodOf referencedata-user.currentUserService
         * @name getUserInfo
         *
         * @description
         * Gets current user details from the
         * referencedata service, which is then stored and only retrieved from
         * the user's browser.
         *
         * @return {Promise}    promise that resolves with user info
         */
        function getUserInfo() {
            var authUser = authorizationService.getUser();
            if (!authUser) {
                return $q.reject();
            }

            var cachedUserAsJson = localStorageService.get(CURRENT_USER);
            if (cachedUserAsJson) {
                return $q.resolve(new User(angular.fromJson(cachedUserAsJson), new UserRepository()));
            }

            return userRepository.get(authUser.user_id)
                .then(function(refUser) {
                    localStorageService.add(CURRENT_USER, refUser.toJson());
                    return refUser;
                });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.currentUserService
         * @name clearCache
         *
         * @description
         * Deletes users stored in the browser cache.
         */
        function clearCache() {
            localStorageService.remove(CURRENT_USER);
        }
    }

})();
