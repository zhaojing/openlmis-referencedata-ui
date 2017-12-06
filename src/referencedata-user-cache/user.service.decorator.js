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
     * @name referencedata-user-cache.referencedataUserService
     *
     * @description
     * Decorates userService with clearing cache method and caching user while getting by id.
     */
    angular.module('referencedata-user-cache')
        .config(config);

    config.$inject = ['$provide'];

    function config($provide) {
        $provide.decorator('referencedataUserService', decorator);
    }

    decorator.$inject = ['$delegate', '$q', 'localStorageFactory', 'authorizationService'];
    function decorator($delegate, $q, localStorageFactory, authorizationService) {
        var originalGetUser = $delegate.get,
            originalSaveUser = $delegate.saveUser,
            userCache = localStorageFactory('user');

        $delegate.getCurrentUserInfo = getCurrentUserInfo;
        $delegate.clearUserCache = clearCache;
        $delegate.saveUser = saveUser;

        return $delegate;

        /**
         * @ngdoc method
         * @methodOf referencedata-user-cache.referencedataUserService
         * @name getCurrentUserInfo
         *
         * @description
         * Gets current user details from the
         * referencedata service, which is then stored and only retrieved from
         * the user's browser.
         *
         * @return {Promise}    promise that resolves with user info
         */
        function getCurrentUserInfo() {
            var userId = authorizationService.getUser().user_id;
            var cachedUser = userCache.getBy('id', userId);

            if (cachedUser) {
                return $q.resolve(cachedUser);
            } else {
                return originalGetUser.apply($delegate, [userId])
                    .then(function(user) {
                        userCache.put(user);
                        return user;
                    });
            }
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user-cache.referencedataUserService
         * @name clearUserCache
         *
         * @description
         * Deletes user programs stored in the browser cache.
         */
        function clearCache() {
            userCache.clearAll();
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user-cache.referencedataUserService
         * @name saveUserCache
         *
         * @description
         * Creates new user and store in browser cache.
         *
         * @param   {Object}    user    the user to be created
         * @return  {Promise}           the promise resolving to newly created user
         */
        function saveUser(user) {
            var userId = authorizationService.getUser().user_id;
            if (userId === user.id) {
                userCache.put(user);
            }
            return originalSaveUser.apply($delegate, arguments)
                .then(function(user) {
                    userCache.put(user);
                    return user;
                });
        }
    }
})();
