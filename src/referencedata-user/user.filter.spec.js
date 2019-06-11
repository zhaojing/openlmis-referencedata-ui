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

describe('user filter', function() {

    beforeEach(function() {
        module('referencedata-user');

        inject(function($injector) {
            this.$filter = $injector.get('$filter');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
        });

        this.firstName = 'John';
        this.lastName = 'Doe';

        this.user = new this.UserDataBuilder()
            .withFirstName(this.firstName)
            .withLastName(this.lastName)
            .buildReferenceDataUserJson();

        this.userFilter = this.$filter('user');
    });

    it('should return user first and last name', function() {
        expect(this.userFilter(this.user)).toEqual('John Doe');
    });

    it('should return undefined if user is not given', function() {
        expect(this.userFilter()).toBeUndefined();
    });

});