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
     * @name referencedata-supervisory-node.SupervisoryNode
     *
     * @description
     * Represents a single supervisory node.
     */
    angular
        .module('referencedata-supervisory-node')
        .factory('SupervisoryNode', SupervisoryNode);

    SupervisoryNode.$inject = ['OpenlmisValidator', 'OpenlmisArrayDecorator'];

    function SupervisoryNode(OpenlmisValidator, OpenlmisArrayDecorator) {

        var openlmisValidator = new OpenlmisValidator();

        SupervisoryNode.prototype.addChildNode = addChildNode;
        SupervisoryNode.prototype.removeChildNode = removeChildNode;
        SupervisoryNode.prototype.save = save;

        return SupervisoryNode;

        /**
         * @ngdoc method
         * @methodOf referencedata-supervisory-node.SupervisoryNode
         * @name SupervisoryNode
         *
         * @description
         * Creates a new instance of the SupervisoryNode class.
         *
         * @param  {Object} json  the JSON representation of the Supervisory Node
         * @return {Object}       the supervisory node object
         */
        function SupervisoryNode(json, repository) {
            this.id = json.id;
            this.name = json.name;
            this.code = json.code;
            this.facility = json.facility;
            this.childNodes = new OpenlmisArrayDecorator(json.childNodes);
            this.description = json.description;
            this.parentNode = json.parentNode;
            this.repository = repository;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supervisory-node.SupervisoryNode
         * @name addChildNode
         * 
         * @description
         * Adds the given supervisory node as a child node of this supervisory node. Will throw an exception when trying
         * to add null, undefined, duplicate supervisory node or parent node.
         * 
         * @param {Object} supervisoryNode  the supervisory node
         */
        function addChildNode(supervisoryNode) {
            openlmisValidator.validateExists(supervisoryNode, 'Supervisory node must be defined');
            openlmisValidator.validateObjectWithIdDoesNotExist(
                this.childNodes,
                supervisoryNode.id,
                'Given supervisory node is already a child node'
            );
            validateNotParentNode(supervisoryNode, this.parentNode);

            this.childNodes.push(supervisoryNode);
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supervisory-node.SupervisoryNode
         * @name removeChildNode
         * 
         * @description
         * Removed supervisory node with the given ID from the list of child nodes of this supervisory node. Will throw
         * an exception when trying to remove null, undefined or a supervisory node that is not a child node of this
         * supervisory node.
         * 
         * @param {String} childNodeId  the ID of the supervisory node
         */
        function removeChildNode(childNodeId) {
            openlmisValidator.validateExists(childNodeId, 'Child node ID must be defined');

            var existingChildNode = this.childNodes.getById(childNodeId);
            openlmisValidator.validateExists(existingChildNode, 'Child node with the given ID does not exist');

            var childNodeIndex = this.childNodes.indexOf(existingChildNode);
            this.childNodes.splice(childNodeIndex, 1);
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supervisory-node.SupervisoryNode
         * @name save
         * 
         * @description
         * Updates this supervisory node in the the repository.
         * 
         * @return {Promise}  the promise resolved when updating is successful, rejected otherwise
         */
        function save() {
            return this.repository.update(this);
        }

        function validateNotParentNode(supervisoryNode, parentNode) {
            if (parentNode && parentNode.id === supervisoryNode.id) {
                throw 'Given supervisory node is parent node';
            }
        }
    }
})();
