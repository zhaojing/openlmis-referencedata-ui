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

describe('ViewItemsModalController', function() {

    beforeEach(function() {
        module('admin-supply-partner-edit');
        module('referencedata-facility');

        //Polyfill snippet as our version of PhantomJS doesn't support startsWith yet
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function(search, pos) {
                return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
            };
        }

        var FacilityDataBuilder;
        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$controller = $injector.get('$controller');
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
        });

        this.modalDeferred = this.$q.defer();
        this.titleLabel = 'title-label';
        this.items = [
            new FacilityDataBuilder()
                .withName('Facility One')
                .withCode('PC1')
                .build(),
            new FacilityDataBuilder()
                .withName('Facility Two pc2')
                .withCode('PS1')
                .build(),
            new FacilityDataBuilder()
                .withName('Facility Three')
                .withCode('XB1')
                .build(),
            new FacilityDataBuilder()
                .withName('Facility Four')
                .withCode('N64')
                .build()
        ];

        this.vm = this.$controller('ViewItemsModalController', {
            modalDeferred: this.modalDeferred,
            titleLabel: this.titleLabel,
            items: this.items
        });

        this.vm.$onInit();
    });

    describe('$onInit', function() {

        it('should expose title label', function() {
            expect(this.vm.titleLabel).toEqual(this.titleLabel);
        });

        it('should expose items', function() {
            expect(this.vm.items).toEqual(this.items);
        });

        it('should expose this.modalDeferred.reject method', function() {
            expect(this.vm.close).toBe(this.modalDeferred.reject);
        });
    });

    describe('search', function() {

        it('should show all for empty filter', function() {
            this.vm.searchText = '';

            this.vm.search();

            expect(this.vm.filteredItems).toEqual(this.items);
        });

        it('should show all for undefined', function() {
            this.vm.searchText = undefined;

            this.vm.search();

            expect(this.vm.filteredItems).toEqual(this.items);
        });

        it('should show all for null', function() {
            this.vm.searchText = null;

            this.vm.search();

            expect(this.vm.filteredItems).toEqual(this.items);
        });

        it('should only return codes starting with the search text', function() {
            this.vm.searchText = 'Ps';

            this.vm.search();

            expect(this.vm.filteredItems).toEqual([this.items[1]]);

            this.vm.searchText = '1';

            this.vm.search();

            expect(this.vm.filteredItems).toEqual([]);
        });

        it('should search by both code and name', function() {
            this.vm.searchText = 'pC';

            this.vm.search();

            expect(this.vm.filteredItems).toEqual([this.items[0], this.items[1]]);
        });

    });

});
