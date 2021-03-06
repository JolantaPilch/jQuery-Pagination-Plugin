/**
 * jQuery Pagination Plugin according to lightweight pattern 
 */
$(function(){
    'use strict'
    console.log('jQuery Pagination Plugin');
    // Begining of jQuery lightweit pattern
    (function ($) {
        var pluginName = 'pagination';
        var defaults = {
            propertyName: 'value',
            rowsPerPage: 5,
            elementToSelect: 'tr'
        };
        /**
         * Plugin Constructor function 
         * @constructor
         * @param {nodeElement} element Inside this element the pagination result is placed
         * @param {object} options Additional parameteres for pagination including number of rows per page and nodeElement type for internal selector: {rowsPerPage: number, elementToSelect: nodeElement};
         */
        function Plugin (element, options) {
            /**@property {object} this.options Merges defaults with options */
            this.options = $.extend({},defaults, options);
            /** @property {object} this._defaults Contains defaults */
            this._defaults = defaults;
            /** @property {string} this._name Contains plugin name  */
            this._name = pluginName;
            /** @property {nodeElement} this.element Contains an element for the pagination result*/
            this.element = element;
            /** @property {array} this.elementList Contains list of nodeElements specified in options which will be sliced into pagination */
            this.elementList = $(element).find(options.elementToSelect);
            /** @property {array} this.pagesArray An array of subarrays coressponding to pagination pages */
            this.pagesArray = [];

            /**
            * Running default constructor methods  
            */
            this.init1();
        };
        /**
        * Displays rows according to their number per page specified by user in option parametres 
        * @public
        */
        Plugin.prototype.init1 = function () {
            var $parentElement = $(this.elementList[0]).parent()
            // 1. Adds container for pagination buttons
            var $divPaginButton = $('<div/>', {class: 'divPaginButton'});
            $parentElement.parent().append($divPaginButton);
            // 2.  Pushes all the nodeElement from the list into an array
            /**
            * An array for all nodeElements for further slicing into pages
            * @type {array} */
            var elementListArray = [];
            this.elementList.each(function(index ,element) {
                elementListArray.push(element);
            });
            this.elementListArray = elementListArray;
            // 3. Slices array into subarrays according to number of pages
            this.arrayIntoSlices(elementListArray, $divPaginButton);
            // 4. Adds event listeners on the pagination buttons
            var $pagesButtons = $divPaginButton.find('.buttonPage');
            $pagesButtons.on('click', this.onClickShowChosenPageHandler.bind(this));
            // 5. Adds buttons Next and Previous and corresponding event listeners
            this.addButtonsNextAndPrevious($divPaginButton, $pagesButtons);
            // 6. Displays first page at a start
            this.firstPageDisplay();
        };

        /**
         * Cuts an array with all nodeElements into subarray slices according to the number per page specified by user
         * @param {array} allElementsArray An array containing all rows for further slicing into pages
         * @param {nodeElement} divForButtons Div element for storing pagination buttons
         * @public
         */
        Plugin.prototype.arrayIntoSlices = function (allElementsArray, divForButtons) {
            var rowsPerPage = this.options.rowsPerPage;
            if (rowsPerPage > 0) {
                var pagesNumberInteger = 0;
                var pagesNumberRational = allElementsArray.length / rowsPerPage;
                var pagesNumberRest = allElementsArray.length%rowsPerPage;
                var start = 0;
                var end = rowsPerPage;
                if (allElementsArray.length < rowsPerPage){
                    pagesNumberInteger = 1;
                    for (var it = 0; it < pagesNumberInteger; it++) {
                        var pageTableSlice = allElementsArray.slice(start, end);
                        this.pagesArray.push(pageTableSlice);
                        this.addPageButton(divForButtons, it);
                    };
                } else if (pagesNumberRest === 0) {
                    pagesNumberInteger = pagesNumberRational;
                    for (var it = 0; it < pagesNumberInteger; it++) {
                        var pageTableSlice = allElementsArray.slice(start, end);
                        start += rowsPerPage;
                        end += rowsPerPage;
                        this.pagesArray.push(pageTableSlice);
                        this.addPageButton(divForButtons, it);
                    };
                } else if (pagesNumberRest !== 0) {
                    pagesNumberInteger = Math.ceil(pagesNumberRational);
                    for (var it = 0; it < pagesNumberInteger; it++) {
                        var pageTableSlice = allElementsArray.slice(start, end);
                        start += rowsPerPage;
                        end += rowsPerPage;
                        this.pagesArray.push(pageTableSlice);
                        this.addPageButton(divForButtons, it);
                    }
                } 
            } else if (rowsPerPage <= 0){
                throw 'Wartosci rowne i mniejsze od zera oznaczaja brak paginacji'
            };
        };
        /**
         * Adds buttons corresponding to number of pages from pagination function
         * @param {nodeElement} divForButtons2 Div element for storing pagination buttons from method this.arrayIntoSlices
         * @param {number} it2 Index of table slice (page) in the array this.pagesArray, when adds 1 then it is a button page button number
         * @private
         */
        Plugin.prototype.addPageButton = function (divForButtons2, it2) {
            var $button = $('<button/>', {class:'buttonPage'} );
            $button.text(it2 + 1);
            divForButtons2.append($button);
        };
        /**
         * Display rows corresponding to the page button which was clicked
         * @param {object} event 
         * @callback
         * @private
         */
        Plugin.prototype.onClickShowChosenPageHandler = function (event) {
            this.paginationInitialConditions();
            var pageNo = parseInt(event.target.innerText,10);
            var currentPageNumber = pageNo;
            var $currentPagesArray = $(this.pagesArray[pageNo - 1]);
            $currentPagesArray.each(function (index,element) {
                $(element).css('display', '');
            });
            this.chosenButtonHighlight(event.target);
        };

        /**
        * Sets initial conditions for pagination: all rows are hidden 
        * @private
        */
        Plugin.prototype.paginationInitialConditions = function () {
            var $pagesArray = $(this.pagesArray);
            $pagesArray.each(function (index, element) {
                var $element = $(element);
                for (var it = 0; it < $element.length; it++) {
                    $($element[it]).css('display','none');
                }
            });
        };

        /**
         * Highlights a page button which was clicked to show corresponding nodeElements
         * @param {nodeElement} button 
         * @private
         */
        Plugin.prototype.chosenButtonHighlight = function (button) {
            // Initial conditions button
            var $pagesButtons = $(this.element).find('.buttonPage');
            for (var it = 0; it < $pagesButtons.length; it++){
                $($pagesButtons[it]).removeAttr('style')
            };
            // Wybrany button
            var css2 = {
                backgroundColor: 'white',
                border: '3px solid black',
                fontWeight: 'bold'
            };
            $(button).css(css2); 
        };

        /**
         * Adds pagination buttons Next and Previous 
         * @param {nodeElement} divPaginButton2 Div element for storing pagination buttons defined in method this.pagination
         * @param {nodeList} pagesButtons2 All buttons having class .buttonPage
         * @private
         */
        Plugin.prototype.addButtonsNextAndPrevious = function (divPaginButton2, pagesButtons2) {
            var $buttonNext = $('<button/>');
            $buttonNext.text('Next');
            $buttonNext.insertBefore(pagesButtons2[0]);
            $buttonNext.on('click', this.onClickShowNextPageHandler.bind(this));
            var $buttonPrevious = $('<button/>');
            $buttonPrevious.text('Previous');
            $buttonPrevious.insertAfter(pagesButtons2[pagesButtons2.length-1]);
            $buttonPrevious.on('click', this.onClickShowPreviousPageHandler.bind(this));
        };

        /**
         * Displays the next page rows in relation the currently chosen ones
         * @param {object} event 
         * @callback
         * @private
         */
        Plugin.prototype.onClickShowNextPageHandler = function (event) {
            /**
             * Represents a button which coressponding rows are currently displayed
             * It is selected thanks to the style attribute related to highliting 
             * @type {nodeElement} */
            var $currentPageButton = $(this.element).find('button[style]');
            var $nextPageButton = $currentPageButton.next();
            this.paginationInitialConditions(); 
            var text = $currentPageButton.text();  
            var pageNo = parseInt(text,10);
            var currentPageNumber = pageNo +1;
            // Pamietaj, pageNo ma nr wiekszy niz indeks w pagesArray!
            if (pageNo === this.pagesArray.length) {
                $(this.pagesArray[pageNo-1]).each(function (index, element) {
                    $(element).css('display', '');
                }); 
                this.chosenButtonHighlight($currentPageButton);
            } else {
                $(this.pagesArray[pageNo]).each(function (index, element) {
                    $(element).css('display', '');
                });
                this.chosenButtonHighlight($nextPageButton);
            };
        };

        /**
         * Displays the previous page rows in relation the currently chosen ones
         * @param {object} event 
         * @callback
         * @private
         */
        Plugin.prototype.onClickShowPreviousPageHandler = function (event) {
             /**
             * Represents a button which coressponding rows are currently displayed
             * It is selected thanks to the style attribute related to highliting 
             * @type {nodeElement} */
            var $currentPageButton = $(this.element).find('button[style]');
            var $previousPageButton = $currentPageButton.prev();
            this.paginationInitialConditions();   
            var text = $currentPageButton.text();
            var pageNo = parseInt(text,10);
            var currentPageNumber = pageNo -1;
            // Pamietaj, pageNo ma nr wiekszy niz indeks w pagesArray!
            if (pageNo === 1) {
                $(this.pagesArray[0]).each(function (index, element) {
                    $(element).css('display', '');
                }); 
                this.chosenButtonHighlight($currentPageButton);
            } else {
                $(this.pagesArray[pageNo-2]).each(function (index, element) {
                    $(element).css('display', '');
                });
                this.chosenButtonHighlight($previousPageButton);
            };
        };
        /**
         * Displays the first page at a start
         * @private
         */
        Plugin.prototype.firstPageDisplay = function () {
            this.paginationInitialConditions(this.pagesArray);
            var $firstPagesArray = $(this.pagesArray[0]);
            $firstPagesArray.each(function (index, element) {
                $(element).css('display', '');
            });
            var $firstPagesButton = $($(this.element).find('.buttonPage')[0]);
            var css = {
                backgroundColor: 'white',
                border: '3px solid black',
                fontWeight: 'bold'
            };
            $firstPagesButton.css(css);
       };

        /**
         * Plugin wrapper around the constructor
         */
        $.fn[pluginName] = function(data, options) {
            return this.each(function() {
                if (!$.data(this, "plugin_" + pluginName)){
                    $.data(this, "plugin_" + pluginName, new Plugin(this, options));
                }
            });
        }
    })(jQuery);
    // Begining of jQuery lightweit pattern
    
    var options1 = {
        rowsPerPage: 2,
        elementToSelect: 'tr'
    };
    
    var $element = $('table');
    $element.pagination($element, options1);
    console.log('bye');

});
