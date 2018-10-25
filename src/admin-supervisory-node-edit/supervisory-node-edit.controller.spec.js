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

describe('SupervisoryNodeEditController', function() {

    beforeEach(function() {
        module('admin-supervisory-node-edit');

        var SupervisoryNodeDataBuilder, $controller, FacilityDataBuilder;
        inject(function($injector) {
            SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            $controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
        });

        this.supervisoryNode = new SupervisoryNodeDataBuilder().buildWithChildNodes();
        this.facilitiesMap = {
            'facility-id-one': new FacilityDataBuilder()
                .withId('facility-id-one')
                .build(),
            'facility-id-two': new FacilityDataBuilder()
                .withId('facility-id-two')
                .build()
        };

        this.vm = $controller('SupervisoryNodeEditController', {
            supervisoryNode: this.supervisoryNode,
            childNodes: this.supervisoryNode.childNodes,
            facilitiesMap: this.facilitiesMap
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose supervisoryNode', function() {
            expect(this.vm.supervisoryNode).toEqual(this.supervisoryNode);
        });

        it('should expose childNodes', function() {
            expect(this.vm.childNodes).toEqual(this.supervisoryNode.childNodes);
        });

        it('', function() {
            expect(this.vm.facilitiesMap).toEqual(this.facilitiesMap);
        });

    });

    describe('goToSupervisoryNodeList', function() {

        beforeEach(function() {
            spyOn(this.$state, 'go').andReturn();
            this.vm.goToSupervisoryNodeList();
        });

        it('should call state go with correct params', function() {
            expect(this.$state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });
    });
});
