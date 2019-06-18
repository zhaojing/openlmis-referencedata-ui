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
        .module('referencedata-system-notification')
        .factory('SystemNotificationDataBuilder', SystemNotificationDataBuilder);

    SystemNotificationDataBuilder.$inject = ['ObjectReferenceDataBuilder'];

    function SystemNotificationDataBuilder(ObjectReferenceDataBuilder) {

        SystemNotificationDataBuilder.prototype.build = build;
        SystemNotificationDataBuilder.prototype.withAuthor = withAuthor;
        SystemNotificationDataBuilder.prototype.withStartDate = withStartDate;
        SystemNotificationDataBuilder.prototype.withExpiryDate = withExpiryDate;
        SystemNotificationDataBuilder.prototype.inactive = inactive;
        SystemNotificationDataBuilder.prototype.withoutExpiryDate = withoutExpiryDate;

        return SystemNotificationDataBuilder;

        function SystemNotificationDataBuilder() {
            SystemNotificationDataBuilder.instanceNumber = (SystemNotificationDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = SystemNotificationDataBuilder.instanceNumber;
            this.id = 'system-notification-id-' + instanceNumber;
            this.title = 'System Notification Title' + instanceNumber;
            this.message = 'System Notification Message ' + instanceNumber;
            this.startDate = '2019-06-10T05:41:37.603Z';
            this.expiryDate = '2019-06-10T05:41:37.603Z';
            this.createdDate = '2019-06-10T05:41:37.603Z';
            this.active = true;
            this.author = new ObjectReferenceDataBuilder().build();
            this.displayed = true;
        }

        function withStartDate(startDate) {
            this.startDate = startDate;
            return this;
        }

        function withExpiryDate(expiryDate) {
            this.expiryDate = expiryDate;
            return this;
        }

        function withAuthor(author) {
            this.author = author;
            return this;
        }

        function inactive() {
            this.active = false;
            return this;
        }

        function withoutExpiryDate() {
            return this.withExpiryDate();
        }

        function build() {
            return {
                id: this.id,
                title: this.title,
                message: this.message,
                startDate: this.startDate,
                expiryDate: this.expiryDate,
                createdDate: this.createdDate,
                active: this.active,
                author: this.author
            };
        }

    }

})();