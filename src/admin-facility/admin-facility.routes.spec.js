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

    'use strict';

    var $state, $location, $rootScope, $q, geographicZoneService, facilityService, facilities;

    beforeEach(prepareSuite);

    it('should resolve to facility if it was given', function() {
        goToState('openlmis.administration.facilities.facility.fake', {
            facility: facilities[0]
        });

        expect($state.current.name).toEqual('openlmis.administration.facilities.facility.fake');
        expect(getResolvedValue('facility')).toEqual(facilities[0]);
    });

    it('should resolve to empty object', function() {
        goToUrl('/administration/facilities/new/fake');

        expect($state.current.name).toEqual('openlmis.administration.facilities.facility.fake');
        expect(getResolvedValue('facility')).toEqual({});
    });

    function prepareSuite() {
        module('admin-facility', fakeState);
        inject(services);
        prepareTestData();
        prepareSpies();

        $state.go('openlmis');
        $rootScope.$apply();
    }

    function fakeState($stateProvider) {
        $stateProvider.state('openlmis.administration.facilities.facility.fake', {
            url: '/fake'
        });
    }

    function services($injector) {
        $state = $injector.get('$state');
        $location = $injector.get('$location');
        $rootScope = $injector.get('$rootScope');
        geographicZoneService = $injector.get('geographicZoneService');
        facilityService = $injector.get('facilityService');
        $q = $injector.get('$q');
    }

    function prepareTestData() {
        facilities = [{
            name: 'Facility One',
            id: 'facility-one'
        }, {
            name: 'Facility Two',
            id: 'facility-two'
        }];
    }

    function prepareSpies() {
        spyOn(geographicZoneService, 'getAll').andReturn($q.when({
            content: []
        }));
        spyOn(facilityService, 'search').andReturn($q.when({
            content: []
        }));
    }

    function goToUrl(url) {
        $location.url(url);
        $rootScope.$apply();
    }

    function goToState() {
        $state.go.apply(this, arguments);
        $rootScope.$apply();
    }

    function getResolvedValue(name) {
        return $state.$current.locals.globals[name];
    }

});
