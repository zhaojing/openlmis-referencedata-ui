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
        .module('auth-user')
        .factory('VerificationEmailDataBuilder', VerificationEmailDataBuilder);

    VerificationEmailDataBuilder.$inject = ['VerificationEmail'];

    function VerificationEmailDataBuilder(VerificationEmail) {

        VerificationEmailDataBuilder.prototype.build = build;
        VerificationEmailDataBuilder.prototype.buildJson = buildJson;

        return VerificationEmailDataBuilder;

        function VerificationEmailDataBuilder() {
            VerificationEmailDataBuilder.instanceNumber = (VerificationEmailDataBuilder.instanceNumber || 0) + 1;

            this.emailAddress = 'example' + VerificationEmailDataBuilder.instanceNumber + '@test.org';
            this.expiryDate = '2018-06-14';
        }

        function build() {
            return new VerificationEmail(this.buildJson());
        }

        function buildJson() {
            return {
                emailAddress: this.emailAddress,
                expiryDate: this.expiryDate
            };
        }
    }
})();
