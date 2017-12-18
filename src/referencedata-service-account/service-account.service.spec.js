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

describe('serviceAccountService', function() {

    var referencedataUrlFactory, $httpBackend, $rootScope, serviceAccountService, ServiceAccountBuilder,
        serviceAccounts;

    beforeEach(function() {
        module('referencedata-service-account');

        inject(function($injector) {
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            serviceAccountService = $injector.get('serviceAccountService');
            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');
            ServiceAccountBuilder = $injector.get('ServiceAccountBuilder');
        });

        serviceAccounts = [
            new ServiceAccountBuilder().build(),
            new ServiceAccountBuilder().build()
        ];
    });

    describe('create', function() {

        beforeEach(function() {
            $httpBackend.whenPOST(referencedataUrlFactory('/api/serviceAccounts')).respond(200, serviceAccounts[0]);
        });

        it('should return promise', function() {
            var result = serviceAccountService.create();
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to service account', function() {
            var result;

            serviceAccountService.create().then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.apiKey).toEqual(serviceAccounts[0].apiKey);
        });

        it('should make a proper request', function() {
            $httpBackend.expectPOST(referencedataUrlFactory('/api/serviceAccounts'));

            serviceAccountService.create();
            $httpBackend.flush();
        });
    });

    describe('remove', function() {

        beforeEach(function() {
            $httpBackend.whenDELETE(referencedataUrlFactory('/api/serviceAccounts')).respond(204);
        });

        it('should return promise', function() {
            var result = serviceAccountService.remove();
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should make a proper request', function() {
            $httpBackend.expectDELETE(referencedataUrlFactory('/api/serviceAccounts'));

            serviceAccountService.remove();
            $httpBackend.flush();
        });
    });

    describe('query', function() {

        var params = {
            page: 1,
            size: 10
        };

        beforeEach(function() {
            $httpBackend.whenGET(referencedataUrlFactory('/api/serviceAccounts?page=' + params.page + '&size=' + params.size)).respond(200, {
                content: serviceAccounts
            });
        });

        it('should return promise', function() {
            var result = serviceAccountService.query(params);
            $httpBackend.flush();

            expect(result.then).not.toBeUndefined();
        });

        it('should resolve to service accounts page', function() {
            var result;

            serviceAccountService.query(params)
            .then(function(data) {
                result = data;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.content).toEqual(serviceAccounts);
        });

        it('should make a proper request', function() {
            $httpBackend.expectGET(referencedataUrlFactory('/api/serviceAccounts?page=' + params.page + '&size=' + params.size));

            serviceAccountService.query(params);
            $httpBackend.flush();
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
