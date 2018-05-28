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

    var EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

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

    User.$inject = ['messageService'];

    function User(messageService) {

        User.prototype.toJson = toJson;
        User.prototype.validate = validate;

        return User;

        /**
         * @ngdoc method
         * @methodOf referencedata-user.User
         * @name User
         *
         * @description
         * Creates a new instance of the User class.
         *
         * @param  {Object}                  json the json representation of the user
         * @return {Object}                  the user object
         */
        function User(json) {
            this.id = json.id;
            this.username = json.username;
            this.firstName = json.firstName;
            this.lastName = json.lastName;
            this.jobTitle = json.jobTitle;
            this.phoneNumber = json.phoneNumber;
            this.email = json.email;
            this.timezone = json.timezone;
            this.homeFacilityId = json.homeFacilityId;
            this.verified = json.verified;
            this.active = json.active;
            this.loginRestricted = json.loginRestricted;
            this.allowNotify = json.allowNotify;
            this.extraData = json.extraData;
            this.roleAssignments = json.roleAssignments;
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

        /**
         * @ngdoc method
         * @methodOf referencedata-user.User
         * @name validate
         *
         * @description
         * Validates the User and returns a map of errors if it is invalid.
         *
         * @return {Object} the map of errors if the User is invalid, undefined otherwise
         */
        function validate() {
            var errors = {};

            if (this.email && !EMAIL_REGEX.test(String(this.email).toLowerCase())) {
                errors.email = messageService.get("user.validation.email");
            }

            return angular.equals(errors, {}) ? undefined : errors;
        }
    }
})();
