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

    controller.$inject = ['$state', 'supervisoryNode', 'childNodes'];

    function controller($state, supervisoryNode, childNodes) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToSupervisoryNodeList = goToSupervisoryNodeList;

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
    }
})();
