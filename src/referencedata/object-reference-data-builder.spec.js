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
        .module('referencedata')
        .factory('ObjectReferenceDataBuilder', ObjectReferenceDataBuilder);

    ObjectReferenceDataBuilder.$inject = ['ObjectReference'];

    function ObjectReferenceDataBuilder(ObjectReference) {

        var separator = '/';

        ObjectReferenceDataBuilder.prototype.withId = withId;
        ObjectReferenceDataBuilder.prototype.withResource = withResource;
        ObjectReferenceDataBuilder.prototype.withServiceUrl = withServiceUrl;
        ObjectReferenceDataBuilder.prototype.build = build;

        return ObjectReferenceDataBuilder;

        function ObjectReferenceDataBuilder() {
            ObjectReferenceDataBuilder.instanceNumber = (ObjectReferenceDataBuilder.instanceNumber || 0) + 1;

            this.id = 'object-id-' + ObjectReferenceDataBuilder.instanceNumber;
            this.serviceUrl = 'http://localhost/api';
            this.resource = 'object';
        }

        function withId(newId) {
            this.id = newId;
            return this;
        }

        function withResource(resource) {
            this.resource = resource;
            return this;
        }

        function withServiceUrl(serviceUrl) {
            this.serviceUrl = serviceUrl;
            return this;
        }

        function build() {
            return new ObjectReference(
                this.id,
                [this.serviceUrl, this.resource, this.id].join(separator)
            );
        }
    }
})();
