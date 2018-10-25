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

describe('supervisoryNode filter', function() {

    beforeEach(function() {
        module('referencedata-supervisory-node');

        var SupervisoryNodeDataBuilder, FacilityDataBuilder;
        inject(function($injector) {
            SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');

            this.$filter = $injector.get('$filter');
        });

        this.supervisoryNodeName = 'Supervisory Node Name';
        this.facilityName = 'Facility Name';

        var facility = new FacilityDataBuilder()
            .withName(this.facilityName)
            .build();

        this.supervisoryNode = new SupervisoryNodeDataBuilder()
            .withName(this.supervisoryNodeName)
            .withFacility(facility)
            .build();

        this.supervisoryNodeWithoutFacility = new SupervisoryNodeDataBuilder()
            .withName(this.supervisoryNodeName)
            .buildWithoutFacility();
    });

    it('should return name with facility if supervisory node has facility', function() {
        expect(this.$filter('supervisoryNode')(this.supervisoryNode))
            .toEqual('Supervisory Node Name (Facility Name)');
    });

    it('should return name without facility if supervisory node has no facility', function() {
        expect(this.$filter('supervisoryNode')(this.supervisoryNodeWithoutFacility))
            .toEqual('Supervisory Node Name');
    });

    it('should throw exception for undefined', function() {
        expect(function() {
            this.$filter('supervisoryNode')(undefined);
        }).toThrow();
    });

    it('should throw exception for null', function() {
        expect(function() {
            this.$filter('supervisoryNode')(null);
        }).toThrow();
    });

});
