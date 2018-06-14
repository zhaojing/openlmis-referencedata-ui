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
     * @name auth-user.VerificationEmail
     *
     * @description
     * Represents a single user.
     */
    angular
        .module('auth-user')
        .factory('VerificationEmail', VerificationEmail);

    function VerificationEmail() {

        User.prototype.toJson = toJson;

        return VerificationEmail;

        /**
         * @ngdoc method
         * @methodOf auth-user.VerificationEmail
         * @name VerificationEmail
         *
         * @description
         * Creates a new instance of the Verification Email class.
         *
         * @param  {Object}                  json the json representation of the Verification Email
         * @return {Object}                  the user object
         */
        function VerificationEmail(json) {
            this.emailAddress = json.emailAddress;
            this.expiryDate = json.expiryDate;
        }

        /**
         * @ngdoc method
         * @methodOf auth-user.VerificationEmail
         * @name toJson
         *
         * @description
         * Serializes the given Verification Email into a JSON string.
         *
         * @return {String} the Verification Email as JSON string
         */
        function toJson() {
            return angular.toJson(this);
        }

    }
})();
