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

describe('openlmis.administration.facilities state', function() {

    'use strict';

    var $state, $location, $rootScope, $q, geographicZoneService, facilityService, geographicZones,
        facilities, $httpBackend, $templateCache;

    beforeEach(prepareSuite);

    it('should be available under /administration/facilities URL', function() {
        expect($state.current.name).not.toEqual('openlmis.administration.facilities');

        goTo('/administration/facilities');

        expect($state.current.name).toEqual('openlmis.administration.facilities');
    });

    it('should resolve geographicZones', function() {
        geographicZoneService.getAll.andReturn($q.when({
            content: geographicZones
        }));

        goTo('/administration/facilities');

        expect($state.current.name).toEqual('openlmis.administration.facilities');
        expect(getResolvedValue('geographicZones')).toEqual(geographicZones);
    });

    it('should resolve facilities', function() {
        facilityService.search.andReturn($q.when({
            content: facilities
        }));

        goTo('/administration/facilities?name=Facility&page=1&size=2&zoneId=zone-one');

        expect($state.current.name).toEqual('openlmis.administration.facilities');
        expect(getResolvedValue('facilities')).toEqual(facilities);
        expect(facilityService.search).toHaveBeenCalledWith({
            page: '1',
            size: '2'
        }, {
            name: 'Facility',
            zoneId: 'zone-one'
        });
    });

    it('should use template', function() {
        spyOn($templateCache, 'get').andCallThrough();

        goTo('/administration/facilities');

        expect($templateCache.get).toHaveBeenCalledWith('admin-facility-list/facility-list.html');
    });

    function prepareSuite() {
        module('admin-facility-list');
        inject(services);
        prepareTestData();
        prepareSpies();

        $state.go('openlmis');
        $rootScope.$apply();
    }

    function services($injector) {
        $state = $injector.get('$state');
        $location = $injector.get('$location');
        $rootScope = $injector.get('$rootScope');
        geographicZoneService = $injector.get('geographicZoneService');
        facilityService = $injector.get('facilityService');
        $q = $injector.get('$q');
        $httpBackend = $injector.get('$httpBackend');
        $templateCache = $injector.get('$templateCache');
    }

    function prepareTestData() {
        geographicZones = [{
            id: 'zone-one'
        }, {
            id: 'zone-two'
        }];

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

    function goTo(url) {
        $location.url(url);
        $rootScope.$apply();
    }

    function getResolvedValue(name) {
        return $state.$current.locals.globals[name];
    }

});
