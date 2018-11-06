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

describe('SupplyPartnerAddController', function() {

    beforeEach(function() {

        module('admin-supply-partner-add');

        var SupplyPartnerDataBuilder;

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.stateTrackerService = $injector.get('stateTrackerService');

            SupplyPartnerDataBuilder = $injector.get('SupplyPartnerDataBuilder');
        });

        this.supplyPartner = new SupplyPartnerDataBuilder().build();

        spyOn(this.stateTrackerService, 'goToPreviousState');

        this.vm = this.$controller('SupplyPartnerAddController', {
            supplyPartner: this.supplyPartner,
            stateTrackerService: this.stateTrackerService
        });
    });

    describe('$onInit', function() {

        it('should expose supply partner', function() {
            expect(this.vm.supplyPartner).toEqual(this.supplyPartner);
        });

        it('should expose stateTrackerService.goToPreviousState method', function() {
            expect(this.vm.goToPreviousState).toBe(this.stateTrackerService.goToPreviousState);
        });

    });

});
