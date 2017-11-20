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
        .module('referencedata-user')
        .factory('UserObjectReferenceDataBuilder', UserObjectReferenceDataBuilder);

    UserObjectReferenceDataBuilder.$inject = ['UserObjectReference'];

    function UserObjectReferenceDataBuilder(UserObjectReference) {

        ObjectReferenceDataBuilder.prototype.withId = withId;
        ObjectReferenceDataBuilder.prototype.withHref = withHref;
        ObjectReferenceDataBuilder.prototype.withFirstName = withFirstName;
        ObjectReferenceDataBuilder.prototype.withLastName = withLastName;
        UserObjectReferenceDataBuilder.prototype.build = build;

        return UserObjectReferenceDataBuilder;

        function UserObjectReferenceDataBuilder() {
            this.id = '0b7b2042-205c-4685-a9d5-903143af12f0';
            this.href = 'http://localhost/api/users/0b7b2042-205c-4685-a9d5-903143af12f0';
            this.firstName = 'Alan';
            this.lastName = 'Ehrenfreund';
        }

        function withId(newId) {
            this.id = newId;
            return this;
        }

        function withHref(newHref) {
            this.href = newHref;
            return this;
        }

        function withFirstName(newFirstName) {
            this.firstName = newFirstName;
            return this;
        }

        function withLastName(newLastName) {
            this.lastName = newLastName;
            return this;
        }

        function build() {
            return new UserObjectReference(
                this.id,
                this.href,
                this.firstName,
                this.lastName
            );
        }

    }

})();
