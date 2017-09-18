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

describe('openlmis.administration.facilities.facility state', function() {

    var state, $state, facilityService, facility, $stateParams, $rootScope, $q;

    beforeEach(prepareSuite);

    it('should be abstract', function() {
        expect(state.abstract).toBe(true);
    });

    describe('facility resolve', function() {

        var facilityResolve;

        beforeEach(function() {
            facilityResolve = state.resolve.facility;
        });

        it('should pass facility if it was given', function() {
            var result;

            $stateParams = {
                facility: facility
            };

            $q.when(facilityResolve($stateParams, facilityService)).then(function(facility) {
                result = facility;
            });
            $rootScope.$apply();

            expect(facilityService.get).not.toHaveBeenCalled();
            expect(result).toEqual(facility);
        });

        it('should download facility if it was not given but ID was given', function() {
            var result;

            $stateParams = {
                facility: undefined,
                facilityId: facility.id
            };

            $q.when(facilityResolve($stateParams, facilityService)).then(function(facility) {
                result = facility;
            });
            $rootScope.$apply();

            expect(facilityService.get).toHaveBeenCalled();
            expect(result).toEqual(facility);
        });

        it('should return empty object if no facility or ID is given', function() {
            var result;

            $stateParams = {}

            $q.when(facilityResolve($stateParams, facilityService)).then(function(facility) {
                result = facility;
            });
            $rootScope.$apply();

            expect(facilityService.get).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });

    });

    function prepareSuite() {
        module('admin-facility');

        inject(function($injector) {
            $state = $injector.get('$state');
            facilityService = $injector.get('facilityService');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
        });

        state = $state.get('openlmis.administration.facilities.facility');

        facility = {
            id: 'some-facility-id'
        };

        spyOn(facilityService, 'get').andReturn($q.when(facility));
    }

});
