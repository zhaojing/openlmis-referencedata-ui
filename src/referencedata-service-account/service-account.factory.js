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

(function(){

    'use strict';

    /**
     * @ngdoc service
     * @name referencedata-service-account.serviceAccountFactory
     *
     * @description
     * Allows deleting/creating both API Key and connected Service Account.
     */
    angular
        .module('referencedata-service-account')
        .factory('serviceAccountFactory', factory);

    factory.$inject = ['serviceAccountService', 'apiKeysService'];

    function factory(serviceAccountService, apiKeysService) {

        return {
            create: create,
            remove: remove
        };

        /**
         * @ngdoc method
         * @methodOf referencedata-service-account.serviceAccountFactory
         * @name create
         *
         * @description
         * Creates new service account and API Key.
         *
         * @return {Promise} new API Key
         */
        function create() {
            return apiKeysService.create().then(function(apiKey) {
                return serviceAccountService.create(apiKey.token)
                .then(function() {
                    return apiKey;
                });
            });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-service-account.serviceAccountFactory
         * @name remove
         *
         * @description
         * Removes Service Account and connected API Key.
         *
         * @param  {String}  token the API key of Service Account that will be removed
         * @return {Promise}       resolves if Service Account and API Key were removed successfully
         */
        function remove(token) {
            return serviceAccountService.remove({
                token: token
            })
            .then(function() {
                return apiKeysService.remove({
                  token: token
                });
            });
        }
    }
})();
