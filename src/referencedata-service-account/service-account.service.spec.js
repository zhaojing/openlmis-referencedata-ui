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

    beforeEach(function() {
        module('referencedata-service-account');

        inject(function($injector) {
            this.referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            this.serviceAccountService = $injector.get('serviceAccountService');
            this.$rootScope = $injector.get('$rootScope');
            this.$httpBackend = $injector.get('$httpBackend');
            this.ServiceAccountBuilder = $injector.get('ServiceAccountBuilder');
        });

        this.serviceAccount = new this.ServiceAccountBuilder().build();

        this.serviceAccounts = [
            this.serviceAccount,
            new this.ServiceAccountBuilder().build()
        ];
    });

    describe('create', function() {

        it('should resolve to service account', function() {
            this.$httpBackend
                .expectPOST(this.referencedataUrlFactory('/api/serviceAccounts'))
                .respond(200, this.serviceAccount);

            var result;
            this.serviceAccountService
                .create(this.serviceAccount.token)
                .then(function(serviceAccount) {
                    result = serviceAccount;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.serviceAccount));
        });
    });

    describe('remove', function() {

        it('should remove the service account', function() {
            this.$httpBackend
                .expectDELETE(this.referencedataUrlFactory('/api/serviceAccounts/' + this.serviceAccount.token))
                .respond(204);

            var removed;
            this.serviceAccountService
                .remove(this.serviceAccount.token)
                .then(function() {
                    removed = true;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(removed).toBe(true);
        });
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });
});
