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
     * @name referencedata-supervisory-node.supervisoryNodeService
     *
     * @description
     * Responsible for retrieving supervisory node info from the server.
     */
    angular
        .module('referencedata-supervisory-node')
        .service('supervisoryNodeService', service);

    service.$inject = ['referencedataUrlFactory', '$resource'];

    function service(referencedataUrlFactory, $resource) {
        var resource = $resource(referencedataUrlFactory('/api/supervisoryNodes/:id'), {}, {
            search: {
                url: referencedataUrlFactory('/api/supervisoryNodes/search'),
                method: 'POST'
            }
        });

        this.get = get;
        this.getAll = getAll;
        this.search = search;

        /**
         * @ngdoc method
         * @methodOf referencedata-supervisory-node.supervisoryNodeService
         * @name get
         *
         * @description
         * Gets supervisory node by UUID.
         *
         * @param  {String}  id the supervisory node UUID
         * @return {Promise}    the supervisory node object
         */
        function get(id) {
            return resource.get({
                id: id
            }).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supervisory-node.supervisoryNodeService
         * @name getAll
         *
         * @description
         * Gets all supervisory nodes.
         *
         * @return {Promise} the array of all supervisory nodes
         */
        function getAll() {
            return resource.query().$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supervisory-node.supervisoryNodeService
         * @name search
         *
         * @description
         * Searches supervisory nodes using given parameters.
         *
         * @param  {Object}  paginationParams The pagination parameters
         * @param  {Object}  queryParams      The search parameters
         * @return {Promise}                  The requested page of filtered supervisory nodes
         */
        function search(paginationParams, queryParams) {
            return resource.search(paginationParams, queryParams).$promise;
        }
    }
})();
