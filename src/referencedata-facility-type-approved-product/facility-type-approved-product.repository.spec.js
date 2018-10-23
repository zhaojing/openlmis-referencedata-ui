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

describe('FacilityTypeApprovedProductRepository', function() {

    beforeEach(function() {
        var test = this;
        module('referencedata-facility-type-approved-product', function($provide) {
            test.OpenlmisRepositoryMock = jasmine.createSpy('OpenlmisRepository');
            var OpenlmisRepository = test.OpenlmisRepositoryMock;
            $provide.factory('OpenlmisRepository', function() {
                return OpenlmisRepository;
            });

            test.facilityTypeApprovedProductResourceMock =
                jasmine.createSpy('FacilityTypeApprovedProductResource');
            var facilityTypeApprovedProductResource = test.facilityTypeApprovedProductResourceMock;

            $provide.factory('FacilityTypeApprovedProductResource', function() {
                return function() {
                    return facilityTypeApprovedProductResource;
                };
            });

        });

        inject(function($injector) {
            this.FacilityTypeApprovedProductRepository = $injector.get('FacilityTypeApprovedProductRepository');
            this.FacilityTypeApprovedProduct = $injector.get('FacilityTypeApprovedProduct');
        });
    });

    describe('constructor', function() {

        it('should extend OpenlmisRepository', function() {
            new this.FacilityTypeApprovedProductRepository();

            expect(this.OpenlmisRepositoryMock)
                .toHaveBeenCalledWith(this.FacilityTypeApprovedProduct, this.facilityTypeApprovedProductResourceMock);
        });

        it('should pass the given implementation', function() {
            var implMock = jasmine.createSpyObj('impl', ['create']);

            new this.FacilityTypeApprovedProductRepository(implMock);

            expect(this.OpenlmisRepositoryMock).toHaveBeenCalledWith(this.FacilityTypeApprovedProduct, implMock);
        });

    });

});