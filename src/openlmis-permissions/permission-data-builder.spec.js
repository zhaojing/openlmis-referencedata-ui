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
        .module('openlmis-permissions')
        .factory('PermissionDataBuilder', PermissionDataBuilder);

    PermissionDataBuilder.$inject = ['Permission'];

    function PermissionDataBuilder(Permission) {

        PermissionDataBuilder.prototype.build = build;
        PermissionDataBuilder.prototype.withRight = withRight;
        PermissionDataBuilder.prototype.withFacilityId = withFacilityId;
        PermissionDataBuilder.prototype.withProgramId = withProgramId;

        return PermissionDataBuilder;

        function PermissionDataBuilder() {
            PermissionDataBuilder.instanceNumber = (PermissionDataBuilder.instanceNumber || 0) + 1;

            this.right = 'right-' + PermissionDataBuilder.instanceNumber;
            this.facilityId = undefined;
            this.programId = undefined;
        }

        function build() {
            return new Permission(
                this.right,
                this.facilityId,
                this.programId
            );
        }

        function withRight(right) {
            this.right = right;
            return this;
        }

        function withFacilityId(facilityId) {
            this.facilityId = facilityId;
            return this;
        }

        function withProgramId(programId) {
            this.programId = programId;
            return this;
        }
    }
})();
