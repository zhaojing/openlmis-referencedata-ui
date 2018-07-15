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
        .module('referencedata-user')
        .factory('UserRepositoryImpl', UserRepositoryImpl);

    UserRepositoryImpl.inject = ['ReferenceDataUserResource', 'UserContactDetailsResource', 'AuthUserResource', '$q'];

    function UserRepositoryImpl(ReferenceDataUserResource, UserContactDetailsResource, AuthUserResource, $q) {

        UserRepositoryImpl.prototype.get = get;
        UserRepositoryImpl.prototype.query = query;
        UserRepositoryImpl.prototype.create = create;
        UserRepositoryImpl.prototype.update = update;

        return UserRepositoryImpl;

        function create(user) {
            var authUserResource = this.authUserResource,
                userContactDetailsResource = this.userContactDetailsResource;

            return this.referenceDataUserResource
                .update(user.getBasicInformation())
                .then(function(referenceDataUser) {
                    user.id = referenceDataUser.id;
                    return $q.all([
                        authUserResource.create(user.getAuthDetails()),
                        userContactDetailsResource.update(user.getContactDetails())
                    ]).then(function(responses) {
                        return combineResponses(referenceDataUser, responses[1]);
                    });
                });
        }

        function update(user) {
            return $q.all([
                this.referenceDataUserResource.update(user.getBasicInformation()),
                this.userContactDetailsResource.update(user.getContactDetails())
            ]).then(function(responses) {
                var referenceDataUser = responses[0],
                    userContactDetails = responses[1];

                return combineResponses(referenceDataUser, userContactDetails);
            });
        }

        function get(id) {
            return $q.all([
                this.referenceDataUserResource.get(id),
                this.userContactDetailsResource.get(id)
            ]).then(function(responses) {
                var referenceDataUser = responses[0],
                    userContactDetails = responses[1];

                return combineResponses(referenceDataUser, userContactDetails);
            });
        }

        function query(params) {
            var referenceDataUserResource = this.referenceDataUserResource;
            if (params && params.email) {
                return this.userContactDetailsResource.query({
                    email: params.email
                }).then(function(userContactDetailsPage) {
                    var ids = userContactDetailsPage.content.map(function(userContactDetails) {
                        return userContactDetails.referenceDataUserId;
                    });

                    if (ids.length) {
                        params.id = ids;
                        return referenceDataUserResource.query(params)
                            .then(function(referenceDataUserPage) {
                                return combinePages(referenceDataUserPage, userContactDetailsPage);
                            });
                    }
                    return userContactDetailsPage;
                });
            }

            var userContactDetailsResource = this.userContactDetailsResource;
            return this.referenceDataUserResource.query(params)
                .then(function(referenceDataUserPage) {
                    var ids = referenceDataUserPage.content.map(function(user) {
                        return user.id;
                    });

                    if (ids.length) {
                        return userContactDetailsResource.query({
                            id: ids
                        }).then(function(userContactDetailsPage) {
                            return combinePages(referenceDataUserPage, userContactDetailsPage);
                        });
                    }
                    return referenceDataUserPage;
                });
        }

        function UserRepositoryImpl() {
            this.referenceDataUserResource = new ReferenceDataUserResource();
            this.userContactDetailsResource = new UserContactDetailsResource();
            this.authUserResource = new AuthUserResource();
        }

        function combinePages(referenceDataUserPage, userContactDetailsPage) {
            referenceDataUserPage.content = referenceDataUserPage.content.map(function(referenceDataUser) {
                var userContactDetails = userContactDetailsPage.content.filter(function(userContactDetails) {
                    return userContactDetails.referenceDataUserId === referenceDataUser.id;
                })[0];
                return combineResponses(referenceDataUser, userContactDetails);
            });
            return referenceDataUserPage;
        }

        function combineResponses(referenceDataUser, userContactDetails) {
            if (userContactDetails) {
                referenceDataUser.phoneNumber = userContactDetails.phoneNumber;
                referenceDataUser.email = userContactDetails.emailDetails.email;
                referenceDataUser.verified = userContactDetails.emailDetails.emailVerified;
                referenceDataUser.allowNotify = userContactDetails.allowNotify;
            }

            return referenceDataUser;
        }

    }

})();