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

describe('SupplyPartnerListController', function() {

    beforeEach(function() {

        module('admin-supply-partner-list');

        var SupplyPartnerDataBuilder;

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            SupplyPartnerDataBuilder = $injector.get('SupplyPartnerDataBuilder');
        });

        this.supplyPartners = [
            new SupplyPartnerDataBuilder().build(),
            new SupplyPartnerDataBuilder().build()
        ];
        this.stateParams = {
            page: 0,
            size: 10
        };

        this.vm = this.$controller('SupplyPartnerListController', {
            supplyPartners: this.supplyPartners,
            $stateParams: this.stateParams
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose supply partners array', function() {
            expect(this.vm.supplyPartners).toEqual(this.supplyPartners);
        });
    });
});
