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
     * @name admin-supply-partner-edit.SupplyPartnerAssociationService
     *
     * @description
     * Provides utility methods for fetching data (association, facilities and orderables) from the association
     * modal.
     */
    angular
        .module('admin-supply-partner-edit')
        .factory('SupplyPartnerAssociationService', SupplyPartnerAssociationService);

    SupplyPartnerAssociationService.$inject = [
        'SupervisoryNodeFacilityResource', 'OpenlmisArrayDecorator', 'FacilityTypeApprovedProductResource', '$q'
    ];

    function SupplyPartnerAssociationService(SupervisoryNodeFacilityResource, OpenlmisArrayDecorator,
                                             FacilityTypeApprovedProductResource, $q) {

        SupplyPartnerAssociationService.prototype.getAssociation = getAssociation;
        SupplyPartnerAssociationService.prototype.getFacilities = getFacilities;
        SupplyPartnerAssociationService.prototype.getOrderables = getOrderables;

        return SupplyPartnerAssociationService;

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.SupplyPartnerAssociationService
         * @name SupplyPartnerAssociationService
         * @constructor
         *
         * @description
         * Creates an instance of the SupplyPartnerAssociationService.
         */
        function SupplyPartnerAssociationService() {
            this.facilityTypeApprovedProductResource = new FacilityTypeApprovedProductResource();
            this.supervisoryNodeFacilityResource = new SupervisoryNodeFacilityResource();
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.SupplyPartnerAssociationService
         * @name getAssociation
         *
         * @description
         * Searches for the association matching given program and supervisory node IDs in the given supply partner.
         * If the association is found, it will be returned. Otherwise, a new one will be created with an empty lists
         * of facilities and orderables.
         *
         * @param  {SupplyPartner} supplyPartner  the supply partner to get association from
         * @param  {Object}        stateParams    the state params holding program and supervisory node IDs
         * @return {Object}                       the matching (or new) association
         */
        function getAssociation(supplyPartner, stateParams) {
            var association;
            if (stateParams.programId && stateParams.supervisoryNodeId) {
                association = supplyPartner.getAssociationByProgramAndSupervisoryNode(
                    stateParams.programId,
                    stateParams.supervisoryNodeId
                );
            }

            if (association) {
                return association;
            }

            return {
                facilities: [],
                orderables: []
            };
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.SupplyPartnerAssociationService
         * @name getFacilities
         *
         * @description
         * Retrieves a list of facilities matching the given associations program and supervisory node. If any of those
         * is missing, an empty list will be returned.
         *
         * @param {Object}   association       the association to find the facilities for
         * @param {Array}    supervisoryNodes  the list of the supervisory nodes
         * @return {Promise}                   the promise resolved once the list of facilities is ready, rejects if
         *                                     fetching the facilities fails
         */
        function getFacilities(association, supervisoryNodes) {
            if (!association.supervisoryNode || !association.program) {
                return $q.resolve([]);
            }
            var partnerNode = new OpenlmisArrayDecorator(supervisoryNodes)
                .getById(association.supervisoryNode.id);

            return this.supervisoryNodeFacilityResource
                .getAll({
                    supervisoryNodeId: partnerNode.partnerNodeOf.id,
                    programId: association.program.id
                });
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.SupplyPartnerAssociationService
         * @name getOrderables
         *
         * @description
         * Retrieves a list of orderables matching the given association. Will return an empty list if there is no
         * associated facilities.
         *
         * @param  {Object}  association  the association to fetch the orderables for
         * @param  {Array}   facilities   the list of the facilities available for the association
         * @param  {Array}   programs     the list of programs
         * @return {Promise}              the promise resolving to a list of unique orderables available to the given
         *                                association, rejects if fetching the orderables fails
         */
        function getOrderables(association, facilities, programs) {
            if (!association.facilities.length) {
                return $q.resolve([]);
            }

            var associatedFacilityIds = association.facilities.map(function(association) {
                return association.id;
            });

            var facilityTypes = facilities
                .filter(function(facility) {
                    return associatedFacilityIds.indexOf(facility.id) > -1;
                })
                .map(function(facility) {
                    return facility.type.code;
                });

            return this.facilityTypeApprovedProductResource
                .getAll({
                    facilityType: facilityTypes,
                    program: new OpenlmisArrayDecorator(programs).getById(association.program.id).code
                })
                .then(function(result) {
                    return filterOutDuplicates(
                        result
                            .map(function(ftap) {
                                return ftap.orderable;
                            })
                    );
                });
        }

        function filterOutDuplicates(orderables) {
            var filtered = [];

            orderables.forEach(function(orderable) {
                var existing = filtered.filter(function(filtered) {
                    return filtered.id === orderable.id;
                });

                if (!existing.length) {
                    filtered.push(orderable);
                }
            });

            return filtered;
        }

    }

})();
