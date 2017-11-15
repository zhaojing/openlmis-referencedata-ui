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
        .factory('ObjectReferenceBuilder', ObjectReferenceBuilder);

    ObjectReferenceBuilder.$inject = ['ObjectReference'];

    function ObjectReferenceBuilder(ObjectReference) {

        ObjectReferenceBuilder.prototype.withId = withId;
        ObjectReferenceBuilder.prototype.withHref = withHref;
        ObjectReferenceBuilder.prototype.build = build;

        return ObjectReferenceBuilder;

        function ObjectReferenceBuilder() {
            this.id = 'c284f9a6-1135-486d-94cc-fc550540f1ce';
            this.href = 'https://test.openlmis.org/api/object-ref/c284f9a6-1135-486d-94cc-fc550540f1ce';
        }

        function withId(newId) {
            this.id = newId;
            return this;
        }

        function withHref(newHref) {
            this.href = newHref;
            return this;
        }

        function build() {
            return new ObjectReference(
                this.id,
                this.href
            );
        }

    }

})();
