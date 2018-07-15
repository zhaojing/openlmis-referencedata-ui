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

    UserDataBuilder.$inject = ['User', 'RoleAssignment', 'ROLE_TYPES', 'UserRepository'];

    function UserDataBuilder(User,  RoleAssignment, ROLE_TYPES, UserRepository) {

        UserDataBuilder.prototype.build = build;
        UserDataBuilder.prototype.buildJson = buildJson;
        UserDataBuilder.prototype.buildAuthUserJson = buildAuthUserJson;
        UserDataBuilder.prototype.buildReferenceDataUserJson = buildReferenceDataUserJson;
        UserDataBuilder.prototype.buildUserContactDetailsJson = buildUserContactDetailsJson;
        UserDataBuilder.prototype.withSupervisionRoleAssignment = withSupervisionRoleAssignment;
        UserDataBuilder.prototype.withOrderFulfillmentRoleAssignment = withOrderFulfillmentRoleAssignment;
        UserDataBuilder.prototype.withGeneralAdminRoleAssignment = withGeneralAdminRoleAssignment;
        UserDataBuilder.prototype.withId = withId;
        UserDataBuilder.prototype.withUsername = withUsername;
        UserDataBuilder.prototype.withHomeFacilityId = withHomeFacilityId;
        UserDataBuilder.prototype.withoutHomeFacilityId = withoutHomeFacilityId;
        UserDataBuilder.prototype.asNew = asNew;

        return UserDataBuilder;

        function UserDataBuilder() {
            UserDataBuilder.instanceNumber = (UserDataBuilder.instanceNumber || 0) + 1;

            this.id = 'user-id-' + UserDataBuilder.instanceNumber;
            this.username = 'user-' + UserDataBuilder.instanceNumber;
            this.firstName = 'Jack';
            this.lastName = 'Smith';
            this.email = 'jack.smith@opelmis.com';
            this.jobTitle = "Junior Tester";
            this.phoneNumber = "000-000-000";
            this.timezone = 'UTC';
            this.homeFacilityId = 'facility-id';
            this.verified = true;
            this.active = true;
            this.loginRestricted = true;
            this.allowNotify = true;
            this.extraData = {};
            this.roleAssignments = [];
            this.repository = new UserRepository();
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
            this.roleAssignments.push(
                new RoleAssignment(this, roleId, null, supervisoryNodeId, programId, null, ROLE_TYPES.SUPERVISION)
            );
            return this;
        }

        function withOrderFulfillmentRoleAssignment(roleId, warehouseId) {
            this.roleAssignments.push(
                new RoleAssignment(this, roleId, warehouseId, null, null, null, ROLE_TYPES.ORDER_FULFILLMENT)
            );
            return this;
        }

        function withGeneralAdminRoleAssignment(roleId) {
            this.roleAssignments.push(
                new RoleAssignment(this, roleId, null, null, null, null, ROLE_TYPES.GENERAL_ADMIN)
            );
            return this;
        }

        function withHomeFacilityId(homeFacilityId) {
            this.homeFacilityId = homeFacilityId;
            return this;
        }

        function withoutHomeFacilityId() {
            this.homeFacilityId = undefined;
            return this;
        }

        function asNew() {
            this.id = undefined;
            return this;
        }

        function build() {
            return new User(this.buildJson(), this.repository);
        }

        function buildJson() {
            return {
                id: this.id,
                username: this.username,
                firstName: this.firstName,
                lastName: this.lastName,
                jobTitle: this.jobTitle,
                phoneNumber: this.phoneNumber,
                email: this.email,
                timezone: this.timezone,
                homeFacilityId: this.homeFacilityId,
                verified: this.verified,
                active: this.active,
                loginRestricted: this.loginRestricted,
                allowNotify: this.allowNotify,
                extraData: this.extraData,
                roleAssignments: this.roleAssignments
            };
        }

        function buildReferenceDataUserJson() {
            return {
                id: this.id,
                username: this.username,
                firstName: this.firstName,
                lastName: this.lastName,
                jobTitle: this.jobTitle,
                timezone: this.timezone,
                homeFacilityId: this.homeFacilityId,
                active: this.active,
                loginRestricted: this.loginRestricted,
                extraData: this.extraData,
                roleAssignments: this.roleAssignments
            };
        }

        function buildAuthUserJson() {
            return {
                id: this.id,
                username: this.username,
                enabled: this.enabled
            };
        }

        function buildUserContactDetailsJson() {
            return {
                referenceDataUserId: this.id,
                phoneNumber: this.phoneNumber,
                allowNotify: this.allowNotify,
                emailDetails: {
                    emailVerified: this.verified,
                    email: this.email
                }
            };
        }
    }
})();
