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
     * @name referencedata-user.userFactory
     *
     * @description
     * Factory for creating users. This is the only place that should ever be user for User
     * creation.
     */
    angular
        .module('referencedata-user')
        .factory('userFactory', userFactory);

    userFactory.$inject = ['User'];

    function userFactory(User) {
        var userFactory = {
            buildUser: buildUser,
            buildUserFromJson: buildUserFromJson,
            buildUserFromResponse: buildUserFromResponse
        };
        return userFactory;

        /**
         * @ngdoc methodOf
         * @methodOf referencedata-user.userFactory
         * @name buildUser
         *
         * @description
         * Builds an user based on the given properties.
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
        function buildUser(id, username, firstName, lastName, email, timezone, homeFacilityId,
                           verified, active, loginRestricted, allowNotify, extraData,
                           roleAssignments) {

            return new User(
                id, username, firstName, lastName, email, timezone, homeFacilityId, verified,
                active, loginRestricted, allowNotify, extraData, roleAssignments
            );
        }

        /**
         * @ngdoc methodOf
         * @methodOf referencedata-user.userFactory
         * @name buildUserFromResponse
         *
         * @description
         * Builds an user based on the OpenLMIS server response.
         *
         * @param  {Object} response    the object returned by the OpenLMIS server
         * @return {User}               the user object
         */
        function buildUserFromResponse(response) {
            if (!response) {
                return undefined;
            }

            return userFactory.buildUser(
                response.id, response.username, response.firstName, response.lastName,
                response.email, response.timezone, response.homeFacilityId, response.verified,
                response.active, response.loginRestricted, response.allowNotify, response.extraData,
                response.roleAssignments
            );
        }

        /**
         * @ngdoc methodOf
         * @methodOf referencedata-user.userFactory
         * @name buildUserFromResponse
         *
         * @description
         * Builds an user based on the given JSON string. It will throw exception if given string
         * is not a valid JSON.
         *
         * @param  {String} json    the JSON string representing user
         * @return {User}           the user object or undefined if undefined was given
         */
        function buildUserFromJson(json) {
            if (!json) {
                return undefined;
            }

            var response;
            try {
                response = angular.fromJson(json);
            } catch (ex) {
                throw 'The string is not a valid JSON';
            }

            return userFactory.buildUserFromResponse(response);
        }
    }

})();
