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
     * @name referencedata-user.User
     *
     * @description
     * Represents a single user.
     */
    angular
        .module('referencedata-user')
        .factory('User', User);

    function User() {

        return User;

        /**
         * @ngdoc method
         * @methodOf referencedata-user.User
         * @name User
         *
         * @description
         * Creates a new instance of the User class.
         *
         * @return {Object} the user object
         */
        function User(id, username, firstName, lastName, email, timezone, homeFacilityId,
                      verified, active, loginRestricted, allowNotify) {
            this.id = id;
            this.username = username;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.timezone = timezone;
            this.homeFacilityId = homeFacilityId;
            this.verified = verified;
            this.active = active;
            this.loginRestricted = loginRestricted;
            this.allowNotify = allowNotify;
        }

    }

})();
