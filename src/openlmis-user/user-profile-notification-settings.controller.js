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

    /**
     * @ngdoc controller
     * @name openlmis-user.controller:UserProfileNotificationSettingsController
     *
     * @description
     * Allows user to see his notification settings.
     */
    angular
        .module('openlmis-user')
        .controller('UserProfileNotificationSettingsController', controller);

    controller.$inject = [
        'digestConfigurations', 'userSubscriptions', 'UserSubscriptionResource', 'user', '$state', 'FunctionDecorator'
    ];

    function controller(digestConfigurations, userSubscriptions, UserSubscriptionResource, user, $state,
                        FunctionDecorator) {
        var vm = this,
            DAILY_AT_MIDNIGHT = '0 0 * * *';

        vm.$onInit = onInit;

        vm.saveUserSubscriptions = new FunctionDecorator()
            .decorateFunction(saveUserSubscriptions)
            .withSuccessNotification('openlmisUser.userSubscriptionsHaveBeenSavedSuccessfully')
            .withErrorNotification('openlmisUser.failedToSaveUserSubscriptions')
            .withLoading()
            .getDecoratedFunction();

        /**
         * @ngdoc property
         * @propertyOf openlmis-user.controller:UserProfileNotificationSettingsController
         * @type {Array}
         * @name digestConfigurations
         *
         * @description
         * The list of digest configurations available in the system.
         */
        vm.digestConfigurations = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-user.controller:UserProfileNotificationSettingsController
         * @type {Array}
         * @name userSubscriptions
         *
         * @description
         * The list of user subscription to digest configurations.
         */
        vm.userSubscriptions = undefined;

        /**
         * @ngdoc method
         * @propertyOf openlmis-user.controller:UserProfileNotificationSettingsController
         * @name $onInit
         *
         * @description
         * Initialization method of the UserProfileNotificationSetttingsController.
         */
        function onInit() {
            vm.digestConfigurations = digestConfigurations;
            vm.userSubscriptionsMap = digestConfigurations.reduce(function(map, configuration) {
                map[configuration.id] = userSubscriptions.filter(function(subscription) {
                    return configuration.id === subscription.digestConfiguration.id;
                }).length > 0;
                return map;
            }, {});
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-user.controller:UserProfileNotificationSettingsController
         * @name saveUserSubscriptions
         *
         * @description
         * Saves the user subscriptions on the server.
         * 
         * @return {Promise}  the promise resolved once saving is complete.
         */
        function saveUserSubscriptions() {
            var userSubscriptions = Object.keys(vm.userSubscriptionsMap)
                .filter(isSubscribed)
                .map(mapToDigestConfiguration);

            return new UserSubscriptionResource()
                .create(userSubscriptions, {
                    userId: user.id
                })
                .then(function() {
                    $state.reload();
                });
        }

        function isSubscribed(digestConfigurationId) {
            return vm.userSubscriptionsMap[digestConfigurationId];
        }

        function mapToDigestConfiguration(digestConfigurationId) {
            return {
                digestConfiguration: {
                    id: digestConfigurationId

                },
                cronExpression: DAILY_AT_MIDNIGHT
            };
        }

    }

})();
