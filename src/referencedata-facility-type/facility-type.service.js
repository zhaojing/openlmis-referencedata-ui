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
     * @name referencedata-facility-type.facilityTypeService
     *
     * @description
     * Responsible for retrieving all facilityType information from server.
     */
    angular
    .module('referencedata-facility-type')
    .service('facilityTypeService', service);

    service.$inject = [
        '$q', '$resource', 'referencedataUrlFactory', 'offlineService', 'localStorageFactory'
    ];

    function service($q, $resource, referencedataUrlFactory, offlineService, localStorageFactory) {

            var facilityTypesOffline = localStorageFactory('facilityTypes'),
            resource = $resource(referencedataUrlFactory('/api/facilityTypes/:id'), {}, {
                getAll: {
                    url: referencedataUrlFactory('/api/facilityTypes/'),
                    method: 'GET',
                    isArray: true
                },
            });

            this.get = get;
            this.getAll = getAll;

            /**
             * @ngdoc method
             * @methodOf referencedata-facility-type.facilityTypeService
             * @name get
             *
             * @description
             * Retrieves facility type by id. When user is offline it gets facility type from offline storage.
             * If user is online it stores facility type into offline storage.
             *
             * @param  {String}  facilityTypeId facilityType UUID
             * @return {Promise}                facilityType promise
             */
            function get(facilityTypeId) {
                var facilityType,
                deferred = $q.defer();

                if(offlineService.isOffline()) {
                    facilityType = facilityTypesOffline.getBy('id', facilityTypeId);
                    facilityType ? deferred.resolve(facilityType) : deferred.reject();
                } else {
                    resource.get({id: facilityTypeId}, function(data) {
                        facilityTypesOffline.put(data);
                        deferred.resolve(data);
                    }, function() {
                        deferred.reject();
                    });
                }

                return deferred.promise;
            }

            /**
             * @ngdoc method
             * @methodOf referencedata-facility-type.facilityTypeService
             * @name getAll
             *
             * @description
             * Retrieves all facility types. When user is offline it gets facility types from offline storage.
             * If user is online it stores all facility types into offline storage.
             *
             * @return {Promise} Array of facility types
             */
            function getAll() {
                var deferred = $q.defer();

                if(offlineService.isOffline()) {
                    deferred.resolve(facilityTypesOffline.getAll());
                } else {
                    resource.getAll(function(facilities) {
                        angular.forEach(facilities, function(facilityType) {
                            facilityTypesOffline.put(facilityType);
                        });
                        deferred.resolve(facilities);
                    }, function() {
                        deferred.reject();
                    });
                }

                return deferred.promise;
            }

        }
    })();
