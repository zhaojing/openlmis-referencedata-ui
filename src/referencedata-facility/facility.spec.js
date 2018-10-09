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

describe('Facility', function() {

    var FacilityDataBuilder;

    beforeEach(function() {
        module('referencedata-facility');

        inject(function($injector) {
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
        });
    });

    describe('isExternallyManaged', function() {

        it('should return true for true', function() {
            this.facility = new FacilityDataBuilder()
                .managedExternally()
                .build();

            expect(this.facility.isManagedExternally()).toBe(true);
        });

        it('should return true for \'true\'', function() {
            this.facility = new FacilityDataBuilder()
                .withExtraData({
                    isManagedExternally: 'true'
                })
                .build();

            expect(this.facility.isManagedExternally()).toBe(true);
        });

        it('should return false for undefined extra data', function() {
            this.facility = new FacilityDataBuilder()
                .withoutExtraData()
                .build();

            expect(this.facility.isManagedExternally()).toBe(false);
        });

        it('should return false for missing flag', function() {
            this.facility = new FacilityDataBuilder().build();

            expect(this.facility.isManagedExternally()).toBe(false);
        });

        it('should return false for false', function() {
            this.facility = new FacilityDataBuilder()
                .withExtraData({
                    isManagedExternally: false
                })
                .build();

            expect(this.facility.isManagedExternally()).toBe(false);
        });

        it('should return false for \'false\'', function() {
            this.facility = new FacilityDataBuilder()
                .withExtraData({
                    isManagedExternally: 'false'
                })
                .build();

            expect(this.facility.isManagedExternally()).toBe(false);
        });

    });

});