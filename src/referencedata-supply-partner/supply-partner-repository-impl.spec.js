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

describe('SupplyPartnerRepositoryImpl', function() {

    var supplyPartnerResourceMock, programServiceMock, supervisoryNodeResourceMock, facilityResourceMock,
        orderableResourceMock;

    beforeEach(function() {
        module('referencedata-supply-partner', function($provide) {
            supplyPartnerResourceMock = jasmine.createSpyObj('supplyPartnerResource', [
                'create', 'update', 'get', 'query'
            ]);
            $provide.factory('SupplyPartnerResource', function() {
                return function() {
                    return supplyPartnerResourceMock;
                };
            });
            supervisoryNodeResourceMock = jasmine.createSpyObj('supervisoryNodeResource', [
                'query'
            ]);
            $provide.factory('SupervisoryNodeResource', function() {
                return function() {
                    return supervisoryNodeResourceMock;
                };
            });
            facilityResourceMock = jasmine.createSpyObj('facilityResource', [
                'query'
            ]);
            $provide.factory('FacilityResource', function() {
                return function() {
                    return facilityResourceMock;
                };
            });
            orderableResourceMock = jasmine.createSpyObj('orderableResource', [
                'query'
            ]);
            $provide.factory('OrderableResource', function() {
                return function() {
                    return orderableResourceMock;
                };
            });
        });

        var SupplyPartnerRepositoryImpl, ProgramDataBuilder, SupervisoryNodeDataBuilder, FacilityDataBuilder,
            OrderableDataBuilder, SupplyPartnerDataBuilder, SupplyPartnerAssociationDataBuilder,
            ObjectReferenceDataBuilder;
        inject(function($injector) {
            SupplyPartnerRepositoryImpl = $injector.get('SupplyPartnerRepositoryImpl');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            SupplyPartnerDataBuilder = $injector.get('SupplyPartnerDataBuilder');
            SupplyPartnerAssociationDataBuilder = $injector.get('SupplyPartnerAssociationDataBuilder');
            ObjectReferenceDataBuilder = $injector.get('ObjectReferenceDataBuilder');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            programServiceMock = $injector.get('programService');
            spyOn(programServiceMock, 'getAll');
        });

        this.supplyPartnerRepositoryImpl = new SupplyPartnerRepositoryImpl();

        this.programId = 'spri-program-id-1';
        this.supervisoryNodeId = 'spri-node-id-1';
        this.facilityId = 'spri-facility-id-1';
        this.orderableId = 'spri-orderable-id-1';
        this.programs = [
            new ProgramDataBuilder()
                .withId(this.programId)
                .build(),
            new ProgramDataBuilder().build()
        ];
        this.supervisoryNodes = [
            new SupervisoryNodeDataBuilder()
                .withId(this.supervisoryNodeId)
                .build(),
            new SupervisoryNodeDataBuilder().build()
        ];
        this.facilities = [
            new FacilityDataBuilder()
                .withId(this.facilityId)
                .build(),
            new FacilityDataBuilder().build()
        ];
        this.orderables = [
            new OrderableDataBuilder()
                .withId(this.orderableId)
                .build(),
            new OrderableDataBuilder().build()
        ];

        this.supplyPartner = new SupplyPartnerDataBuilder()
            .addAssociation(new SupplyPartnerAssociationDataBuilder()
                .withProgram(new ObjectReferenceDataBuilder()
                    .withId(this.programId)
                    .withResource('program')
                    .build())
                .withSupervisoryNode(new ObjectReferenceDataBuilder()
                    .withId(this.supervisoryNodeId)
                    .withResource('supervisoryNode')
                    .build())
                .addFacility(new ObjectReferenceDataBuilder()
                    .withId(this.facilityId)
                    .withResource('facility')
                    .build())
                .addOrderable(new ObjectReferenceDataBuilder()
                    .withId(this.orderableId)
                    .withResource('orderable')
                    .build())
                .build())
            .build();
    });

    describe('create', function() {

        it('should reject if unsuccessful', function() {
            supplyPartnerResourceMock.create.andReturn(this.$q.reject());

            var rejected;
            this.supplyPartnerRepositoryImpl.create(this.supplyPartner)
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
            expect(supplyPartnerResourceMock.create).toHaveBeenCalledWith(this.supplyPartner);
        });

        it('should resolve and return object if successful', function() {
            supplyPartnerResourceMock.create.andReturn(this.$q.resolve(this.supplyPartner));

            var result;
            this.supplyPartnerRepositoryImpl.create(this.supplyPartner)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.supplyPartner);
            expect(supplyPartnerResourceMock.create).toHaveBeenCalledWith(this.supplyPartner);
        });

    });

    describe('update', function() {

        it('should reject if unsuccessful', function() {
            supplyPartnerResourceMock.update.andReturn(this.$q.reject());

            var rejected;
            this.supplyPartnerRepositoryImpl.update(this.supplyPartner)
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
            expect(supplyPartnerResourceMock.update).toHaveBeenCalledWith(this.supplyPartner);
        });

        it('should resolve if successful', function() {
            supplyPartnerResourceMock.update.andReturn(this.$q.resolve(this.supplyPartner));

            var result;
            this.supplyPartnerRepositoryImpl.update(this.supplyPartner)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.supplyPartner);
            expect(supplyPartnerResourceMock.update).toHaveBeenCalledWith(this.supplyPartner);
        });

    });

    describe('get', function() {

        it('should reject if get supply partner unsuccessful', function() {
            supplyPartnerResourceMock.get.andReturn(this.$q.reject());

            var rejected;
            this.supplyPartnerRepositoryImpl.get(this.supplyPartner.id)
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
            expect(supplyPartnerResourceMock.get).toHaveBeenCalledWith(this.supplyPartner.id);
        });

        it('should resolve and return object with all expanded if all successful', function() {
            supplyPartnerResourceMock.get.andReturn(this.$q.resolve(this.supplyPartner));
            programServiceMock.getAll.andReturn(this.$q.resolve(this.programs));
            supervisoryNodeResourceMock.query.andReturn(this.$q.resolve({
                content: this.supervisoryNodes
            }));
            facilityResourceMock.query.andReturn(this.$q.resolve({
                content: this.facilities
            }));
            orderableResourceMock.query.andReturn(this.$q.resolve({
                content: this.orderables
            }));

            var result;
            this.supplyPartnerRepositoryImpl.get(this.supplyPartner.id)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();

            expect(result.code).toEqual(this.supplyPartner.code);
            expect(result.associations[0].program.code).toEqual(this.programs[0].code);
            expect(result.associations[0].supervisoryNode.code).toEqual(this.supervisoryNodes[0].code);
            expect(supplyPartnerResourceMock.get).toHaveBeenCalledWith(this.supplyPartner.id);
            expect(programServiceMock.getAll).toHaveBeenCalled();
            expect(supervisoryNodeResourceMock.query).toHaveBeenCalledWith({
                id: [this.supervisoryNodeId]
            });

            expect(facilityResourceMock.query).toHaveBeenCalledWith({
                id: [this.facilityId]
            });

            expect(orderableResourceMock.query).toHaveBeenCalledWith({
                id: [this.orderableId]
            });
        });

    });

});
