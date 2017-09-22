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

describe('facility-list.html template', function() {

    var template, vm, $timeout, $state;

    beforeEach(prepareSuite);

    describe('Add Facility button', function() {

        it('should take user to the Add Facility page', function() {
            template.find('#add-facility').click();
            $timeout.flush();

            expect($state.go)
                .toHaveBeenCalledWith('openlmis.administration.facilities.facility.add');
        });

    });

    function prepareSuite() {
        var $controller, $templateRequest, $compile, $scope;

        module('admin-facility-list', providers);

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $templateRequest = $injector.get('$templateRequest');
            $controller = $injector.get('$controller');
            $compile = $injector.get('$compile');
            $state = $injector.get('$state');
            $timeout = $injector.get('$timeout');
        });

        $scope = $rootScope.$new();

        spyOn($state, 'go');

        vm = $controller('FacilityListController', {
            facilities: [],
            geographicZones: []
        });

        $scope.vm = vm;

        $templateRequest('admin-facility-list/facility-list.html').then(function(requested) {
            template = $compile(requested)($scope);
        });
        $rootScope.$apply();
    }

    function providers($provide) {
        $provide.factory('openlmisPaginationDirective', function() {
            return {};
        });
    }

});
