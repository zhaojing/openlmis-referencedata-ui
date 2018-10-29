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
     * @name referencedata-supply-partner.supplyPartnerService
     *
     * @description
     * Responsible for retrieving supply partner info from the server.
     */
    angular
        .module('referencedata-supply-partner')
        .service('supplyPartnerService', service);

    service.$inject = ['referencedataUrlFactory', '$resource'];

    function service(referencedataUrlFactory, $resource) {
        var resource = $resource(referencedataUrlFactory('/api/supplyPartners/:id'), {}, {
            query: {
                url: referencedataUrlFactory('/api/supplyPartners'),
                method: 'GET',
                isArray: false
            }
        });

        this.get = get;
        this.query = query;

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.supplyPartnerService
         * @name get
         *
         * @description
         * Gets supply partner by UUID.
         *
         * @param  {String}  id the supply partner UUID
         * @return {Promise}    the supply partner object
         */
        function get(id) {
            return resource.get({
                id: id
            }).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.supplyPartnerService
         * @name search
         *
         * @description
         * Searches supply partners using given parameters.
         *
         * @param  {Object}  params the query and pagination parameters
         * @return {Promise}        the requested page of filtered supply partners
         */
        function query(params) {
            return resource.query(params).$promise;
        }
    }
})();
