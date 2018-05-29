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

describe('USER_PASSWORD_OPTIONS', function() {

    var USER_PASSWORD_OPTIONS;

    beforeEach(function() {
        module('admin-user-form');

        inject(function($injector) {
            USER_PASSWORD_OPTIONS = $injector.get('USER_PASSWORD_OPTIONS');
        });
    });

    describe('getLabel', function() {

        it('should return label for valid option', function() {
            expect(
                USER_PASSWORD_OPTIONS.getLabel('SEND_EMAIL')
            ).toEqual('adminUserForm.sendResetEmail');

            expect(
                USER_PASSWORD_OPTIONS.getLabel('RESET_PASSWORD')
            ).toEqual('adminUserForm.setPasswordManually');
        });

        it('should throw exception for invalid role type', function() {
            expect(function() {
                USER_PASSWORD_OPTIONS.getLabel('NON_EXISTENT_ROLE');
            }).toThrow('"NON_EXISTENT_ROLE" is not a valid option');

            expect(function() {
                USER_PASSWORD_OPTIONS.getLabel(undefined);
            }).toThrow('"undefined" is not a valid option');

            expect(function() {
                USER_PASSWORD_OPTIONS.getLabel(null);
            }).toThrow('"null" is not a valid option');

            expect(function() {
                USER_PASSWORD_OPTIONS.getLabel('');
            }).toThrow('"" is not a valid option');
        });

    });

    describe('USER_PASSWORD_OPTIONS', function() {

        it('should return a list of options', function() {
            expect(USER_PASSWORD_OPTIONS.getOptions()).toEqual([
                'SEND_EMAIL',
                'RESET_PASSWORD'
            ]);
        });

    });

});
