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
            this.UserSubscriptionDataBuilder = $injector.get('UserSubscriptionDataBuilder');
            this.ObjectReferenceDataBuilder = $injector.get('ObjectReferenceDataBuilder');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.UserSubscriptionResource = $injector.get('UserSubscriptionResource');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$state = $injector.get('$state');
        });

        this.digestConfigurations = [
            new this.DigestConfigurationDataBuilder().buildJson(),
            new this.DigestConfigurationDataBuilder().buildJson(),
            new this.DigestConfigurationDataBuilder().buildJson()
        ];

        this.userSubscriptions = [
            new this.UserSubscriptionDataBuilder()
                .withCronExpression('0 0 * * *')
                .withDigestConfiguration(
                    new this.ObjectReferenceDataBuilder()
                        .withId(this.digestConfigurations[0].id)
                        .build()
                )
                .buildJson(),
            new this.UserSubscriptionDataBuilder()
                .withCronExpression('0 0 * * *')
                .withDigestConfiguration(
                    new this.ObjectReferenceDataBuilder()
                        .withId(this.digestConfigurations[2].id)
                        .build()
                )
                .buildJson()
        ];

        this.user = new this.UserDataBuilder().build();

        spyOn(this.$state, 'reload');
        spyOn(this.UserSubscriptionResource.prototype, 'create').andReturn(this.$q.resolve([
            this.userSubscriptions[1]
        ]));

        this.vm = this.$controller('UserProfileNotificationSettingsController', {
            digestConfigurations: this.digestConfigurations,
            userSubscriptions: this.userSubscriptions,
            user: this.user
        });
        this.vm.$onInit();
    });

    describe('$onInit', function() {

        it('should set the list of digest configurations', function() {
            expect(this.vm.digestConfigurations).toEqual(this.digestConfigurations);
        });

        it('should map user subscriptions by digest configuration ID', function() {
            var expected = {};
            expected[this.digestConfigurations[0].id] = {
                subscribed: true,
                cronExpression: this.userSubscriptions[0].cronExpression
            };
            expected[this.digestConfigurations[1].id] = {
                subscribed: false,
                cronExpression: ''
            };
            expected[this.digestConfigurations[2].id] = {
                subscribed: true,
                cronExpression: this.userSubscriptions[1].cronExpression
            };

            expect(this.vm.userSubscriptionsMap).toEqual(expected);
        });

    });

    describe('saveUserSubscriptions', function() {

        it('should update user subscriptions', function() {
            this.vm.userSubscriptionsMap[this.digestConfigurations[2].id].subscribed = false;

            this.vm.saveUserSubscriptions();
            this.$rootScope.$apply();

            expect(this.UserSubscriptionResource.prototype.create).toHaveBeenCalledWith(
                [{
                    digestConfiguration: {
                        id: this.digestConfigurations[0].id
                    },
                    cronExpression: this.userSubscriptions[0].cronExpression
                }],
                {
                    userId: this.user.id
                }
            );
        });

        it('should return promise', function() {
            var success;
            this.vm.saveUserSubscriptions()
                .then(function() {
                    success = true;
                });

            this.$rootScope.$apply();

            expect(success).toEqual(true);
        });

        it('should reload state on success', function() {
            this.vm.saveUserSubscriptions();
            this.$rootScope.$apply();

            expect(this.$state.reload).toHaveBeenCalled();
        });

        it('should not reload on error', function() {
            this.UserSubscriptionResource.prototype.create.andReturn(this.$q.reject());

            this.vm.saveUserSubscriptions();
            this.$rootScope.$apply();

            expect(this.$state.reload).not.toHaveBeenCalled();
        });

    });

});