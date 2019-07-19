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

describe('isaService', function() {

    beforeEach(function() {
        module('referencedata-isa');

        inject(function($injector) {
            this.referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            this.isaService = $injector.get('isaService');
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
        });
    });

    describe('getDownloadUrl', function() {

        it('should return download URL', function() {
            var result = this.isaService.getDownloadUrl();

            expect(result).toEqual(this.referencedataUrlFactory('/api/idealStockAmounts?format=csv'));
        });
    });

    describe('upload', function() {

        it('should resolve to catalog items', function() {
            this.file = 'file-content';

            this.$httpBackend
                .expectPOST(this.referencedataUrlFactory('/api/idealStockAmounts?format=csv'))
                .respond(200, {
                    content: this.file
                });

            var result;
            this.isaService.upload(this.file).then(function(data) {
                result = data;
            });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result.content)).toEqual(angular.toJson(this.file));
        });
    });
});
