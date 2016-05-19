define([
    'underscore',
    'backbone',
    'gettext',
    'edx-ui-toolkit/js/utils/html-utils',
    'text!templates/paging-header.underscore'
], function(_, Backbone, gettext, HtmlUtils, paging_header_template) {

        var PagingHeader = Backbone.View.extend({
            events : {
                'click .next-page-link': 'nextPage',
                'click .previous-page-link': 'previousPage'
            },

            initialize: function(options) {
                var view = options.view,
                    collection = view.collection;
                this.view = view;
                collection.bind('add', _.bind(this.render, this));
                collection.bind('remove', _.bind(this.render, this));
                collection.bind('reset', _.bind(this.render, this));
            },

            render: function() {
                var view = this.view,
                    collection = view.collection,
                    currentPage = collection.getPageNumber(),
                    lastPage = collection.getTotalPages(),
                    messageHtml = this.messageHtml(),
                    isNextDisabled = lastPage === 0 || currentPage === lastPage;

                this.$el.html(_.template(paging_header_template)({ messageHtml: messageHtml}));
                this.$(".previous-page-link")
                    .toggleClass("is-disabled", currentPage === 1)
                    .attr('aria-disabled', currentPage === 1);
                this.$(".next-page-link")
                    .toggleClass("is-disabled", isNextDisabled)
                    .attr('aria-disabled', isNextDisabled);
                return this;
            },

            messageHtml: function() {
                var message = '';
                var asset_type = false;
                if (this.view.collection.assetType) {
                    if (this.view.collection.sortDirection === 'asc') {
                        // Translators: sample result:
                        // "Showing 0-9 out of 25 total, filtered by Images, sorted by Date Added ascending"
                        message = gettext(
                            'Showing {currentItemRange} out of {totalItemsCount}, filtered by {assetType},' +
                            ' sorted by {sortName} ascending'
                        );
                    } else {
                        // Translators: sample result:
                        // "Showing 0-9 out of 25 total, filtered by Images, sorted by Date Added descending"
                        message = gettext(
                            'Showing {currentItemRange} out of {totalItemsCount}, filtered by {assetType},' +
                            ' sorted by {sortName} descending');
                    }
                    asset_type = this.filterNameLabel();
                } else {
                    if (this.view.collection.sortDirection === 'asc') {
                        // Translators: sample result:
                        // "Showing 0-9 out of 25 total, sorted by Date Added ascending"
                        message = gettext(
                            'Showing {currentItemRange} out of {totalItemsCount}, sorted by {sortName} ascending'
                        );
                    } else {
                        // Translators: sample result:
                        // "Showing 0-9 out of 25 total, sorted by Date Added descending"
                        message = gettext(
                            'Showing {currentItemRange} out of {totalItemsCount}, sorted by {sortName} descending'
                        );
                    }
                }

                return '<p>' + HtmlUtils.interpolateHtml(message, {
                        currentItemRange: this.currentItemRangeLabel(),
                        totalItemsCount: this.totalItemsCountLabel(),
                        assetType: asset_type,
                        sortName: this.sortNameLabel()
                    }) + '</p>';
            },

            currentItemRangeLabel: function() {
                var view = this.view,
                    collection = view.collection,
                    start = (collection.getPageNumber() - 1) * collection.getPageSize(),
                    count = collection.size(),
                    end = start + count;
                return HtmlUtils.interpolateHtml(
                    HtmlUtils.HTML('<span class="count-current-shown">{start}-{end}</span>'), {
                        start: Math.min(start + 1, end),
                        end: end
                    });
            },

            totalItemsCountLabel: function() {
                var totalItemsLabel;
                // Translators: turns into "25 total" to be used in other sentences, e.g. "Showing 0-9 out of 25 total".
                totalItemsLabel = HtmlUtils.interpolateHtml(gettext('{totalItems} total'), {
                    totalItems: this.view.collection.getTotalRecords()
                }, true);

                return HtmlUtils.interpolateHtml(
                    HtmlUtils.HTML('<span class="count-total">{totalItemsLabel}</span>'), {
                        totalItemsLabel: totalItemsLabel
                    }
                );
            },

            sortNameLabel: function() {
                return HtmlUtils.interpolateHtml(
                    HtmlUtils.HTML('<span class="sort-order">{sortName}</span>'), {
                        sortName: this.view.sortDisplayName()
                    }
                );
            },

            filterNameLabel: function() {
                return HtmlUtils.interpolateHtml(
                    HtmlUtils.HTML('<span class="filter-column">{filterName}</span>'), {
                        filterName: this.view.filterDisplayName()
                    }
                );
            },

            nextPage: function() {
                this.view.nextPage();
            },

            previousPage: function() {
                this.view.previousPage();
            }
        });

        return PagingHeader;
    }); // end define();
