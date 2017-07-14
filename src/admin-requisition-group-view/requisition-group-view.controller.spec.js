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

describe('RequisitionGroupViewController', function () {

    var $state, $controller,
        vm, requisitionGroup, memberFacilities;

    beforeEach(function() {
        module('admin-requisition-group-view');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
        });

        requisitionGroup = {
            id: 'group-id',
            name: 'group-name'
        };
        memberFacilities = [
            {
                id: 'facility-1'
            },
            {
                id: 'facility-2'
            }
        ];

        vm = $controller('RequisitionGroupViewController', {
            requisitionGroup: requisitionGroup,
            memberFacilities: memberFacilities
        });
        vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose requisition group', function() {
            expect(vm.requisitionGroup).toEqual(requisitionGroup);
        });

        it('should expose member facilities', function() {
            expect(vm.memberFacilities).toEqual(memberFacilities);
        });
    });
});
