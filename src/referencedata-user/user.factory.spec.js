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

describe('userFactory', function() {

    var SOME_ID = 'some-id',
        LUSKY = 'lusky',
        LUKE = 'Luke',
        SKYWALKER = 'Skywalker',
        LUSKY_AT_FAR_FAR_AWAY = 'lusky@farfar.away',
        HOME_FACILITY_ID = 'home-facility-id',
        CET = 'CET';

    var userFactory, UserDataBuilder;

    beforeEach(function() {
        module('referencedata-user');

        inject(function($injector) {
            userFactory = $injector.get('userFactory');
            UserDataBuilder = $injector.get('UserDataBuilder');
        });
    });

    describe('buildUserFromResponse', function() {

        it('should return undefined if undefined was passed', function() {
            expect(userFactory.buildUserFromResponse()).toBeUndefined();
        });

        it('should ignore any fields that are not part of the User class', function() {
            var response = {
                someExtraField: 'someValue'
            };

            var result = userFactory.buildUserFromResponse(response);

            expect(result.someExtraField).toBeUndefined();
        });

        it('should build user based on response', function() {
            var response = {
                id: SOME_ID,
                username: LUSKY,
                firstName: LUKE,
                lastName: SKYWALKER,
                timezone: CET,
                email: LUSKY_AT_FAR_FAR_AWAY,
                homeFacilityId: HOME_FACILITY_ID,
                verified: true,
                active: false,
                loginRestricted: true,
                allowNotify: false,
                extraData: {},
                roleAssignments: []
            };

            var result = userFactory.buildUserFromResponse(response);

            expect(result.id).toEqual(SOME_ID);
            expect(result.username).toEqual(LUSKY);
            expect(result.firstName).toEqual(LUKE);
            expect(result.lastName).toEqual(SKYWALKER);
            expect(result.timezone).toEqual(CET);
            expect(result.email).toEqual(LUSKY_AT_FAR_FAR_AWAY);
            expect(result.homeFacilityId).toEqual(HOME_FACILITY_ID);
            expect(result.verified).toEqual(true);
            expect(result.active).toEqual(false);
            expect(result.loginRestricted).toEqual(true);
            expect(result.allowNotify).toEqual(false);
            expect(result.extraData).toEqual({});
            expect(result.roleAssignments).toEqual([]);
        });

    });

    describe('buildUserFromJson', function() {

        it('should return undefined if undefined was passed', function() {
            expect(userFactory.buildUserFromJson()).toBeUndefined();
        });

        it('should throw exception if string is not a valid JSON', function() {
            expect(function() {
                userFactory.buildUserFromJson('{id: "some-id"');
            }).toThrow('The string is not a valid JSON');
        });

        it('should ignore any fields that are not part of the User class', function() {
            var user = new UserDataBuilder().build(),
                extendedUser = angular.merge({
                    someExtraField: 'someValue'
                }, user);

            var result = userFactory.buildUserFromJson(angular.toJson(extendedUser));

            expect(result).toEqual(user);
            expect(result.someExtraField).toBeUndefined();
        });

        it('should build user based on JSON', function() {
            var user = new UserDataBuilder().build();

            var result = userFactory.buildUserFromJson(user.toJson());

            expect(result).toEqual(user);
        });

    });

});
