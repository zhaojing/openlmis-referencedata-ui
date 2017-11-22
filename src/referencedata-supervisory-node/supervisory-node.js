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

    function SupervisoryNode() {

        return SupervisoryNode;

        /**
         * @ngdoc method
         * @methodOf referencedata-supervisory-node.SupervisoryNode
         * @name SupervisoryNode
         *
         * @description
         * Creates a new instance of the SupervisoryNode class.
         *
         * @param  {String} id         the UUID of the supervisory node to be created
         * @param  {String} name       the name of the supervisory node to be created
         * @param  {String} code       the code of the supervisory node to be created
         * @param  {Object} facility   the facility of the supervisory node to be created
         * @param  {Array}  childNodes the childNodes of the supervisory node to be created
         * @return {Object}            the supervisory node object
         */
        function SupervisoryNode(id, name, code, facility, childNodes) {
            this.id = id;
            this.name = name;
            this.code = code;
            this.facility = facility;
            this.childNodes = childNodes;
        }
    }
})();
