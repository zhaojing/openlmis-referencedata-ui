(function(){
    "use strict";

    /**
     *
     * @ngdoc service
     * @name requisition-view.convertToOrderModalService
     * @description
     * Directive to display modal for converting single requisition to order.
     *
     */

    angular
        .module('requisition-view')
        .service('convertToOrderModalService', convertToOrderModal);

    convertToOrderModal.$inject = ['$q', '$state', '$rootScope', '$ngBootbox', 'messageService',
        '$compile', '$templateRequest', 'requisitionService', '$stateParams', 'loadingModalService'];

    function convertToOrderModal($q, $state, $rootScope, $ngBootbox, messageService, $compile,
        $templateRequest, requisitionService, $stateParams, loadingModalService) {

        var deferred, scope = $rootScope.$new();

        scope.convertRnr = convertRnr;

        this.show = show;


        /**
         * @ngdoc function
         * @name show
         * @methodOf requisition-view.convertToOrderModalService
         * @param {Object} requisition Requisition for convert
         * @return {Promises} depots for requisition and template for modal
         *
         * @description
         * Shows modal to convert requisition.
         *
         */
        function show(requisition) {
            deferred = $q.defer();

            scope.requisition = requisition;
            scope.searchText = undefined;

            $q.all([
                getDepotsForRequisition(),
                $templateRequest('requisition-view/convert-to-order-modal.html')
            ]).then(function(result) {
                var depots = result[0],
                    template = result[1];

                scope.requisitionWithDepots = depots;
                scope.requisitionWithDepots.requisition.supplyingFacility = undefined;

                $ngBootbox.customDialog({
                    title: scope.requisition.program.name + ' (' + scope.requisition.facility.type.name +
                           '): ' + messageService.get('label.convert.requisition.to.order'),
                    message: $compile(angular.element(template))(scope),
                    className: 'convert-to-order-modal'
                });
            });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name close
         * @methodOf requisition-view.convertToOrderModalService
         *
         * @description
         * Close modal.
         *
         */
        function close() {
            $ngBootbox.hideAll();
            deferred.reject();
        }

        /**
         * @ngdoc function
         * @name convertRnr
         * @methodOf requisition-view.convertToOrderModalService
         *
         * @description
         * Converts given requisition into order and then reload page.
         *
         */
        function convertRnr(){
            close();
            requisitionService.convertToOrder([scope.requisitionWithDepots]).then($state.reload);
        }

        /**
         * @ngdoc function
         * @name getDepotsForRequisition
         * @methodOf requisition-view.convertToOrderModalService
         * @return {Promise} Depots for current requisition.
         *
         * @description
         * Get depots for current requisition.
         *
         */
        function getDepotsForRequisition() {
            loadingModalService.open();
            requisitionService.forConvert({
                filterBy: $stateParams.filterBy,
                filterValue: $stateParams.filterValue,
                sortBy: $stateParams.sortBy,
                descending: $stateParams.descending
            }).then(function(requisitions){
                requisitions.forEach(function(rnr) {
                    if (rnr.requisition.id == scope.requisition.id) {
                        deferred.resolve(rnr);
                    }
                });
            }).finally(function() {
                loadingModalService.close();
            });

            return deferred.promise;
        }
    }
})();
