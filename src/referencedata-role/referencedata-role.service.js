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
     * @name referencedata-role.referencedataRoleService
     *
     * @description
     * Responsible for retrieving roles info from the server.
     */
    angular
        .module('referencedata-role')
        .service('referencedataRoleService', service);

    service.$inject = ['openlmisUrlFactory', '$resource'];

    function service(openlmisUrlFactory, $resource) {
        var resource = $resource(openlmisUrlFactory('/api/roles/:id'), {}, {
            update: {
                method: 'PUT'
            }
        });

        this.get = get;
        this.getAll = getAll;
        this.create = create;
        this.update = update;

        /**
         * @ngdoc method
         * @methodOf referencedata-role.referencedataRoleService
         * @name get
         *
         * @description
         * Gets role by id.
         *
         * @param  {String}  id the role UUID
         * @return {Promise}    the role object
         */
        function get(id) {
            return resource.get({
                id: id
            }).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-role.referencedataRoleService
         * @name getAll
         *
         * @description
         * Gets all roles.
         *
         * @return {Promise} the array of all roles
         */
        function getAll() {
            return resource.query().$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-role.referencedataRoleService
         * @name create
         *
         * @description
         * Creates the given role on the OpenLMIS server.
         *
         * @param   {Object}    role    the role to be created
         * @return  {Object}            the created role
         */
        function create(role) {
            return resource.save(role).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-role.referencedataRoleService
         * @name update
         *
         * @description
         * Updates the given role on the OpenLMIS server.
         *
         * @param   {Object}    role    the role to be updated
         * @return  {Object}            the updates role
         */
        function update(role) {
            return resource.update({
                id: role.id
            }, role).$promise;
        }
    }
})();
