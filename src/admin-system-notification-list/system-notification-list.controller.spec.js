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

describe('SystemNotificationListController', function() {

    beforeEach(function() {
        module('admin-system-notification-list');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.SystemNotificationDataBuilder = $injector.get('SystemNotificationDataBuilder');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
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
            .withStartDate(this.farPastDate)
            .withExpiryDate(this.pastDate)
            .build();

        this.inactiveSystemNotification = new this.SystemNotificationDataBuilder()
            .withStartDate(this.pastDate)
            .withExpiryDate(this.futureDate)
            .inactive()
            .build();

        this.systemNotifications = [
            this.ongoingSystemNotification,
            this.systemNotificationWithoutExpiryDate,
            this.pastSystemNotification,
            this.futureSystemNotification,
            this.inactiveSystemNotification
        ];

        this.users = [
            new this.UserDataBuilder().buildReferenceDataUserJson(),
            new this.UserDataBuilder().buildReferenceDataUserJson()
        ];

        this.usersMap = {};
        this.usersMap[this.users[0].id] = this.users[0];
        this.usersMap[this.users[1].id] = this.users[1];

        this.vm = this.$controller('SystemNotificationListController', {
            systemNotifications: this.systemNotifications,
            usersMap: this.usersMap
        });
        this.vm.$onInit();
    });

    describe('$onInit', function() {

        it('should expose system notification', function() {
            expect(this.vm.systemNotifications).toEqual(this.systemNotifications);
        });

        it('should expose users map', function() {
            expect(this.vm.usersMap).toEqual(this.usersMap);
        });

        it('should create is displayed map', function() {
            expect(this.vm.isDisplayedMap[this.ongoingSystemNotification.id]).toEqual(true);
            expect(this.vm.isDisplayedMap[this.systemNotificationWithoutExpiryDate.id]).toEqual(true);
            expect(this.vm.isDisplayedMap[this.pastSystemNotification.id]).toEqual(false);
            expect(this.vm.isDisplayedMap[this.futureSystemNotification.id]).toEqual(false);
            expect(this.vm.isDisplayedMap[this.inactiveSystemNotification.id]).toEqual(false);
        });

    });

});