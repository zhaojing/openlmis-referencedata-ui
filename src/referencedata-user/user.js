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

        User.prototype.toJson = toJson;

        return User;

        /**
         * @ngdoc method
         * @methodOf referencedata-user.User
         * @name User
         *
         * @description
         * Creates a new instance of the User class.
         *
         * @param  {String}  id              the UUID of the user to be created
         * @param  {String}  username        the username of the user to be created
         * @param  {String}  firstName       the first name of the user to be created
         * @param  {String}  lastName        the last name of the user to be created
         * @param  {String}  email           the email of the user to be created
         * @param  {String}  timezone        the timezone of the user to be created
         * @param  {String}  homeFacilityId  the operator of the user to be created
         * @param  {Boolean} verified        true if the user to be created is active
         * @param  {Boolean} active          the date when the user goes life
         * @param  {Boolean} loginRestricted the date when the user goes down
         * @param  {Boolean} allowNotify     the comment of the user to be created
         * @param  {Object}  extraData       true if the user to be created is enabled
         * @param  {Array}   roleAssignments true if the user to be created is accessible
         * @return {Object}                  the user object
         */
        function User(id, username, firstName, lastName, email, timezone, homeFacilityId,
            verified, active, loginRestricted, allowNotify, extraData, roleAssignments) {
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
            this.extraData = extraData;
            this.roleAssignments = roleAssignments;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.User
         * @name toJson
         *
         * @description
         * Serializes the given user into a JSON string.
         *
         * @return {String} the user as JSON string
         */
        function toJson() {
            return angular.toJson(this);
        }
    }
})();
