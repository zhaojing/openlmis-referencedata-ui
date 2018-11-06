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

describe('SupplyPartner', function() {

    beforeEach(function() {
        module('referencedata-supply-partner');

        var SupplyPartnerDataBuilder, SupplyPartnerRepository, SupplyPartner;

        inject(function($injector) {
            SupplyPartnerDataBuilder = $injector.get('SupplyPartnerDataBuilder');
            SupplyPartnerRepository = $injector.get('SupplyPartnerRepository');
            SupplyPartner = $injector.get('SupplyPartner');

            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.json = new SupplyPartnerDataBuilder().buildJson();
        this.repository = new SupplyPartnerRepository();
        this.supplyPartner = new SupplyPartner(this.json, this.repository);

        spyOn(this.repository, 'create');
    });

    describe('constructor', function() {

        it('should set all properties', function() {
            expect(this.supplyPartner.id).toEqual(this.json.id);
            expect(this.supplyPartner.name).toEqual(this.json.name);
            expect(this.supplyPartner.code).toEqual(this.json.code);
            expect(this.supplyPartner.repository).toEqual(this.repository);
        });

    });

    describe('create', function() {

        it('should reject if create fails', function() {
            this.repository.create.andReturn(this.$q.reject());

            var rejected;
            this.supplyPartner.create().catch(function() {
                rejected = true;
            });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
        });

        it('should resolve when create is successful', function() {
            this.repository.create.andReturn(this.$q.resolve(this.supplyPartner));

            var result;
            this.supplyPartner.create().then(function(response) {
                result = response;
            });
            this.$rootScope.$apply();

            expect(result).toEqual(this.supplyPartner);
        });

    });

});
