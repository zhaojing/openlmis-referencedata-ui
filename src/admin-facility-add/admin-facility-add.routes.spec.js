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

describe('openlmis.administration.facilities.facility.add state', function() {

    'use strict';

    var $state, $location, $rootScope, $q, geographicZoneService, facilityService, geographicZones,
        facilities, $httpBackend, $templateCache, facilityOperatorService, openlmisModalService,
        facilityTypeService, facilityTypes, facilityOperators;

    beforeEach(prepareSuite);

    it('should be available under \'administration/facilities/new/details\'', function() {
        expect($state.current.name).not.toEqual('openlmis.administration.facilities.facility.add');

        goToUrl('/administration/facilities/new/details');

        expect($state.current.name).toEqual('openlmis.administration.facilities.facility.add');
    });

    it('should resolve facility types', function() {
        facilityTypeService.query.andReturn($q.when(facilityTypes));

        goToUrl('/administration/facilities/new/details');

        expect(getResolvedValue('facilityTypes')).toEqual(facilityTypes);
    });

    it('should resolve geographicZones', function() {
        geographicZoneService.getAll.andReturn($q.when({
            content: geographicZones
        }));

        goToUrl('/administration/facilities/new/details');

        expect(getResolvedValue('geographicZones')).toEqual(geographicZones);
    });

    it('should resolve facility operators', function() {
        facilityOperatorService.getAll.andReturn($q.when(facilityOperators));

        goToUrl('/administration/facilities/new/details');

        expect(getResolvedValue('facilityOperators')).toEqual(facilityOperators);
    });

    it('should resolve facility', function() {
        goToUrl('/administration/facilities/new/details');

        expect(getResolvedValue('facility')).toEqual({});
    });

    it('should use template', function() {
        spyOn($templateCache, 'get').andCallThrough();

        goToUrl('/administration/facilities/new/details');

        expect($templateCache.get).toHaveBeenCalledWith('admin-facility-add/facility-add.html');
    });

    function prepareSuite() {
        module('admin-facility-add');
        inject(services);
        prepareTestData();
        prepareSpies();

        $state.go('openlmis.administration.facilities');
        $rootScope.$apply();
    }

    function services($injector) {
        $q = $injector.get('$q');
        $state = $injector.get('$state');
        $location = $injector.get('$location');
        $rootScope = $injector.get('$rootScope');
        facilityService = $injector.get('facilityService');
        $templateCache = $injector.get('$templateCache');
        facilityTypeService = $injector.get('facilityTypeService');
        geographicZoneService = $injector.get('geographicZoneService');
        facilityOperatorService = $injector.get('facilityOperatorService');
    }

    function prepareTestData() {
        facilities = [
            createObjectWithId('facility-one'),
            createObjectWithId('facility-two'),
        ];

        facilityTypes = [
            createObjectWithId('facility-type-one'),
            createObjectWithId('facility-type-two')
        ];

        geographicZones = [
            createObjectWithId('geographic-zone-one'),
            createObjectWithId('geographic-zone-two')
        ];

        facilityOperators = [
            createObjectWithId('facility-operator-one'),
            createObjectWithId('facility-operator-two')
        ];
    }

    function prepareSpies() {
        spyOn(geographicZoneService, 'getAll').andReturn($q.when({
            content: []
        }));
        spyOn(facilityService, 'search').andReturn($q.when({
            content: []
        }));
        spyOn(facilityTypeService, 'query').andReturn($q.when([]));
        spyOn(facilityOperatorService, 'getAll').andReturn($q.when([]));
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

    function createObjectWithId(id) {
        return {
            id: id
        };
    }

});
