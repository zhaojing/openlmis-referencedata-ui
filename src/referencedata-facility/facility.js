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
     * @name referencedata-facility.Facility
     *
     * @description
     * Represents a single facility.
     */
    angular
        .module('referencedata-facility')
        .factory('Facility', Facility);

    function Facility() {

        return Facility;

        /**
         * @ngdoc method
         * @methodOf referencedata-facility.Facility
         * @name Facility
         *
         * @description
         * Creates a new instance of the Facility class.
         *
         * @param  {String}  id                 the UUID of the facility to be created
         * @param  {String}  code               the code of the facility to be created
         * @param  {String}  name               the name of the facility to be created
         * @param  {String}  description        the description of the facility to be created
         * @param  {Object}  geographicZone     the geographicZone of the facility to be created
         * @param  {Object}  type               the type of the facility to be created
         * @param  {Object}  operator           the operator of the facility to be created
         * @param  {Boolean} active             true if the facility to be created is active
         * @param  {Date}    goLiveDate         the date when the facility goes life
         * @param  {Date}    goDownDate         the date when the facility goes down
         * @param  {String}  comment            the comment of the facility to be created
         * @param  {Boolean} enabled            true if the facility to be created is enabled
         * @param  {Boolean} openLmisAccessible true if the facility to be created is accessible
         * @param  {Object}  location           the location of the facility to be created
         * @param  {Object}  extraData          the extraData of the facility to be created
         * @return {Object}                     the facility object
         */
        function Facility(id, code, name, description, geographicZone, type, operator, active,
            goLiveDate, goDownDate, comment, enabled, openLmisAccessible, location, extraData) {
            this.id = id;
            this.name = name;
            this.code = code;
            this.description = description;
            this.geographicZone = geographicZone;
            this.type = type;
            this.operator = operator;
            this.active = active;
            this.goLiveDate = goLiveDate;
            this.goDownDate = goDownDate;
            this.comment = comment;
            this.enabled = enabled;
            this.openLmisAccessible = openLmisAccessible;
            this.location = location;
            this.extraData = extraData;
        }

    }

})();
