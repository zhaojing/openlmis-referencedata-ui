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

describe('User', function() {

    var User, user, json, UserDataBuilder, ROLE_TYPES, supervisionRoleAssignments, orderFulfillmentRoleAssignment,
        generalAdminRoleAssignment, UserRepository, userRepository;

    beforeEach(function() {
        module('referencedata-user');

        inject(function($injector) {
            User = $injector.get('User');
            UserDataBuilder = $injector.get('UserDataBuilder');
            ROLE_TYPES = $injector.get('ROLE_TYPES');
            UserRepository = $injector.get('UserRepository');
        });

        userRepository = new UserRepository();

        json = new UserDataBuilder()
            .withSupervisionRoleAssignment('1', '1', '1')
            .withSupervisionRoleAssignment('2', '2', '1')
            .withSupervisionRoleAssignment('3', '1', '2')
            .withOrderFulfillmentRoleAssignment('2', '2')
            .withGeneralAdminRoleAssignment('3')
            .buildJson();

        supervisionRoleAssignments = [json.roleAssignments[0], json.roleAssignments[1], json.roleAssignments[2]];
        orderFulfillmentRoleAssignment = json.roleAssignments[3];
        generalAdminRoleAssignment = json.roleAssignments[4];

        user = new User(json, userRepository);

        spyOn(userRepository, 'create');
        spyOn(userRepository, 'update');
    });

    describe('constructor', function() {

        it('should set all properties', function() {
            expect(user.id).toEqual(json.id);
            expect(user.username).toEqual(json.username);
            expect(user.firstName).toEqual(json.firstName);
            expect(user.lastName).toEqual(json.lastName);
            expect(user.timezone).toEqual(json.timezone);
            expect(user.email).toEqual(json.email);
            expect(user.homeFacilityId).toEqual(json.homeFacilityId);
            expect(user.verified).toEqual(json.verified);
            expect(user.active).toEqual(json.active);
            expect(user.loginRestricted).toEqual(json.loginRestricted);
            expect(user.allowNotify).toEqual(json.allowNotify);
            expect(user.extraData).toEqual(json.extraData);
            expect(user.roleAssignments).toEqual(json.roleAssignments);
            expect(user.repository).toEqual(userRepository);
            expect(user.isNewUser).toEqual(false);
        });

        it('should default login restricted to false', function() {
            user = new User();

            expect(user.loginRestricted).toEqual(false);
        });

        it('should default active to true', function() {
            user = new User();

            expect(user.active).toEqual(true);
        });

        it('should return true if user has no id', function() {
            user = new User();

            expect(user.isNewUser).toEqual(true);
        });

    });

    describe('fromJson', function() {

        it('should serialize the user to JSON', function() {
            expect(user.toJson()).toEqual(angular.toJson(user));
        });

    });

    describe('getRoleAssignments', function() {

        it('should get all role assignments if type is not provided', function() {
            expect(user.getRoleAssignments()).toEqual(json.roleAssignments);
        });

        it('should get zero role assignments if type is incorrect', function() {
            expect(user.getRoleAssignments('abc')).toEqual([]);
        });

        it('should get role assignments by type', function() {
            expect(user.getRoleAssignments(ROLE_TYPES.SUPERVISION)).toEqual(supervisionRoleAssignments);
            expect(user.getRoleAssignments(ROLE_TYPES.ORDER_FULFILLMENT)).toEqual([orderFulfillmentRoleAssignment]);
            expect(user.getRoleAssignments(ROLE_TYPES.GENERAL_ADMIN)).toEqual([generalAdminRoleAssignment]);
        });

        it('should get supervision role assignments by supervisoryNodeId', function() {
            expect(user.getRoleAssignments(ROLE_TYPES.SUPERVISION, '1')).
                toEqual([supervisionRoleAssignments[0], supervisionRoleAssignments[2]]);
        });

        it('should get supervision role assignments by supervisoryNodeId and programId', function() {
            expect(user.getRoleAssignments(ROLE_TYPES.SUPERVISION, '1', '1')).toEqual([supervisionRoleAssignments[0]]);
        });

    });

    describe('save', function() {

        it('should update the user if it exists', function() {
            user.save();

            expect(userRepository.update).toHaveBeenCalledWith(user);
            expect(userRepository.create).not.toHaveBeenCalled();
        });

        it('should create new user if it does not exist', function() {
            user.id = undefined;

            user.save();

            expect(userRepository.create).toHaveBeenCalledWith(user);
            expect(userRepository.update).not.toHaveBeenCalled();
        });

    });

    describe('getBasicInformation', function() {

        it('should return basic information about the user', function() {
            expect(user.getBasicInformation()).toEqual({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                jobTitle: user.jobTitle,
                timezone: user.timezone,
                homeFacilityId: user.homeFacilityId,
                active: user.active,
                loginRestricted: user.loginRestricted,
                extraData: user.extraData,
                roleAssignments: user.roleAssignments
            });
        });

    });

    describe('getContactDetails', function() {

        it('should return user contact details', function() {
            expect(user.getContactDetails()).toEqual({
                referenceDataUserId: user.id,
                phoneNumber: user.phoneNumber,
                allowNotify: user.allowNotify,
                emailDetails: {
                    emailVerified: user.verified,
                    email: user.email
                }
            });
        });

    });

    describe('getAuthDetails', function() {

        it('should return user authentication details', function() {
            expect(user.getAuthDetails()).toEqual({
                id: user.id,
                username: user.username,
                enabled: user.enabled
            });
        });

    });

    describe('removeHomeFacilityRights', function() {

        it('should remove rights with program id and without supervisory node id', function() {
            supervisionRoleAssignments[0].supervisoryNodeId = undefined;
            supervisionRoleAssignments[1].supervisoryNodeId = undefined;
            supervisionRoleAssignments[2].supervisoryNodeId = undefined;

            user.removeHomeFacilityRights();

            expect(user.roleAssignments).toEqual([
                orderFulfillmentRoleAssignment,
                generalAdminRoleAssignment
            ]);
        });

    });

});
