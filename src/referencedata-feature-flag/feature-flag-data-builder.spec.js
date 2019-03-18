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

    angular
        .module('referencedata-feature-flag')
        .factory('FeatureFlagDataBuilder', FeatureFlagDataBuilder);

    function FeatureFlagDataBuilder() {

        FeatureFlagDataBuilder.prototype.buildJson = buildJson;
        FeatureFlagDataBuilder.prototype.enable = enable;
        FeatureFlagDataBuilder.prototype.disable = disable;

        return FeatureFlagDataBuilder;

        function FeatureFlagDataBuilder() {
            FeatureFlagDataBuilder.instanceNumber = (FeatureFlagDataBuilder.instanceNumber || 0) + 1;

            this.name = 'feature-flag-name-' + FeatureFlagDataBuilder.instanceNumber;
            this.enabled = true;
            this.strategy = 'feature-flag-strategy-' + FeatureFlagDataBuilder.instanceNumber;
            this.params = {};
        }

        function buildJson() {
            return {
                name: this.name,
                enabled: this.enabled,
                strategy: this.strategy,
                params: this.params
            };
        }

        function enable() {
            this.enabled = true;
            return this;
        }

        function disable() {
            this.enabled = false;
            return this;
        }
    }
})();
