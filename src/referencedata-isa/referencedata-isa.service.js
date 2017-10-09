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
     * @name referencedata-isa.isaService
     *
     * @description
     * Responsible for retrieving Ideal Stock Amounts from the server.
     */
    angular
        .module('referencedata-isa')
        .factory('isaService', service);

    service.$inject = ['$resource', 'referencedataUrlFactory'];

    function service($resource, referencedataUrlFactory) {

        var resource = $resource(referencedataUrlFactory('/api/idealStockAmounts/:id'), {}, {
                'upload': {
                    url: referencedataUrlFactory('/api/idealStockAmounts?format=csv'),
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined
                    }
                }
            });

        return {
            getDownloadUrl: getDownloadUrl,
            upload: upload
        };

        /**
         * @ngdoc method
         * @methodOf referencedata-isa.isaService
         * @name getDownloadUrl
         *
         * @description
         * Returns URL for downloading Ideal Stock Amounts in csv format file.
         *
         * @return {String} the URL for downloading Ideal Stock Amounts
         */
        function getDownloadUrl() {
            return referencedataUrlFactory('/api/idealStockAmounts?format=csv');
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-isa.isaService
         * @name upload
         *
         * @description
         * Uploads ISA records in csv file.
         *
         * @param  {Object}  file the csv file that will be uploaded
         * @return {Promise}      the number of uploaded items
         */
        function upload(file) {
            var formData = new FormData();
            formData.append('file', file);

            return resource.upload(formData).$promise;
        }
    }
})();
