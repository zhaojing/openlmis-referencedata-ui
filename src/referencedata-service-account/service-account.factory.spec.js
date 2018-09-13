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

describe('serviceAccountFactory', function() {

    var $q, $rootScope, serviceAccountService, serviceAccountFactory, apiKeysService, ServiceAccountBuilder,
        ApiKeyBuilder, serviceAccount, apiKey;

    beforeEach(function() {
        module('referencedata-service-account');

        inject(function($injector) {
            $q = $injector.get('$q');
            serviceAccountFactory = $injector.get('serviceAccountFactory');
            apiKeysService = $injector.get('apiKeysService');
            serviceAccountService = $injector.get('serviceAccountService');
            $rootScope = $injector.get('$rootScope');
            ServiceAccountBuilder = $injector.get('ServiceAccountBuilder');
            ApiKeyBuilder = $injector.get('ApiKeyBuilder');
        });

        apiKey = new ApiKeyBuilder().build();
        serviceAccount = new ServiceAccountBuilder().withToken(apiKey.token)
            .build();
    });

    describe('create', function() {

        beforeEach(function() {
            spyOn(serviceAccountService, 'create').andReturn($q.resolve(serviceAccount));
            spyOn(apiKeysService, 'create').andReturn($q.resolve(apiKey));
        });

        it('should return promise', function() {
            var result = serviceAccountFactory.create();
            $rootScope.$apply();

            expect(result.then).not.toBeUndefined();
        });

        it('should create service account', function() {
            var result;

            serviceAccountFactory.create().then(function(data) {
                result = data;
            });
            $rootScope.$apply();

            expect(result.token).toEqual(serviceAccount.token);
            expect(serviceAccountService.create).toHaveBeenCalledWith(apiKey.token);
            expect(apiKeysService.create).toHaveBeenCalled();
        });
    });

    describe('remove', function() {

        var token = 'key';

        beforeEach(function() {
            spyOn(serviceAccountService, 'remove').andReturn($q.resolve());
            spyOn(apiKeysService, 'remove').andReturn($q.resolve());
        });

        it('should return promise', function() {
            var result = serviceAccountService.remove(token);

            expect(result.then).not.toBeUndefined();
        });

        it('should remove service account', function() {
            serviceAccountFactory.remove(serviceAccount.token);
            $rootScope.$apply();

            expect(serviceAccountService.remove).toHaveBeenCalledWith(serviceAccount.token);
            expect(apiKeysService.remove).toHaveBeenCalledWith(serviceAccount.token);
        });
    });
});
