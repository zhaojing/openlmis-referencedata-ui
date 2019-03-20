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

describe('UserProfileNotificationSettingsController', function() {

    beforeEach(function() {
        module('openlmis-user');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.DigestConfigurationDataBuilder = $injector.get('DigestConfigurationDataBuilder');
        });

        this.digestConfigurations = [
            new this.DigestConfigurationDataBuilder().buildJson(),
            new this.DigestConfigurationDataBuilder().buildJson()
        ];

        this.vm = this.$controller('UserProfileNotificationSettingsController', {
            digestConfigurations: this.digestConfigurations
        });
        this.vm.$onInit();
    });

    describe('$onInit', function() {

        it('should set the list of digest configurations', function() {
            expect(this.vm.digestConfigurations).toEqual(this.digestConfigurations);
        });

    });

});