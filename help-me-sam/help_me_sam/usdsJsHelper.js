// Copyright (c) 2013

// var $, alert;

var usdsJsHelper = {

    loadFieldHandlers: function(pageId, siteData) {
        var fields;
        $.each(siteData.pages, function(index, page) {
            if (page.page_name === pageId) {
                fields = page.form_fields;
                return false;
            }
            return true;
        });
        $.each(fields, function(text, field) {
            $('input[title="' + field.matchString + '"]').on('mouseenter mouseleave focus focusout',
                { field: field},function(ev) {
            var digitsOnly, currentField,  errorOccurred, errorMessage, hoverText, hoverHtmlDiv;
            currentField = ev.data.field;
            switch(ev.type) {
                case 'mouseenter':  // hover
                if (currentField.required === "true") {
                hoverText = "Example of help on hover:<br>" + currentField.hover + "<br>(required)";
                } else {
                hoverText = "Example of help on hover:<br>" + currentField.hover + "<br>(optional)";
                }
                hoverHtmlDiv = $('<div class="floating-help" id="popup-help">'
                    + hoverText + '</div>');
                hoverHtmlDiv.insertAfter(this);
                break;

                case 'mouseleave':  // stop displaying hover
                $('#popup-help').remove();
                break;

                case 'focus':   // display info in helper
                $('p.field-focus').html('info for active field:<br>' + currentField.focus);
                break;

                case 'focusout':    // validate
                if ((currentField.required === 'false') && (this.value === "")) {
                    break;  // if optional, then don't validate a blank entry
                }
                errorOccurred = false;
                errorMessage = "Error:\n";
                switch (currentField.validator.type) {
                    case "alpha-string":
                    if (this.value.indexOf(" ") !== -1) {
                    errorMessage += "no spaces allowed\n";
                    errorOccurred = true;
                    }
                    if (this.value.length > currentField.validator.rules.length) {
                    errorMessage += "maximum length: " + currentField.validator.rules.length;
                    errorOccurred = true;
                    }
                    if (errorOccurred === true) {
                    alert(errorMessage);
                    this.focus();
                    this.select();
                    }
                    break;

                    case "us-phone":
                    digitsOnly = this.value.replace(/\D/g,"");
                    if (digitsOnly.length !== 10) {
                    alert(errorMessage + "Telephone numbers must have 10 digits");
                    this.focus();
                    this.select();
                    } else {
                    this.value = '(' + digitsOnly.substr(0,3) + ')'
                       +  digitsOnly.substr(3,3) + '-' + digitsOnly.substr(6,4);
                }
                break;

                case "email":
                if (!this.value.match( /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/)) {
                    alert(errorMessage + this.value + ' is not a valid email address');
                    this.focus();
                    this.select();
                }
                break;

                case "confirm":

                $.each(fields, function(text, confirmField) {
                    if (confirmField.matchString === field.validator.rules.matchField) {
                        var str1 = $('input[title="' + field.matchString + '"]').val();
                    var str2 = $('input[title="' + confirmField.matchString + '"]').val();
                        if (str1 !== str2) {
                        alert(errorMessage + str1 + '\nand ' + str2 +' do not match');
                        $('input[title="' + field.matchString + '"]').focus();
                        $('input[title="' + field.matchString + '"]').select();
                    }
                    return false;
                        }
                });
                break;

                default:
                break;
                }
                break;

                default:
                break;
            }
            });
        });
    },

    _pageContent: {},

    contentForPgItm: function (htmlContent, pageToken, itemToken) {
        var content;
        var page = this._pageContent;
        if (page.length === undefined) {
            var items = $(htmlContent).filter('.helper_page[title=' + pageToken + ']');
            $.each(items.children(), function(index, item) {
                page[ item.title ] = item;
            });
        }
        if (itemToken === undefined) {
            return this._pageContent;
        } else {
            $.each(this._pageContent, function(index, item) {
                if (item.title === itemToken) {
                    content = item;
                    return false;
                } else {
                    return true;
                }
            });
            return content;
        }
    }
 };
