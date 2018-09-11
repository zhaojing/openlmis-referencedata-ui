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

describe('requisitionGroupService', function() {

    var $rootScope, $httpBackend, referencedataUrlFactory, requisitionGroupService, requisitionGroups;

    beforeEach(function() {
        module('referencedata-requisition-group');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            requisitionGroupService = $injector.get('requisitionGroupService');
        });

        requisitionGroups = [
            {
                id: '1',
                code: 'RG1'
            },
            {
                id: '2',
                code: 'RG2'
            }
        ];
    });

    describe('get', function() {

        beforeEach(function() {
            $httpBackend.when('GET', referencedataUrlFactory('/api/requisitionGroups/' + requisitionGroups[0].id))
                .respond(200, requisitionGroups[0]);
        });

        it('should return promise', function() {
            var result = requisitionGroupService.get(requisitionGroups[0].id);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to requisition group', function() {
            var result;

            requisitionGroupService.get(requisitionGroups[0].id).then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(requisitionGroups[0]));
        });

        it('should make a proper request', function() {
            $httpBackend.expect('GET', referencedataUrlFactory('/api/requisitionGroups/' + requisitionGroups[0].id));

            requisitionGroupService.get(requisitionGroups[0].id);
            $httpBackend.flush();
        });
    });

    describe('getAll', function() {

        beforeEach(function() {
            $httpBackend.when('GET', referencedataUrlFactory('/api/requisitionGroups')).respond(200, requisitionGroups);
        });

        it('should return promise', function() {
            var result = requisitionGroupService.getAll(requisitionGroups[0].id);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to requisition groups', function() {
            var result;

            requisitionGroupService.getAll().then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(requisitionGroups));
        });

        it('should make a proper request', function() {
            $httpBackend.expect('GET', referencedataUrlFactory('/api/requisitionGroups'));

            requisitionGroupService.getAll(requisitionGroups[0].id);
            $httpBackend.flush();
        });
    });

    describe('search', function() {

        var searchParams,
            paginationParams;

        beforeEach(function() {
            searchParams = {
                code: 'some-code',
                name: 'some-name'
            };
            paginationParams = {
                page: 0,
                size: 10
            };
            $httpBackend.when('POST', referencedataUrlFactory('/api/requisitionGroups/search?page=' +
                paginationParams.page + '&size=' + paginationParams.size)).respond(200, {
                content: requisitionGroups
            });
        });

        it('should return promise', function() {
            var result = requisitionGroupService.search(paginationParams, searchParams);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to requisition groups', function() {
            var result;

            requisitionGroupService.search(paginationParams, searchParams).then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result.content)).toEqual(angular.toJson(requisitionGroups));
        });

        it('should make a proper request', function() {
            $httpBackend.expect('POST', referencedataUrlFactory('/api/requisitionGroups/search?page=' +
                paginationParams.page + '&size=' + paginationParams.size));

            requisitionGroupService.search(paginationParams, searchParams);
            $httpBackend.flush();
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });
});
