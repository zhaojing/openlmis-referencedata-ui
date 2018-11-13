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
     * @ngdoc controller
     * @name admin-supervisory-node-edit.controller:SupervisoryNodeEditController
     *
     * @description
     * Controller for managing supervisory node view screen.
     */
    angular
        .module('admin-supervisory-node-edit')
        .controller('SupervisoryNodeEditController', controller);

    controller.$inject = [
        '$state', 'supervisoryNode', 'childNodes', 'facilitiesMap', '$q', 'supervisoryNodesMap', 'supervisoryNodes'
    ];

    function controller($state, supervisoryNode, childNodes, facilitiesMap, $q, supervisoryNodesMap, supervisoryNodes) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToSupervisoryNodeList = goToSupervisoryNodeList;
        vm.addChildNode = addChildNode;
        vm.addPartnerNode = addPartnerNode;
        vm.getAvailableParentNodes = getAvailableParentNodes;
        vm.getAvailableChildNodes = getAvailableChildNodes;
        vm.getAvailablePartnerNodes = getAvailablePartnerNodes;

        /**
         * @ngdoc property
         * @propertyOf admin-supervisory-node-edit.controller:SupervisoryNodeEditController
         * @name supervisoryNode
         * @type {Object}
         *
         * @description
         * Contains supervisory node object.
         */
        vm.supervisoryNode = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-supervisory-node-edit.controller:SupervisoryNodeEditController
         * @name childNodes
         * @type {Array}
         *
         * @description
         * Contains paginated list of all child nodes of supervisory node object.
         */
        vm.childNodes = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-supervisory-node-edit.controller:SupervisoryNodeEditController
         * @name nodesPage
         * @type {Array}
         *
         * @description
         * Contains current page of child nodes.
         */
        vm.nodesPage = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-supervisory-node-edit.controller:SupervisoryNodeEditController
         * @type {Object}
         * @name facilitiesMap
         *
         * @description
         * Map where the key is the facility ID and value is the facility object.
         */
        vm.facilitiesMap = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-supervisory-node-edit.controller:SupervisoryNodeEditController
         * @type {Object}
         * @name supervisoryNodesMap
         *
         * @description
         * Map where the key is the supervisory node0 ID and value is the supervisory node object.
         */
        vm.supervisoryNodesMap = undefined;

        /**
         * @ngdoc method
         * @propertyOf admin-supervisory-node-edit.controller:SupervisoryNodeEditController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating SupervisoryNodeEditController.
         */
        function onInit() {
            vm.supervisoryNode = supervisoryNode;
            vm.childNodes = childNodes;
            vm.facilitiesMap = facilitiesMap;
            vm.supervisoryNodesMap = supervisoryNodesMap;
        }

        /**
         * @ngdoc method
         * @methodOf admin-supervisory-node-edit.controller:SupervisoryNodeEditController
         * @name goToSupervisoryNodeList
         *
         * @description
         * Redirects to supervisory node list screen.
         */
        function goToSupervisoryNodeList() {
            $state.go('^', {}, {
                reload: true
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-supervisory-node-edit.controller:SupervisoryNodeEditController
         * @name addChildNode
         *
         * @description
         * Add the currently selected supervisory node as a child node to the supervisory node being edited.
         *
         * @return {Promise}  the promise resolved after adding the child node to the supervisoryNode
         */
        function addChildNode() {
            supervisoryNode.addChildNode(vm.selectedChildNode);
            return $q.resolve();
        }

        /**
         * @ngdoc method
         * @methodOf admin-supervisory-node-edit.controller:SupervisoryNodeEditController
         * @name addPartnerNode
         *
         * @description
         * Add the currently selected supervisory node as a partner node to the supervisory node being edited.
         *
         * @return {Promise}  the promise resolved after adding the partner node to the supervisoryNode
         */
        function addPartnerNode() {
            supervisoryNode.addPartnerNode(vm.selectedPartnerNode);
            return $q.resolve();
        }

        /**
         * @ngdoc method
         * @methodOf admin-supervisory-node-edit.controller:SupervisoryNodeEditController
         * @name getAvailableParentNodes
         *
         * @description
         * Returns a list of all available supervisory node that can be selected as parent of the supervisory node being
         * edited.
         *
         * @return {Array}  the list of supervisory nodes
         */
        function getAvailableParentNodes() {
            return supervisoryNodes
                .filter(filterOutChildNodes())
                .filter(filterOutEditedSupervisoryNode)
                .filter(filterOutSelectedChildNode);
        }

        /**
         * @ngdoc method
         * @methodOf admin-supervisory-node-edit.controller:SupervisoryNodeEditController
         * @name getAvailableChildNodes
         *
         * @description
         * Returns a list of all available supervisory node that can be selected as child node of the supervisory node
         * being edited.
         *
         * @return {Array}  the list of supervisory nodes
         */
        function getAvailableChildNodes() {
            return supervisoryNodes
                .filter(filterOutChildNodes())
                .filter(filterOutEditedSupervisoryNode)
                .filter(filterOutParentNode);
        }

        /**
         * @ngdoc method
         * @methodOf admin-supervisory-node-edit.controller:SupervisoryNodeEditController
         * @name getAvailablePartnerNodes
         *
         * @description
         * Returns a list of all available supervisory node that can be selected as partner node of the supervisory node
         * being edited.
         *
         * @return {Array}  the list of supervisory nodes
         */
        function getAvailablePartnerNodes() {
            return supervisoryNodes
                .filter(filterOutPartnerNodes())
                .filter(filterOutEditedSupervisoryNode);
        }

        function filterOutChildNodes() {
            return filterOurNodes(vm.supervisoryNode.childNodes);
        }

        function filterOutPartnerNodes() {
            return filterOurNodes(vm.supervisoryNode.partnerNodes);
        }

        function filterOutParentNode(supervisoryNode) {
            return !vm.supervisoryNode.parentNode || vm.supervisoryNode.parentNode.id !== supervisoryNode.id;
        }

        function filterOutSelectedChildNode(supervisoryNode) {
            return !vm.selectedChildNode || supervisoryNode.id !== vm.selectedChildNode.id;
        }

        function filterOutEditedSupervisoryNode(supervisoryNode) {
            return supervisoryNode.id !== vm.supervisoryNode.id;
        }

        function filterOurNodes(nodes) {
            var nodeIds = getNodeIds(nodes);

            return function(supervisoryNode) {
                return nodeIds.indexOf(supervisoryNode.id) === -1;
            };
        }

        function getNodeIds(nodes) {
            return nodes.map(function(childNodes) {
                return childNodes.id;
            });
        }
    }
})();
