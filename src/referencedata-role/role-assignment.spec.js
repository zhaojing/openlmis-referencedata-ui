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

describe('RoleAssignment', function() {

    'use strict';

    var user, assignment, RoleAssignment, UserDataBuilder, ROLE_TYPES;

    beforeEach(function () {
        module('referencedata-role');
        inject(function ($injector) {
            RoleAssignment = $injector.get('RoleAssignment');
            UserDataBuilder = $injector.get('UserDataBuilder');
            ROLE_TYPES = $injector.get('ROLE_TYPES');
        });

        user = new UserDataBuilder().build();
    });

    describe('constructor', function() {

        it('should validate role assignment', function () {
            assignment = new RoleAssignment(
                user, null, null, 'supervisory-node-id', null,
                null, ROLE_TYPES.SUPERVISION, null, null, null
            );

            expect(assignment.errors).toEqual([]);
        });

        it('should add error if home facility role is invalid', function () {
            delete user.homeFacilityId;

            assignment = new RoleAssignment(
                user, null, null, null, null,
                null, ROLE_TYPES.SUPERVISION, null, null, null
            );

            expect(assignment.errors).toEqual(['referencedataRoles.homeFacilityRoleInvalid']);
        });

    });

});

