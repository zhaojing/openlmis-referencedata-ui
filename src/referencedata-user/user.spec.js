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

    var User, user, json, UserDataBuilder, messageService;

    beforeEach(function() {
        module('referencedata-user');

        inject(function($injector) {
            User = $injector.get('User');
            UserDataBuilder = $injector.get('UserDataBuilder');
            messageService = $injector.get('messageService');
        });

        json = new UserDataBuilder().buildJson();
        user = new User(json);

        spyOn(messageService, 'get').andCallFake(function(key) {
            return key;
        });
    });

    describe("constructor", function () {

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
      });

    });

    describe('fromJson', function() {

        it('should serialize the user to JSON', function() {
            expect(user.toJson()).toEqual(angular.toJson(user));
        });

    });

});
