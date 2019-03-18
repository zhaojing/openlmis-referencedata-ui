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
     * @name referencedata-feature-flag.FeatureFlagService
     *
     * @description
     * Allows checking if given feature flag is enabled.
     */
    angular
        .module('referencedata-feature-flag')
        .factory('FeatureFlagService', FeatureFlagService);

    FeatureFlagService.$inject = ['FeatureFlagResource'];

    function FeatureFlagService(FeatureFlagResource) {

        FeatureFlagService.prototype.isEnabled = isEnabled;

        return FeatureFlagService;

        function FeatureFlagService() {
            this.featureFlagResource = new FeatureFlagResource();
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-feature-flag.FeatureFlagService
         * @name isEnabled
         *
         * @description
         * Responsible for providing feature flag info to other modules.
         * 
         * @param   {string}  name feature flag name
         * @returns {Promise}      contains enabled info for given feature flag
         */
        function isEnabled(name) {
            return this.featureFlagResource.query()
                .then(function(featureFlags) {
                    return findFeatureFlag(featureFlags, name).enabled;
                });
        }

        function findFeatureFlag(featureFlags, name) {
            var result = featureFlags.filter(function(featureFlag) {
                return featureFlag.name === name;
            });
            return result.length > 0 ? result[0] : null;
        }
    }
})();