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
        vm, requisitionGroup, memberFacilities, stateParams;

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
        stateParams = {
            page: 0,
            size: 10,
            id: 'group-id',
            tab: 0,
            facilityName: 'facility',
        }

        vm = $controller('RequisitionGroupViewController', {
            requisitionGroup: requisitionGroup,
            memberFacilities: memberFacilities,
            $stateParams: stateParams
        });
        vm.$onInit();

        spyOn($state, 'go').andReturn();
    });

    describe('onInit', function() {

        it('should expose requisition group', function() {
            expect(vm.requisitionGroup).toEqual(requisitionGroup);
        });

        it('should expose member facilities', function() {
            expect(vm.memberFacilities).toEqual(memberFacilities);
        });

        it('should expose facility name', function() {
            expect(vm.facilityName).toEqual(stateParams.facilityName);
        });

        it('should expose selected tab', function() {
            expect(vm.selectedTab).toEqual(stateParams.tab);
        });

        it('should expose search for facilities method', function() {
            expect(angular.isFunction(vm.searchForFacilities)).toBe(true);
        });
    });

    describe('searchForFacilities', function() {

        it('should set facility name param', function() {
            vm.facilityName = 'some-name';

            vm.searchForFacilities();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.requisitionGroupView', {
                page: stateParams.page,
                size: stateParams.size,
                id: stateParams.id,
                tab: 1,
                facilityName: 'some-name'
            }, {reload: true});
        });

        it('should call state go method', function() {
            vm.searchForFacilities();
            expect($state.go).toHaveBeenCalled();
        });
    });
});
