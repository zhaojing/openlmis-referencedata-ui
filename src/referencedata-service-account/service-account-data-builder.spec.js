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
        .module('referencedata-service-account')
        .factory('ServiceAccountBuilder', ServiceAccountBuilder);

    ServiceAccountBuilder.$inject = [];

    function ServiceAccountBuilder() {

        ServiceAccountBuilder.prototype.build = build;
        ServiceAccountBuilder.prototype.withToken = withToken;

        return ServiceAccountBuilder;

        function ServiceAccountBuilder() {
            ServiceAccountBuilder.instanceNumber = (ServiceAccountBuilder.instanceNumber || 0) + 1;

            this.token = 'token-' + ServiceAccountBuilder.instanceNumber;
            this.createdBy = 'admin-id-' + ServiceAccountBuilder.instanceNumber;
            this.createdDate = new Date();
        }

        function build() {
            return {
                token: this.token,
                createdBy: this.createdBy,
                createdDate: this.createdDate
            }
        }

        function withToken(token) {
            this.token = token;
            return this;
        }
    }
})();
