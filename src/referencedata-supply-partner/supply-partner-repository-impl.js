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

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name referencedata-supply-partner.SupplyPartnerRepositoryImpl
     *
     * @description
     * Default implementation of the SupplyPartnerRepository interface. Responsible for combining server
     * responses into single object to be passed to the SupplyPartner class constructor.
     */
    angular
        .module('referencedata-supply-partner')
        .factory('SupplyPartnerRepositoryImpl', SupplyPartnerRepositoryImpl);

    SupplyPartnerRepositoryImpl.$inject = [
        'SupplyPartnerResource', '$q', 'SupervisoryNodeResource', 'programService', 'FacilityResource',
        'OrderableResource'
    ];

    function SupplyPartnerRepositoryImpl(SupplyPartnerResource, $q, SupervisoryNodeResource,
                                         programService, FacilityResource, OrderableResource) {

        SupplyPartnerRepositoryImpl.prototype.create = create;
        SupplyPartnerRepositoryImpl.prototype.update = update;
        SupplyPartnerRepositoryImpl.prototype.get = get;
        SupplyPartnerRepositoryImpl.prototype.query = query;

        return SupplyPartnerRepositoryImpl;

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartnerRepositoryImpl
         * @name SupplyPartnerRepositoryImpl
         * @constructor
         * 
         * @description
         * Creates an object of the SupplyPartnerRepositoryImpl class and initiates all required
         * dependencies.
         */
        function SupplyPartnerRepositoryImpl() {
            this.supplyPartnerResource = new SupplyPartnerResource();
            this.supervisoryNodeResource = new SupervisoryNodeResource();
            this.facilityResource = new FacilityResource();
            this.orderableResource = new OrderableResource();
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartnerRepositoryImpl
         * @name create
         * 
         * @description
         * Creates a new supply partner on the OpenLMIS server.
         * 
         * @param  {Object}  json the JSON representation of the supply partner
         * @return {Promise}      the promise resolving to combined JSON which can be used for
         *                        creating instance of the SupplyPartner class
         */
        function create(json) {
            return this.supplyPartnerResource.create(json);
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartnerRepositoryImpl
         * @name update
         * 
         * @description
         * Updates the given supply partner on the OpenLMIS server.
         * 
         * @param  {Object}  json the JSON representation of the supply partner
         * @return {Promise}      returns a promise resolving when the update was successful,
         *                        rejects if anything goes wrong
         */
        function update(json) {
            return this.supplyPartnerResource.update(json);
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartnerRepositoryImpl
         * @name getById
         * 
         * @description
         * Retrieves a supply partner with given ID from the OpenLMIS server.
         * 
         * @param  {Object}  id the supply partner ID
         * @return {Promise}    the promise resolving to combined JSON which can be used for
         *                      creating instance of the SupplyPartner class
         */
        function get(id) {
            var supervisoryNodeResource = this.supervisoryNodeResource;
            var facilityResource = this.facilityResource;
            var orderableResource = this.orderableResource;
            return this.supplyPartnerResource.get(id)
                .then(function(response) {
                    var supplyPartner = response;
                    var supervisoryNodeIds = supplyPartner.associations.map(function(association) {
                        return association.supervisoryNode.id;
                    });
                    var facilityIds = [];
                    var orderableIds = [];
                    supplyPartner.associations.forEach(function(association) {
                        association.facilities.forEach(function(facility) {
                            if (facilityIds.indexOf(facility.id) === -1) {
                                facilityIds.push(facility.id);
                            }
                        });
                        association.orderables.forEach(function(orderable) {
                            if (orderableIds.indexOf(orderable.id) === -1) {
                                orderableIds.push(orderable.id);
                            }
                        });
                    });

                    return $q.all([
                        programService.getAll(),
                        supervisoryNodeResource.query({
                            id: supervisoryNodeIds
                        }),
                        facilityResource.query({
                            id: facilityIds
                        }),
                        orderableResource.query({
                            id: orderableIds
                        })
                    ]).then(function(responses) {
                        var programs = responses[0],
                            supervisoryNodes = responses[1].content,
                            facilities = responses[2].content,
                            orderables = responses[3].content;

                        return combineResponses(supplyPartner, programs, supervisoryNodes, facilities, orderables);
                    }, function() {
                        return supplyPartner;
                    });
                });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartnerRepositoryImpl
         * @name query
         * 
         * @description
         * Retrieves the supply partners matching the given parameters from the OpenLMIS server.
         *
         * @param  {Object}  params the parameters to search with
         * @return {Promise}        the promise resolving to a page of supply partners
         */
        function query(params) {
            return this.supplyPartnerResource.query(params);
        }

        function combineResponses(supplyPartner, programs, supervisoryNodes, facilities, orderables) {
            var facilitiesMap = facilities.reduce(function(map, facility) {
                map[facility.id] = facility;
                return map;
            }, {});
            var orderablesMap = orderables.reduce(function(map, orderable) {
                map[orderable.id] = orderable;
                return map;
            }, {});

            supplyPartner.associations.forEach(function(association) {
                programs.forEach(function(program) {
                    if (association.program.id === program.id) {
                        association.program = program;
                    }
                });

                supervisoryNodes.forEach(function(supervisoryNode) {
                    if (association.supervisoryNode.id === supervisoryNode.id) {
                        association.supervisoryNode = supervisoryNode;
                    }
                });

                association.facilities = association.facilities.map(function(facility) {
                    return facilitiesMap[facility.id];
                });

                association.orderables = association.orderables.map(function(orderable) {
                    var filledInOrderable = orderablesMap[orderable.id];
                    filledInOrderable.code = filledInOrderable.productCode;
                    filledInOrderable.name = filledInOrderable.fullProductName;
                    return filledInOrderable;
                });
            });

            return supplyPartner;
        }
    }
})();
