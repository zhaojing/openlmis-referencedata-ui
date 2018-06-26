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
     * @name referencedata-user.referencedataUserService
     *
     * @description
     * Responsible for retrieving user info from the server.
     */
    angular
        .module('referencedata-user')
        .service('referencedataUserService', service);

    service.$inject = [
        'openlmisUrlFactory', '$resource', 'localStorageFactory', 'userFactory'
    ];

    function service(openlmisUrlFactory, $resource, localStorageFactory, userFactory) {
        var resource = $resource(openlmisUrlFactory('/api/users/:id'), {}, {
            query: {
                url: openlmisUrlFactory('/api/users'),
                method: 'GET'
            },
            search: {
                url: openlmisUrlFactory('/api/users/search'),
                method: 'POST'
            },
            saveUser: {
                url: openlmisUrlFactory('/api/users'),
                method: 'PUT',
                transformRequest: transformRequest
            }
        });

        this.get = get;
        this.search = search;
        this.query = query;
        this.saveUser = saveUser;

        /**
         * @ngdoc method
         * @methodOf referencedata-user.referencedataUserService
         * @name get
         *
         * @description
         * Gets user by id.
         *
         * @param  {String}  id the user UUID
         * @return {Promise}    the user info
         */
        function get(id) {
            return resource.get({
                id: id
            }).$promise
                .then(function(response) {
                    return userFactory.buildUserFromResponse(response);
                });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.referencedataUserService
         * @name query
         *
         * @description
         * Gets all users that match given params or all facilities when no params provided.
         *
         * @param  {Object}  params the pagination and search params, i.e.
         * {
         *      id: ['userOneID', 'userTwoID'],
         *      page: 0,
         *      size: 10,
         *      sort: 'lastName,asc',
         * }
         * @return {Promise} the array of all users
         */
        function query(params) {
            return resource.query(params).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.referencedataUserService
         * @name search
         *
         * @description
         * Searches for users and returns paginated result.
         *
         * @param  {Object}  params the pagination and search params
         * @return {Promise}        the page of users
         */
        function search(params) {
            var paginationParams = {
                    page: params.page,
                    size: params.size,
                    sort: params.sort
                },
                queryParams = angular.copy(params);

            delete queryParams.page;
            delete queryParams.size;
            delete queryParams.sort;

            return resource.search(paginationParams, queryParams).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.referencedataUserService
         * @name saveUser
         *
         * @description
         * Creates new user.
         *
         * @param   {Object}    user    the user to be created
         * @return  {Promise}           the promise resolving to newly created user
         */
        function saveUser(user) {
            return resource.saveUser(undefined, user).$promise;
        }

        function transformRequest(user) {
            if (user.email === '') {
                user.email = null;
            }
            return angular.toJson(user);
        }
    }
})();
