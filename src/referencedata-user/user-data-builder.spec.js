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

    UserDataBuilder.$inject = ['User', 'RoleAssignment'];

    function UserDataBuilder(User,  RoleAssignment) {

        UserDataBuilder.prototype.build = build;
        UserDataBuilder.prototype.withSupervisionRoleAssignment = withSupervisionRoleAssignment;
        UserDataBuilder.prototype.withOrderFulfillmentRoleAssignment = withOrderFulfillmentRoleAssignment;
        UserDataBuilder.prototype.withGeneralAdminRoleAssignment = withGeneralAdminRoleAssignment;
        UserDataBuilder.prototype.withId = withId;
        UserDataBuilder.prototype.withUsername = withUsername;

        return UserDataBuilder;

        function UserDataBuilder() {
            UserDataBuilder.instanceNumber = (UserDataBuilder.instanceNumber || 0) + 1;

            this.id = 'user-id-' + UserDataBuilder.instanceNumber;
            this.username = 'user-' + UserDataBuilder.instanceNumber;
            this.firstName = 'Jack';
            this.lastName = 'Smith';
            this.email = 'jack.smith@opelmis.com';
            this.timezone = 'UTC';
            this.homeFacilityId = 'facility-id';
            this.verified = true;
            this.active = true;
            this.loginRestricted = true;
            this.allowNotify = true;
            this.extraData = {};
            this.roleAssignments = [];
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
                this.verified,
                this.active,
                this.loginRestricted,
                this.allowNotify,
                this.extraData,
                this.roleAssignments
            );
        }

        function withId(newId) {
            this.id = newId;
            return this;
        }

        function withUsername(newUsername) {
            this.username = newUsername;
            return this;
        }

        function withSupervisionRoleAssignment(roleId, supervisoryNodeId, programId) {
            this.roleAssignments.push(new RoleAssignment(roleId, null, supervisoryNodeId, programId));
            return this;
        }

        function withOrderFulfillmentRoleAssignment(roleId, warehouseId) {
            this.roleAssignments.push(new RoleAssignment(roleId, warehouseId, null, null));
            return this;
        }

        function withGeneralAdminRoleAssignment(roleId) {
            this.roleAssignments.push(new RoleAssignment(roleId, null, null, null));
            return this;
        }
    }
})();
