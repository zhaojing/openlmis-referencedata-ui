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

describe('systemNotificationService', function() {

    var systemNotifications, $q;

    beforeEach(function() {

        module('referencedata-system-notification');

        inject(function($injector) {
            $q = $injector.get('$q');
            this.systemNotificationService = $injector.get('systemNotificationService');
            this.SystemNotificationResource = $injector.get('SystemNotificationResource');
            this.$rootScope = $injector.get('$rootScope');
            this.localStorageService = $injector.get('localStorageService');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.SystemNotificationDataBuilder = $injector.get('SystemNotificationDataBuilder');
            this.ObjectReferenceDataBuilder = $injector.get('ObjectReferenceDataBuilder');
        });

        this.localStorageKey = 'systemNotifications';

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

        spyOn(this.systemNotificationService, 'cacheSystemNotification').andReturn();
        spyOn(this.localStorageService, 'get');
        spyOn(this.localStorageService, 'remove');
        spyOn(this.localStorageService, 'add');
    });

    describe('getSystemNotifications', function() {

        it('should return list of active system notifications', function() {
            var result;

            this.systemNotificationService.getSystemNotifications()
                .then(function(notifications) {
                    result = notifications;
                });
            this.$rootScope.$apply();

            expect(result).toEqual([
                systemNotifications[0],
                systemNotifications[1]
            ]);
        });

        it('should return cached data if available', function() {
            this.localStorageService.get.andReturn(angular.toJson([
                systemNotifications[0],
                systemNotifications[1]
            ]));

            var result;

            this.systemNotificationService.getSystemNotifications()
                .then(function(notifications) {
                    result = notifications;
                });
            this.$rootScope.$apply();

            expect(this.localStorageService.get).toHaveBeenCalledWith(this.localStorageKey);
            expect(this.systemNotificationService.cacheSystemNotification.callCount).toEqual(0);
            expect(this.SystemNotificationResource.prototype.query.callCount).toEqual(0);
            expect(result).toEqual([
                systemNotifications[0],
                systemNotifications[1]
            ]);
        });

        it('should fetch system notifications with correct params', function() {
            this.systemNotificationService.getSystemNotifications();
            this.$rootScope.$apply();

            expect(this.SystemNotificationResource.prototype.query).toHaveBeenCalledWith({
                isDisplayed: true,
                expand: 'author'
            });
        });

        it('should reject if fetching system notifications fails', function() {
            this.SystemNotificationResource.prototype.query.andReturn($q.reject());

            var rejected;
            this.systemNotificationService.getSystemNotifications()
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);
        });

    });

    describe('clearCachedSystemNotifications', function() {

        it('should clear cache', function() {
            this.systemNotificationService.getSystemNotifications();
            this.$rootScope.$apply();

            expect(this.SystemNotificationResource.prototype.query.callCount).toEqual(1);

            this.systemNotificationService.clearCachedSystemNotifications();
            this.systemNotificationService.getSystemNotifications();
            this.$rootScope.$apply();

            expect(this.localStorageService.remove).toHaveBeenCalledWith(this.localStorageKey);
            expect(this.SystemNotificationResource.prototype.query.callCount).toEqual(2);
        });

    });

    afterEach(function() {
        systemNotifications = null;
        $q = null;
    });
});