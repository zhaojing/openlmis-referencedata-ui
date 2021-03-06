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

describe('notificationTag filter', function() {

    beforeEach(function() {
        module('openlmis-user');

        inject(function($injector) {
            this.$filter = $injector.get('$filter');
        });
    });

    it('should parse multi-word module name', function() {
        expect(this.$filter('notificationTag')('moduleName')).toEqual('Module Name');
    });

    it('should leave the first word of the module name capitalized', function() {
        expect(this.$filter('notificationTag')('ModuleName')).toEqual('Module Name');
    });

    it('should split module name and notification type', function() {
        expect(this.$filter('notificationTag')('module-Notification')).toEqual('Module - Notification');
    });

    it('should parse multi-word notification type', function() {
        expect(this.$filter('notificationTag')('module-notificationType')).toEqual('Module - Notification Type');
    });

    it('should leave the first word of the notification type capitalized', function() {
        expect(this.$filter('notificationTag')('module-NotificationType')).toEqual('Module - Notification Type');
    });

});