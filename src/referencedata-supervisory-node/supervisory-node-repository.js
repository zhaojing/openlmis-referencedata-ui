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
     * @name referencedata-supervisory-node.SupervisoryNodeRepository
     * 
     * @description
     * Repository for managing supervisory nodes used throughout the system.
     */
    angular
        .module('referencedata-supervisory-node')
        .factory('SupervisoryNodeRepository', SupervisoryNodeRepository);

    SupervisoryNodeRepository.$inject = [
        'classExtender', 'OpenlmisRepository', 'SupervisoryNode', 'SupervisoryNodeResource'
    ];

    function SupervisoryNodeRepository(classExtender, OpenlmisRepository, SupervisoryNode,
                                       SupervisoryNodeResource) {

        classExtender.extend(SupervisoryNodeRepository, OpenlmisRepository);

        return SupervisoryNodeRepository;

        /**
         * @ngdoc method
         * @methodOf referencedata-supervisory-node.SupervisoryNodeRepository
         * @name SupervisoryNodeRepository
         * @constructor
         * 
         * @description
         * Creates an instance of the SupervisoryNodeRepository. If no implementation is given a default one will be
         * used. The default implementation is an instance of the SupervisoryNodeResource class.
         * 
         * @param {Object} impl the implementation to be used by the repository, defaults to
         *                      SupervisoryNodeResource
         */
        function SupervisoryNodeRepository(impl) {
            this.super(SupervisoryNode, impl || new SupervisoryNodeResource());
        }
    }
})();