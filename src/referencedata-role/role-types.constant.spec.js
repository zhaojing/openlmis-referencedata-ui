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

describe('ROLE_TYPES', function() {

    beforeEach(function() {
        module('referencedata-role');

        inject(function($injector) {
            this.ROLE_TYPES = $injector.get('ROLE_TYPES');
        });
    });

    describe('getLabel', function() {

        it('should return label for valid role type', function() {
            expect(this.ROLE_TYPES.getLabel('SUPERVISION')).toEqual('referencedataRoles.supervision');
            expect(this.ROLE_TYPES.getLabel('ORDER_FULFILLMENT')).toEqual('referencedataRoles.fulfillment');
            expect(this.ROLE_TYPES.getLabel('REPORTS')).toEqual('referencedataRoles.reports');
            expect(this.ROLE_TYPES.getLabel('GENERAL_ADMIN')).toEqual('referencedataRoles.administration');
        });

        it('should throw exception for invalid role type', function() {
            var ROLE_TYPES = this.ROLE_TYPES;

            expect(function() {
                ROLE_TYPES.getLabel('NON_EXISTENT_ROLE');
            }).toThrow('"NON_EXISTENT_ROLE" is not a valid role type');

            expect(function() {
                ROLE_TYPES.getLabel(undefined);
            }).toThrow('"undefined" is not a valid role type');

            expect(function() {
                ROLE_TYPES.getLabel(null);
            }).toThrow('"null" is not a valid role type');

            expect(function() {
                ROLE_TYPES.getLabel('');
            }).toThrow('"" is not a valid role type');
        });

    });

    describe('ROLE_TYPES', function() {

        it('should return a list of role types', function() {
            expect(this.ROLE_TYPES.getRoleTypes()).toEqual([
                'SUPERVISION',
                'ORDER_FULFILLMENT',
                'REPORTS',
                'GENERAL_ADMIN'
            ]);
        });

    });

});
