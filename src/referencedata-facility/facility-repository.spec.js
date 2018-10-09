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

describe('FacilityRepository', function() {

    var FacilityRepository, OpenlmisRepositoryMock, facilityResourceMock, Facility;

    beforeEach(function() {
        module('referencedata-facility', function($provide) {
            OpenlmisRepositoryMock = jasmine.createSpy('OpenlmisRepository');
            $provide.factory('OpenlmisRepository', function() {
                return OpenlmisRepositoryMock;
            });

            facilityResourceMock = jasmine.createSpy('FacilityResource');
            $provide.factory('FacilityResource', function() {
                return function() {
                    return facilityResourceMock;
                };
            });
        });

        inject(function($injector) {
            FacilityRepository = $injector.get('FacilityRepository');
            Facility = $injector.get('Facility');
        });
    });

    describe('constructor', function() {

        it('should extend OpenlmisRepository', function() {
            new FacilityRepository();

            expect(OpenlmisRepositoryMock).toHaveBeenCalledWith(Facility, facilityResourceMock);
        });

        it('should pass the given implementation', function() {
            var implMock = jasmine.createSpyObj('impl', ['create']);

            new FacilityRepository(implMock);

            expect(OpenlmisRepositoryMock).toHaveBeenCalledWith(Facility, implMock);
        });

    });

});