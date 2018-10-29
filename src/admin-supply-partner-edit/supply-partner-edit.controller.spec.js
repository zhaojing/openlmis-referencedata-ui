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

describe('SupplyPartnerEditController', function() {

    var $state, $controller,
        vm, supplyPartner, associations;

    beforeEach(function() {
        module('admin-supply-partner-edit');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
        });

        supplyPartner = {
            id: 'partner-id',
            name: 'partner-name'
        };
        associations = [
            {
                id: 'assoc-1'
            },
            {
                id: 'assoc-2'
            }
        ];

        vm = $controller('SupplyPartnerEditController', {
            supplyPartner: supplyPartner,
            associations: associations
        });
        vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose goToSupplyPartnerList method', function() {
            expect(angular.isFunction(vm.goToSupplyPartnerList)).toBe(true);
        });

        it('should expose supplyPartner', function() {
            expect(vm.supplyPartner).toEqual(supplyPartner);
        });

        it('should expose associations', function() {
            expect(vm.associations).toEqual(associations);
        });
    });

    describe('goToSupplyPartnerList', function() {

        beforeEach(function() {
            spyOn($state, 'go').andReturn();
            vm.goToSupplyPartnerList();
        });

        it('should call state go with correct params', function() {
            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });
    });
});
