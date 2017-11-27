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
     * @name openlmis-permissions.Permission
     *
     * @description
     * Represents a single permission.
     */
    angular
        .module('openlmis-permissions')
        .factory('Permission', Permission);

    function Permission() {

        return Permission;

        /**
         * @ngdoc method
         * @methodOf openlmis-permissions.Permission
         * @name Permission
         *
         * @description
         * Creates a new instance of the Permission class.
         *
         * @param  {String}     right      the name of a role
         * @param  {String}     facilityId the facility UUID assigned to permission
         * @param  {String}     programId  the program UUID assigned to permission
         * @return {Permission}            the permission object
         */
        function Permission(right, facilityId, programId) {
            this.right = right;
            this.facilityId = facilityId;
            this.programId = programId;
        }
    }
})();
