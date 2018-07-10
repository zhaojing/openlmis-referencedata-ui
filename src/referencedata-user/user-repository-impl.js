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
        .factory('UserRepositoryImpl', UserRepositoryImpl);

    UserRepositoryImpl.inject = ['ReferenceDataUserResource'];

    function UserRepositoryImpl(ReferenceDataUserResource) {

        UserRepositoryImpl.prototype.get = get;
        UserRepositoryImpl.prototype.query = query;

        return UserRepositoryImpl;

        function get(id) {
            return this.referenceDataUserResource.get(id);
        }

        function query(params) {
            return this.referenceDataUserResource.query(params);
        }

        function UserRepositoryImpl() {
            this.referenceDataUserResource = new ReferenceDataUserResource();
        }

    }

})();