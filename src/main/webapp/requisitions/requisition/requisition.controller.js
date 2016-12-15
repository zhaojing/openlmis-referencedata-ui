/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */
(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis.requisitions.RequisitionCtrl
     *
     * @description
     * Controller for managing requisitions.
     */

    angular.module('openlmis.requisitions').controller('RequisitionCtrl', RequisitionCtrl);

    RequisitionCtrl.$inject = ['$scope', '$state', 'requisition', 'requisitionValidator',
                               'AuthorizationService', 'messageService', 'LoadingModalService',
                               'Notification', 'Confirm', 'RequisitionRights',
                               'ConvertToOrderModal'];

    function RequisitionCtrl($scope, $state, requisition, requisitionValidator,
                             AuthorizationService, messageService, LoadingModalService,
                             Notification, Confirm, RequisitionRights, ConvertToOrderModal) {

        /**
         * @ngdoc property
         * @name $scope.requisition
         * @propertyOf openlmis.requisitions.RequisitionCtrl
         * @type {Object}
         *
         * @description
         * Holds requisition.
         */
        $scope.requisition = requisition;

        /**
        * @ngdoc property
        * @name $scope.requisitionType
        * @propertyOf openlmis.requisitions.RequisitionCtrl
        * @type {String}
        *
        * @description
        * Holds message key to display, depending on the requisition type (regular/emergency).
        */
        $scope.requisitionType = $scope.requisition.emergency ? 'requisition.type.emergency' : 'requisition.type.regular';

        // Functions

        $scope.saveRnr = saveRnr;
        $scope.submitRnr = submitRnr;
        $scope.authorizeRnr = authorizeRnr;
        $scope.removeRnr = removeRnr;
        $scope.convertRnr = convertRnr;
        $scope.approveRnr = approveRnr;
        $scope.rejectRnr = rejectRnr;
        $scope.periodDisplayName = periodDisplayName;
        $scope.displaySubmit = displaySubmit;
        $scope.displayAuthorize = displayAuthorize;
        $scope.displayDelete = displayDelete;
        $scope.displayApproveAndReject = displayApproveAndReject;
        $scope.displayConvertToOrder = displayConvertToOrder;

         /**
         * @ngdoc function
         * @name saveRnr
         * @methodOf openlmis.requisitions.RequisitionCtrl
         *
         * @description
         * Responsible for saving requisition. If the requisition fails to save, an error
         * notification modal will be displayed.
         * Otherwise, a success notification modal will be shown.
         */
        function saveRnr() {
            LoadingModalService.open();
            save().then(function(response) {
                LoadingModalService.close();
                Notification.success('msg.rnr.save.success');
                reloadState();
            });
        };

        /**
         * @ngdoc function
         * @name submitRnr
         * @methodOf openlmis.requisitions.RequisitionCtrl
         *
         * @description
         * Responsible for submitting requisition. Displays confirmation dialog, and checks
         * requisition validity before submission. If the requisition is not valid, fails to save or
         * an error occurs during submission, an error notification modal will be displayed.
         * Otherwise, a success notification modal will be shown.
         */
        function submitRnr() {
            Confirm('msg.question.confirmation.submit').then(function() {
                if (requisitionValidator.validateRequisition(requisition)) {
                    save().then(function() {
                        LoadingModalService.open();
                        $scope.requisition.$submit()
                        .then(function(response) {
                            Notification.success('msg.rnr.save.success');
                            reloadState();
                        })
                        .catch(function(response) {
                            Notification.error('msg.rnr.submitted.failure');
                        })
                        .finally(LoadingModalService.close);
                    });
                } else {
                    Notification.error('error.rnr.validation');
                }
            });
        };

        /**
         * @ngdoc function
         * @name authorizeRnr
         * @methodOf openlmis.requisitions.RequisitionCtrl
         *
         * @description
         * Responsible for authorizing requisition. Displays confirmation dialog, and checks
         * requisition validity before authorization. If the requisition is not valid, fails to
         * save or an error occurs during authorization, an error notification modal will be
         * displayed.
         * Otherwise, a success notification modal will be shown.
         */
        function authorizeRnr() {
            Confirm('msg.question.confirmation.authorize').then(function() {
                if (requisitionValidator.validateRequisition(requisition)) {
                    save().then(function() {
                        LoadingModalService.open();
                        $scope.requisition.$authorize()
                        .then(function(response) {
                            Notification.success('msg.rnr.authorized.success');
                            reloadState();
                        })
                        .catch(function(response) {
                            Notification.error('msg.rnr.authorized.failure');
                        })
                        .finally(LoadingModalService.close);
                    });
                } else {
                    Notification.error('error.rnr.validation');
                }
            });
        };

        /**
         * @ngdoc function
         * @name removeRnr
         * @methodOf openlmis.requisitions.RequisitionCtrl
         *
         * @description
         * Responsible for removing requisition. Displays confirmation dialog before deletion.
         * If an error occurs during authorization, it will display an error notification modal.
         * Otherwise, a success notification modal will be shown.
         */
        function removeRnr() {
            Confirm.destroy('msg.question.confirmation.deletion').then(function() {
                LoadingModalService.open();
                $scope.requisition.$remove()
                .then(function(response) {
                    $state.go('requisitions.initRnr');
                    Notification.success('msg.rnr.deletion.success');
                })
                .catch(function(response) {
                    Notification.error('msg.rnr.deletion.failure');
                })
                .finally(LoadingModalService.close);
            });
        };

        /**
         * @ngdoc function
         * @name approveRnr
         * @methodOf openlmis.requisitions.RequisitionCtrl
         *
         * @description
         * Responsible for approving requisition. Displays confirmation dialog, and checks
         * requisition validity before approval. If the requisition is not valid or it fails to
         * save, an error notification modal will be displayed.
         * Otherwise, a success notification modal will be shown.
         */
        function approveRnr() {
            Confirm('msg.question.confirmation').then(function() {
                if(requisitionValidator.validateRequisition(requisition)) {
                    save()
                    .then(function() {
                        LoadingModalService.open();
                        $scope.requisition.$approve()
                        .then(function(response) {
                            $state.go('requisitions.approvalList');
                            Notification.success('msg.rnr.approved.success');
                        })
                        .finally(LoadingModalService.close);
                    });
                } else {
                    Notification.error('error.rnr.validation');
                }
             });
        };

        /**
         * @ngdoc function
         * @name rejectRnr
         * @methodOf openlmis.requisitions.RequisitionCtrl
         *
         * @description
         * Responsible for rejecting requisition. Displays confirmation dialog before rejection.
         * If an error occurs during rejecting it will display an error notification modal.
         * Otherwise, a success notification modal will be shown.
         */
        function rejectRnr() {
            Confirm('msg.question.confirmation').then(function() {
                LoadingModalService.open();
                $scope.requisition.$reject()
                .then(function(response) {
                    $state.go('requisitions.approvalList');
                    Notification.success('msg.rnr.reject.success');
                })
                .catch(function(response) {
                    Notification.error('msg.rejected.failure');
                })
                .finally(LoadingModalService.close);
            });
        };

        /**
         * @ngdoc function
         * @name periodDisplayName
         * @methodOf openlmis.requisitions.RequisitionCtrl
         *
         * @description
         * Creates human readable duration of reporting period.
         *
         * @returns {string} Reporting period.
         *
         */
        function periodDisplayName() {
            //TODO: This is a temporary solution.
            return $scope.requisition.processingPeriod.startDate.slice(0,3).join('/') + ' - ' + $scope.requisition.processingPeriod.endDate.slice(0,3).join('/');
        };

        /**
         * @ngdoc function
         * @name displayAuthorize
         * @methodOf openlmis.requisitions.RequisitionCtrl
         *
         * @description
         * Determines whether to display authorize button or not. Returns true only if requisition
         * is submitted and user has permission to authorize requisition.
         *
         * @return {boolean} should authorize button be displayed
         */
        function displayAuthorize() {
            var hasRight = AuthorizationService.hasRight(RequisitionRights.REQUISITION_AUTHORIZE, {
                programCode: $scope.requisition.program.code
            });
            return $scope.requisition.$isSubmitted() && hasRight;
        };

        /**
         * @ngdoc function
         * @name displaySubmit
         * @methodOf openlmis.requisitions.RequisitionCtrl
         *
         * @description
         * Determines whether to display submit button or not. Returns true only if requisition
         * is initiated and user has permission to create requisition.
         *
         * @return {boolean} should submit button be displayed
         */
        function displaySubmit() {
            var hasRight = AuthorizationService.hasRight(RequisitionRights.REQUISITION_CREATE, {
                programCode: $scope.requisition.program.code
            });
            return $scope.requisition.$isInitiated() && hasRight;
        };

        /**
         * @ngdoc function
         * @name displayApproveAndReject
         * @methodOf openlmis.requisitions.RequisitionCtrl
         *
         * @description
         * Determines whether to display approve and reject buttons or not. Returns true only if
         * requisition is authorized and user has permission to approve requisition.
         *
         * @return {boolean} should approve and reject buttons be displayed
         */
        function displayApproveAndReject() {
            var hasRight = AuthorizationService.hasRight(RequisitionRights.REQUISITION_APPROVE, {
                programCode: $scope.requisition.program.code
            });
            return $scope.requisition.$isAuthorized() && hasRight;
        };

        /**
         * @ngdoc function
         * @name displayDelete
         * @methodOf openlmis.requisitions.RequisitionCtrl
         *
         * @description
         * Determines whether to display delete button or not. Returns true only if requisition
         * is initiated and user has permission to delete requisition.
         *
         * @return {boolean} should delete button be displayed
         */
        function displayDelete() {
            var hasRight = AuthorizationService.hasRight(RequisitionRights.REQUISITION_DELETE, {
                programCode: $scope.requisition.program.code
            });
            return $scope.requisition.$isInitiated() && hasRight;
        };

        /**
         * @ngdoc function
         * @name displayConvertToOrder
         * @methodOf openlmis.requisitions.RequisitionCtrl
         *
         * @description
         * Determines whether to display convert to order button or not. Returns true only if
         * requisition is approved and user has permission to convert requisition.
         *
         * @return {boolean} should convert to order button be displayed
         */
        function displayConvertToOrder() {
            var hasRight = AuthorizationService.hasRight(RequisitionRights.CONVERT_TO_ORDER, {
                programCode: $scope.requisition.program.code
            });
            return $scope.requisition.$isApproved() && hasRight;
        };

        /**
         * @ngdoc function
         * @name convertRnr
         * @methodOf openlmis.requisitions.RequisitionCtrl
         *
         * @description
         * Displays convert to order modal.
         */
        function convertRnr() {
            ConvertToOrderModal.show($scope.requisition);
        };

        function save() {
            LoadingModalService.open();
            var promise = $scope.requisition.$save();
            promise.catch(failedToSave);
            promise.finally(LoadingModalService.close)
            return promise;
        }

        function failedToSave(response) {
            if (response.status !== 403) {
                Notification.error(messageService.get('msg.rnr.save.failure'));
            }
        }

        function reloadState() {
            $state.reload();
        }

    }
})();