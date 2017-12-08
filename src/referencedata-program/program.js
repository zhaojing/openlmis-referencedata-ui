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
     * @name referencedata-program.Program
     *
     * @description
     * Represents a single program.
     */
    angular
        .module('referencedata-program')
        .factory('Program', Program);

    function Program() {

        return Program;

        /**
         * @ngdoc method
         * @methodOf referencedata-program.Program
         * @name Program
         *
         * @description
         * Creates a new instance of the Program class.
         *
         * @param  {String}  id                                     the UUID of the program to be created
         * @param  {String}  code                                   the code of the program to be created
         * @param  {String}  name                                   the name of the program to be created
         * @param  {String}  description                            the description of the program to be created
         * @param  {Boolean} active                                 true if the program is active
         * @param  {Boolean} periodsSkippable                       true if the period is the program can be skipped
         * @param  {Boolean} skipAuthorization                      true if this program does not go through authorization step
         * @param  {Boolean} showNonFullSupplyTab                   true if non full supply tab should be shown
         * @param  {Boolean} enableDatePhysicalStockCountCompleted  true if date physical stock count completed is enabled
         * @return {Object}                                         the program object
         */
        function Program(id, code, name, description, active, periodsSkippable, skipAuthorization,
                         showNonFullSupplyTab, enableDatePhysicalStockCountCompleted) {
            this.id = id;
            this.code = code;
            this.name = name;
            this.description = description;
            this.active = active;
            this.periodsSkippable = periodsSkippable;
            this.skipAuthorization = skipAuthorization;
            this.showNonFullSupplyTab = showNonFullSupplyTab;
            this.enableDatePhysicalStockCountCompleted = enableDatePhysicalStockCountCompleted;
        }

    }

})();
