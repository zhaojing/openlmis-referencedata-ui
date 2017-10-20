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
     * @name referencedata-user-cache.userCacheService
     *
     * @description
     * Triggers the user service to store logged user until the he/she logs out.
     * This service will stop a state change from happening until the user cache has been created.
     */

    angular.module('referencedata-user-cache')
        .service('userCacheService', service);

    service.$inject = ['$q', '$rootScope', 'referencedataUserService', 'authorizationService', 'loadingService'];

    function service($q, $rootScope, referencedataUserService, authorizationService, loadingService) {
        this.initialize = initialize;

        /**
         * @ngdoc method
         * @methodOf referencedata-user-cache.userCacheService
         * @name initialize
         *
         * @description
         * Sets up listeners for events in the service.
         */
        function initialize() {
            $rootScope.$on('openlmis-auth.login', cacheUser);
            $rootScope.$on('openlmis-auth.logout', removeUserCache);
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user-cache.userCacheService
         * @name cacheUser
         *
         * @description
         * Runs referencedataUserService.get to cache given user.
         *
         * The main part of this function manages a promise, which is used to
         * block state changes while the user info is being downloaded.
         */
        function cacheUser() {
            var userId = authorizationService.getUser().user_id;
            loadingService.register('referencedata-user-cache.loading', referencedataUserService.get(userId));
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user-cache.userCacheService
         * @name removeUserCache
         *
         * @description
         * Removes the user cache.
         */
        function removeUserCache() {
            referencedataUserService.clearUserCache();
        }
    }
})();
