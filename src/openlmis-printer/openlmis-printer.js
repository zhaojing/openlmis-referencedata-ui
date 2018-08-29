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
     * @ngdoc service
     * @name openlmis-printer.OpenlmisPrinter
     *
     * @description
     * Class responsible for printing object with the given URI and ID.
     */
    angular
        .module('openlmis-printer')
        .factory('OpenlmisPrinter', OpenlmisPrinter);

    OpenlmisPrinter.$inject = ['$window', 'openlmisUrlFactory', 'accessTokenFactory', 'messageService'];

    function OpenlmisPrinter($window, openlmisUrlFactory, accessTokenFactory, messageService) {

        OpenlmisPrinter.prototype.openTab = openTab;
        OpenlmisPrinter.prototype.print = print;
        OpenlmisPrinter.prototype.closeTab = closeTab;
        OpenlmisPrinter.prototype.setId = setId;

        return OpenlmisPrinter;

        /**
         * @ngdoc method
         * @methodOf openlmis-printer.OpenlmisPrinter
         * @name OpenlmisPrinter
         * @constructor
         *
         * @description
         * Creates an instance of the OpenlmisPrinter class.
         *
         * Configuration options:
         * - resourceUri - the URI to the resource the whole URL will be build using URL factory
         * - id - the ID of the object
         * - loadingMessage - the message to be shown while the PDF is being prepared, defaults to
         *                    openlmisPrinter.loading (Loading... for English version)
         *
         * @param {Object} config the configuration object
         */
        function OpenlmisPrinter(config) {
            if (config) {
                this.loadingMessage = config.loadingMessage;

                if (config.resourceUri && config.resourceUri.slice(-1) === '/') {
                    this.resourceUri = config.resourceUri.slice(0, -1);
                } else {
                    this.resourceUri = config.resourceUri;
                }

                this.id = config.id;
            }

            if (!this.loadingMessage) {
                this.loadingMessage = 'openlmisPrinter.loading';
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-printer.OpenlmisPrinter
         * @name openTab
         *
         * @description
         * Opens a new window in which the PDF will be shown allowing user to print it. This method must be called
         * directly in the call stack of an user action in order for it to not be (potentially) prevented by popup
         * handler.
         */
        function openTab() {
            this.tab = $window.open('', '_blank');
            this.tab.document.write(messageService.get(this.loadingMessage));
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-printer.OpenlmisPrinter
         * @name print
         *
         * @description
         * Opens the PDF in the opened window. This method must be called after openTab has been called.
         */
        function print() {
            var url = openlmisUrlFactory(getUri.apply(this));
            url = accessTokenFactory.addAccessToken(url);
            this.tab.location.href = url;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-printer.OpenlmisPrinter
         * @name closeTab
         *
         * @description
         * Closes the open tab.
         */
        function closeTab() {
            this.tab.close();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-printer.OpenlmisPrinter
         * @name setId
         *
         * @description
         * Sets the ID of the object to fetched.
         * 
         * @param {String} id the id of the object
         */
        function setId(id) {
            this.id = id;
        }

        function getUri() {
            return this.resourceUri + '/' + this.id + '/print?format=pdf';
        }

    }

})();