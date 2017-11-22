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
     * @name referencedata-role.Role
     *
     * @description
     * Represents a single role.
     */
    angular
        .module('referencedata-role')
        .factory('Role', Role);

    function Role() {

        return Role;

        /**
         * @ngdoc method
         * @methodOf referencedata-role.Role
         * @name Role
         *
         * @description
         * Creates a new instance of the Role class.
         *
         * @param  {String}  id          the UUID of the role to be created
         * @param  {String}  name        the name of the role to be created
         * @param  {String}  description the description of the role to be created
         * @param  {Array}   rights      the array of the rights assigned to role
         * @param  {String}  type        the type of the role to be created
         * @return {Object}              the role object
         */
        function Role(id, name, description, rights, type) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.rights = rights;
            this.type = type;
        }
    }
})();
