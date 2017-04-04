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
     * @name referencedata-right.referencedataRightService
     *
     * @description
     * Responsible for communicating with the rights REST API.
     */
    angular
        .module('referencedata-right')
        .service('referencedataRightService', service);

    service.$inject = ['$resource', 'openlmisUrlFactory'];

    function service($resource, openlmisUrlFactory) {
        var resource = $resource(openlmisUrlFactory('/api/rights'), {}, {
            search: {
                isArray: true,
                method: 'GET',
                url: openlmisUrlFactory('/api/rights/search')
            }
        });

        this.getAll = getAll;
        this.search = search;

        /**
         * @ngdoc method
         * @methodOf referencedata-right.referencedataRightService
         * @name getAll
         *
         * @description
         * Retrieves the list of all rights from the OpenLMIS server.
         *
         * @return  {List}              the list of all rights
         */
        function getAll() {
            return resource.query().$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-right.referencedataRightService
         * @name search
         *
         * @description
         * Retrieves a list of rights matching the given name and type.
         *
         * @param   {String}    name    (optional) the phrase to search the right name by
         * @param   {String}    type    (optional) the phrase to search the right type by
         * @return  {List}              the list of all matching rights
         */
        function search(name, type) {
            return resource.search({
                name: name,
                type: type
            }).$promise;
        }
    }

})();
