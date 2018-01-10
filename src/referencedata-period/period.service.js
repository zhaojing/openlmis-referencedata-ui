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
     * @name referencedata-period.periodService
     *
     * @description
     * Responsible for retrieving all processing period information from the server.
     */
	angular
		.module('referencedata-period')
	    .service('periodService', service);

    service.$inject = ['$resource', 'referencedataUrlFactory'];

    function service($resource, referencedataUrlFactory) {

        var resource = $resource(referencedataUrlFactory('/api/processingPeriods/:id'), {}, {
            getBySchedule: {
                method: 'GET',
                url: referencedataUrlFactory('/api/processingPeriods/searchByScheduleAndDate'),
                isArray: true
            }
        });

        this.get = get;
        this.getBySchedule = getBySchedule;
        this.create = create;

		/**
         * @ngdoc method
         * @name get
         * @methodOf referencedata-period.periodService
         *
         * @description
         * Retrieves processing period from the server by id.
         *
         * @param  {String}  periodId Period UUID
         * @return {Promise}          Period
         */
        function get(periodId) {
            return resource.get({
				id: periodId
			}).$promise;
        }

        /**
         * @ngdoc method
         * @name getBySchedule
         * @methodOf referencedata-period.periodService
         *
         * @description
         * Retrieves processing periods assigned to schedule from the server.
         *
         * @param  {String}  scheduleId Schedule UUID
         * @return {Promise}            List of Periods
         */
        function getBySchedule(scheduleId) {
            return resource.getBySchedule({
				processingScheduleId: scheduleId
			}).$promise;
        }

        /**
         * @ngdoc method
         * @name create
         * @methodOf referencedata-period.periodService
         *
         * @description
         * Creates processing periods.
         *
         * @param  {Object}  period new Period
         * @return {Promise}        created Period
         */
        function create(period) {
            return resource.save(period).$promise;
        }
    }
})();
