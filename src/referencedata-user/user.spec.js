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

    var SOME_ID = 'some-id',
        LUSKY = 'lusky',
        LUKE = 'Luke',
        SKYWALKER = 'Skywalker',
        LUSKY_AT_FAR_FAR_AWAY = 'lusky@farfar.away',
        HOME_FACILITY_ID = 'home-facility-id',
        CET = 'CET';

    var User, user;

    beforeEach(function() {
        module('referencedata-user');

        inject(function($injector) {
            User = $injector.get('User');
        });

        user = new User(
            SOME_ID, LUSKY, LUKE, SKYWALKER, LUSKY_AT_FAR_FAR_AWAY, CET, HOME_FACILITY_ID, true,
            false, true, false, {}, []
        );
    });

    it('constructor should set all properties', function() {
        expect(user.id).toEqual(SOME_ID);
        expect(user.username).toEqual(LUSKY);
        expect(user.firstName).toEqual(LUKE);
        expect(user.lastName).toEqual(SKYWALKER);
        expect(user.timezone).toEqual(CET);
        expect(user.email).toEqual(LUSKY_AT_FAR_FAR_AWAY);
        expect(user.homeFacilityId).toEqual(HOME_FACILITY_ID);
        expect(user.verified).toEqual(true);
        expect(user.active).toEqual(false);
        expect(user.loginRestricted).toEqual(true);
        expect(user.allowNotify).toEqual(false);
        expect(user.extraData).toEqual({});
        expect(user.roleAssignments).toEqual([]);
    });

    describe('fromJson', function() {

        it('should serialize the user to JSON', function() {
            expect(user.toJson()).toEqual(angular.toJson(user));
        });

    });

});
