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
        'SupplyPartnerResource', '$q', 'SupervisoryNodeResource', 'programService'
    ];

    function SupplyPartnerRepositoryImpl(SupplyPartnerResource, $q, SupervisoryNodeResource,
                                         programService) {

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
            return this.supplyPartnerResource.get(id)
                .then(function(response) {
                    var supplyPartner = response;
                    var supervisoryNodeIds = supplyPartner.associations.map(function(association) {
                        return association.supervisoryNode.id;
                    });

                    return $q.all([
                        programService.getAll(),
                        supervisoryNodeResource.query({
                            id: supervisoryNodeIds
                        })
                    ]).then(function(responses) {
                        var programs = responses[0],
                            supervisoryNodes = responses[1].content;

                        return combineResponses(supplyPartner, programs, supervisoryNodes);
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

        function combineResponses(supplyPartner, programs, supervisoryNodes) {
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
            });

            return supplyPartner;
        }
    }
})();
