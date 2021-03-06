/**
 *
 * (c) Copyright Ascensio System SIA 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function ($, OC) {

    $(document).ready(function () {
        OCA.Onlyoffice = _.extend({
                AppName: "onlyoffice"
            }, OCA.Onlyoffice)

        var advToogle = function () {
            $("#onlyofficeSecretPanel").toggleClass("onlyoffice-hide");
            $("#onlyofficeAdv .icon").toggleClass("icon-triangle-s icon-triangle-n");
        };

        if ($("#onlyofficeInternalUrl").val().length
            || $("#onlyofficeStorageUrl").val().length) {
            advToogle();
        }

        $("#onlyofficeAdv").click(function () {
            advToogle();
        });

        $("#onlyofficeGroups").prop("checked", $("#onlyofficeLimitGroups").val() != "");

        var groupListToggle = function () {
            if ($("#onlyofficeGroups").prop("checked")) {
                OC.Settings.setupGroupsSelect($("#onlyofficeLimitGroups"));
            } else {
                $("#onlyofficeLimitGroups").select2("destroy");
            }
        };

        $("#onlyofficeGroups").click(groupListToggle);
        groupListToggle();

        var demoToggle = function () {
            $("#onlyofficeAddrSettings input:not(#onlyofficeStorageUrl)").prop("disabled", $("#onlyofficeDemo").prop("checked"));
        };

        $("#onlyofficeDemo").click(demoToggle);
        demoToggle();


        $("#onlyofficeAddrSave").click(function () {
            $(".section-onlyoffice").addClass("icon-loading");
            var onlyofficeUrl = $("#onlyofficeUrl").val().trim();

            if (!onlyofficeUrl.length) {
                $("#onlyofficeInternalUrl, #onlyofficeStorageUrl, #onlyofficeSecret").val("");
            }

            var onlyofficeInternalUrl = ($("#onlyofficeInternalUrl:visible").val() || "").trim();
            var onlyofficeStorageUrl = ($("#onlyofficeStorageUrl:visible").val() || "").trim();
            var onlyofficeVerifyPeerOff = $("#onlyofficeVerifyPeerOff").prop("checked");
            var onlyofficeSecret = ($("#onlyofficeSecret:visible").val() || "").trim();
            var demo = $("#onlyofficeDemo").prop("checked");

            $.ajax({
                method: "PUT",
                url: OC.generateUrl("apps/" + OCA.Onlyoffice.AppName + "/ajax/settings/address"),
                data: {
                    documentserver: onlyofficeUrl,
                    documentserverInternal: onlyofficeInternalUrl,
                    storageUrl: onlyofficeStorageUrl,
                    verifyPeerOff: onlyofficeVerifyPeerOff,
                    secret: onlyofficeSecret,
                    demo: demo
                },
                success: function onSuccess(response) {
                    $(".section-onlyoffice").removeClass("icon-loading");
                    if (response && (response.documentserver != null || demo)) {
                        $("#onlyofficeUrl").val(response.documentserver);
                        $("#onlyofficeInternalUrl").val(response.documentserverInternal);
                        $("#onlyofficeStorageUrl").val(response.storageUrl);
                        $("#onlyofficeSecret").val(response.secret);

                        $(".section-onlyoffice-2").toggleClass("onlyoffice-hide", (!response.documentserver.length && !demo) || !!response.error.length);

                        var message =
                            response.error
                                ? (t(OCA.Onlyoffice.AppName, "Error when trying to connect") + " (" + response.error + ")")
                                : t(OCA.Onlyoffice.AppName, "Settings have been successfully updated");

                        var versionMessage = response.version ? (" (" + t(OCA.Onlyoffice.AppName, "version") + " " + response.version + ")") : "";

                        OC.Notification.show(message + versionMessage, {
                            type: response.error ? "error" : null,
                            timeout: 3
                        });
                    }
                }
            });
        });

        $("#onlyofficeSave").click(function () {
            $(".section-onlyoffice").addClass("icon-loading");

            var defFormats = {};
            $("input[id^=\"onlyofficeDefFormat\"]").each(function () {
                defFormats[this.name] = this.checked;
            });

            var editFormats = {};
            $("input[id^=\"onlyofficeEditFormat\"]").each(function () {
                editFormats[this.name] = this.checked;
            });

            var sameTab = $("#onlyofficeSameTab").is(":checked");

            var limitGroupsString = $("#onlyofficeGroups").prop("checked") ? $("#onlyofficeLimitGroups").val() : "";
            var limitGroups = limitGroupsString ? limitGroupsString.split("|") : [];

            var chat = $("#onlyofficeChat").is(":checked");
            var compactHeader = $("#onlyofficeCompactHeader").is(":checked");
            var feedback = $("#onlyofficeFeedback").is(":checked");
            var help = $("#onlyofficeHelp").is(":checked");
            var toolbarNoTabs = !$("#onlyofficeToolbarNoTabs").is(":checked");
            var reviewDisplay = $("input[type='radio'][name='reviewDisplay']:checked").attr("id").replace("onlyofficeReviewDisplay_", "");

            $.ajax({
                method: "PUT",
                url: OC.generateUrl("apps/" + OCA.Onlyoffice.AppName + "/ajax/settings/common"),
                data: {
                    defFormats: defFormats,
                    editFormats: editFormats,
                    sameTab: sameTab,
                    limitGroups: limitGroups,
                    chat: chat,
                    compactHeader: compactHeader,
                    feedback: feedback,
                    help: help,
                    toolbarNoTabs: toolbarNoTabs,
                    reviewDisplay: reviewDisplay
                },
                success: function onSuccess(response) {
                    $(".section-onlyoffice").removeClass("icon-loading");
                    if (response) {
                        var message = t(OCA.Onlyoffice.AppName, "Settings have been successfully updated");
                        OC.Notification.show(message, {
                            timeout: 3
                        });
                    }
                }
            });
        });

        $(".section-onlyoffice input").keypress(function (e) {
            var code = e.keyCode || e.which;
            if (code === 13) {
                $("#onlyofficeAddrSave").click();
            }
        });
    });

})(jQuery, OC);
