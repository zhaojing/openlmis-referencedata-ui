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
        .factory('UserDataBuilder', UserDataBuilder);

    UserDataBuilder.$inject = ['User'];

    function UserDataBuilder(User) {

        UserDataBuilder.prototype.build = build;

        return UserDataBuilder;

        function UserDataBuilder() {
            this.id = '0b7b2042-205c-4685-a9d5-903143af12f0';
            this.username = 'divo1';
            this.firstName = 'Alan';
            this.lastName = 'Ehrenfreund';
            this.email = 'divo1@openlmis.org';
            this.timezone = 'CET';
            this.homeFacilityId = '97546f93-ac93-435f-a437-cd629deb7d6d';
            this.verified = true;
            this.active = true;
            this.loginRestricted = false;
            this.allowNotify = true;
        }

        function build() {
            return new User(
                this.id,
                this.username,
                this.firstName,
                this.lastName,
                this.email,
                this.timezone,
                this.homeFacilityId,
                this.verified ,
                this.active,
                this.loginRestricted,
                this.allowNotify
            );
        }

    }

})();
