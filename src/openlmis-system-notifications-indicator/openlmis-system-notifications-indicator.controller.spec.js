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

describe('SystemNotificationsIndicatorController', function() {

    var systemNotifications, $q;

    beforeEach(function() {
        module('openlmis-system-notifications-indicator');

        inject(function($injector) {
            $q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$controller = $injector.get('$controller');
            this.SystemNotificationDataBuilder = $injector.get('SystemNotificationDataBuilder');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.SystemNotificationResource = $injector.get('SystemNotificationResource');
            this.offlineService = $injector.get('offlineService');
        });

        var currentDay = new Date().getDate();
        this.farPastDate = new Date(new Date().setDate(currentDay - 3)).toISOString();
        this.pastDate = new Date(new Date().setDate(currentDay - 2)).toISOString();
        this.futureDate = new Date(new Date().setDate(currentDay + 2)).toISOString();
        this.farFutureDate = new Date(new Date().setDate(currentDay + 3)).toISOString();

        this.ongoingSystemNotification = new this.SystemNotificationDataBuilder()
            .withStartDate(this.pastDate)
            .withExpiryDate(this.futureDate)
            .build();

        this.systemNotificationWithoutExpiryDate = new this.SystemNotificationDataBuilder()
            .withStartDate(this.pastDate)
            .withoutExpiryDate()
            .build();

        this.pastSystemNotification = new this.SystemNotificationDataBuilder()
            .withStartDate(this.farPastDate)
            .withExpiryDate(this.pastDate)
            .build();

        this.futureSystemNotification = new this.SystemNotificationDataBuilder()
            .withStartDate(this.futureDate)
            .withExpiryDate(this.farFutureDate)
            .build();

        this.inactiveSystemNotification = new this.SystemNotificationDataBuilder()
            .withStartDate(this.pastDate)
            .withExpiryDate(this.futureDate)
            .inactive()
            .build();

        systemNotifications = [
            this.ongoingSystemNotification,
            this.systemNotificationWithoutExpiryDate,
            this.pastSystemNotification,
            this.futureSystemNotification,
            this.inactiveSystemNotification
        ];

        spyOn(this.SystemNotificationResource.prototype, 'query')
            .andCallFake(function(param) {
                var result;
                if (param.isDisplayed) {
                    result = [
                        systemNotifications[0],
                        systemNotifications[1]
                    ];
                } else {
                    result = systemNotifications;
                }

                return $q.resolve({
                    content: result
                });
            });

        spyOn(this.offlineService, 'isOffline');

        this.vm = this.$controller('SystemNotificationsIndicatorController');
        this.vm.$onInit();
    });

    describe('$onInit', function() {

        it('should expose active system notifications', function() {
            this.$rootScope.$apply();

            var expectedSystemNotifications = [
                systemNotifications[0],
                systemNotifications[1]
            ];

            expect(this.vm.systemNotifications).toEqual(expectedSystemNotifications);
        });

        it('should not resolve system notifications while offline', function() {
            this.offlineService.isOffline.andReturn(true);
            this.vm.$onInit();

            expect(this.vm.systemNotifications).toEqual(undefined);
        });

    });

    afterEach(function() {
        systemNotifications = null;
        $q = null;
    });

});