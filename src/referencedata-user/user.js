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

    User.$inject = ['RoleAssignment', 'ROLE_TYPES'];

    function User(RoleAssignment, ROLE_TYPES) {

        User.prototype.addRoleAssignment = addRoleAssignment;
        User.prototype.removeRoleAssignment = removeRoleAssignment;

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
         * @name addRoleAssignment
         *
         * @description
         * Adds new role assignment to the User.
         *
         * @param {String} roleId              the UUID of the role that will be assigned
         * @param {String} roleName            the name of the role that will be assigned
         * @param {String} roleType            the type of the role that will be assigned
         * @param {String} programId           the UUID of the program that will be assigned with role
         * @param {String} programName         the name of the program that will be assigned with role
         * @param {String} supervisoryNodeId   the UUID of the supervisory node that will be assigned with role
         * @param {String} supervisoryNodeName the name of the supervisory node that will be assigned with role
         * @param {String} warehouseId         the UUID of the warehouse that will be assigned with role
         * @param {String} warehouseName       the name of the warehouse that will be assigned with role
         */
        function addRoleAssignment(roleId, roleName, roleType, programId, programName,
                                    supervisoryNodeId, supervisoryNodeName, warehouseId, warehouseName) {
            validateNewRoleAssignment(this, roleId, roleName, roleType, programId, programName,
                                        supervisoryNodeId, supervisoryNodeName, warehouseId, warehouseName);
            this.roleAssignments.push(
                new RoleAssignment(
                    roleId,
                    warehouseId,
                    supervisoryNodeId,
                    programId,
                    roleName,
                    roleType,
                    programName,
                    supervisoryNodeName,
                    warehouseName
                ));
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.User
         * @name removeRoleAssignment
         *
         * @description
         * Deletes user role assignment.
         *
         * @param {String} roleAssignment the role that will be removed
         */
        function removeRoleAssignment(roleAssignment) {
            var index = this.roleAssignments.indexOf(roleAssignment);
            if (index < 0) return;
            this.roleAssignments.splice(index, 1);
        }

        function validateNewRoleAssignment(user, roleId, roleName, roleType, programId, programName,
                                            supervisoryNodeId, supervisoryNodeName, warehouseId, warehouseName) {
            if (((programId || supervisoryNodeId) && (warehouseId)) ||
                (!programId && supervisoryNodeId)) {
                throw new Error('referencedataRoles.roleAssignmentInvalid');
            } else if (roleType === ROLE_TYPES.SUPERVISION && !supervisoryNodeId && !user.homeFacilityId) {
                throw new Error('referencedataRoles.homeFacilityRoleInvalid');
            } else if (isRoleAlreadyAssigned(user.roleAssignments, roleId, programId, supervisoryNodeId, warehouseId)) {
                throw new Error('referencedataRoles.roleAlreadyAssigned');
            }
        }

        function isRoleAlreadyAssigned(roleAssignments, roleId, programId, supervisoryNodeId, warehouseId) {
            var alreadyExist = false;

            roleAssignments.forEach(function(existingRoleAssignment) {
                alreadyExist = alreadyExist ||
                    (existingRoleAssignment.roleId === roleId &&
                        (!programId || existingRoleAssignment.programId === programId) &&
                        (!supervisoryNodeId || existingRoleAssignment.supervisoryNodeId === supervisoryNodeId) &&
                        (!warehouseId || existingRoleAssignment.warehouseId === warehouseId));
            });

            return alreadyExist;
        }
    }
})();
