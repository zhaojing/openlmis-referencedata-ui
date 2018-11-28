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
     * @name referencedata-supply-partner.SupplyPartner
     *
     * @description
     * Represents a single supply partner.
     */
    angular
        .module('referencedata-supply-partner')
        .factory('SupplyPartner', SupplyPartner);

    SupplyPartner.$inject = ['OpenlmisValidator', 'OpenlmisArrayDecorator'];

    function SupplyPartner(OpenlmisValidator, OpenlmisArrayDecorator) {

        var openlmisValidator = new OpenlmisValidator();

        SupplyPartner.prototype.create = create;
        SupplyPartner.prototype.getAssociationByProgramAndSupervisoryNode = getAssociationByProgramAndSupervisoryNode;
        SupplyPartner.prototype.save = save;
        SupplyPartner.prototype.saveAssociation = saveAssociation;
        SupplyPartner.prototype.removeAssociation = removeAssociation;

        return SupplyPartner;

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartner
         * @name SupplyPartner
         * @constructor
         *
         * @description
         * Creates an instance of the SupplyPartner class.
         *
         * @param {Object}                  json       the JSON representation of the supply partner
         * @param {SupplyPartnerRepository} repository the instance of the SupplyPartnerRepository class
         */
        function SupplyPartner(json, repository) {
            angular.copy(json, this);
            this.repository = repository;

            if (json.associations) {
                this.associations = json.associations;
            } else {
                this.associations = [];
            }

            this.associations = new OpenlmisArrayDecorator(this.associations);
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartner
         * @name save
         *
         * @description
         * Creates this supply partner in the the repository.
         *
         * @return {Promise}  the promise resolved when updating is successful, rejected otherwise
         */
        function create() {
            return this.repository.create(this);
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartner
         * @name save
         *
         * @description
         * Saves ths supply partner on the OpenLMIS server. If this is a new supply partner it will be created on the
         * OpenLMIS server, otherwise it will be updated.
         *
         * @return {Promise} the promise resolved when updating/creating supply partner is successful, rejected
         *                   otherwise
         */
        function save() {
            if (!this.id) {
                return this.create();
            }
            return this.repository.update(this);
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartner
         * @name getAssociationByProgramAndSupervisoryNode
         *
         * @description
         * Returns an association for the given program and supervisory node IDs.
         *
         * @param  {string} programId          the ID of the program
         * @param  {string} supervisoryNodeId  the ID of the supervisory node
         * @return {Object}                    the matching association
         */
        function getAssociationByProgramAndSupervisoryNode(programId, supervisoryNodeId) {
            openlmisValidator.validateExists(programId, 'Program ID must be defined');
            openlmisValidator.validateExists(supervisoryNodeId, 'Supervisory node ID must be defined');

            return this.associations.filter(function(association) {
                return association.program.id === programId && association.supervisoryNode.id === supervisoryNodeId;
            })[0];
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartner
         * @name saveAssociation
         *
         * @description
         * Saves the given association in the supply partner. If an association for the given program and supervisory
         * node exists, it will be updated. Otherwise, a new association will be added.
         *
         * @param {Object} association  the association to save
         */
        function saveAssociation(association) {
            var existing = this.getAssociationByProgramAndSupervisoryNode(
                association.program.id, association.supervisoryNode.id
            );

            if (existing) {
                this.associations.splice(this.associations.indexOf(existing), 1);
            }

            this.associations.push(association);
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartner
         * @name removeAssociation
         *
         * @description
         * Removes the given association if it is part of the supply partner, does nothing otherwise.
         *
         * @param {Object} association  the association to be remove
         */
        function removeAssociation(association) {
            var id = this.associations.indexOf(association);

            if (id > -1) {
                this.associations.splice(id, 1);
            }
        }
    }
})();
