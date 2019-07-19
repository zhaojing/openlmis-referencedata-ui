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

describe('FacilityTypeListController', function() {

    beforeEach(function() {
        module('admin-facility-type-list');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
        });

        this.facilityTypes = [
            new this.FacilityTypeDataBuilder().build(),
            new this.FacilityTypeDataBuilder().build()
        ];

        this.vm = this.$controller('FacilityTypeListController', {
            facilityTypes: this.facilityTypes
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose facility types', function() {
            expect(this.vm.facilityTypes).toBe(this.facilityTypes);
        });
    });
});
