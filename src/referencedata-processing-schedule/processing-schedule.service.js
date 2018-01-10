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
     * @name referencedata-processing-schedule.processingScheduleService
     *
     * @description
     * Responsible for retrieving all Processing Schedules information from server.
     */
    angular
        .module('referencedata-processing-schedule')
        .service('processingScheduleService', service);

    service.$inject = ['$resource', 'referencedataUrlFactory'];

    function service($resource, referencedataUrlFactory) {

        var resource = $resource(referencedataUrlFactory('/api/processingSchedules/:id'), {}, {
                query: {
                    url: referencedataUrlFactory('/api/processingSchedules'),
                    method: 'GET',
                    isArray: false
                }
            });

        this.get = get;
        this.query = query;
        this.create = create;

        /**
         * @ngdoc method
         * @methodOf referencedata-processing-schedule.processingScheduleService
         * @name get
         *
         * @description
         * Retrieves Processing Schedule from the server by id.
         *
         * @param  {String}  id Processing Schedule UUID
         * @return {Promise}    Processing Schedule promise
         */
        function get(id) {
            return resource.get({id: id}).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-processing-schedule.processingScheduleService
         * @name query
         *
         * @description
         * Retrieves page of Processing Schedules.
         *
         * @param  {Object}  queryParams the search parameters
         * @return {Promise}             page of Processing Schedules
         */
        function query(queryParams) {
            return resource.query(queryParams).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-processing-schedule.processingScheduleService
         * @name save
         *
         * @description
         * Saves given Processing Schedule, if id is present it uses PUT method, if not POST.
         *
         * @param  {Object}  processingSchedule the Processing Schedule to be saved
         * @return {Promise}                    the saved Processing Schedule
         */
        function create(processingSchedule) {
            return resource.save(null, processingSchedule).$promise;
        }
    }
})();
