var classes = require('classes')
  , events = require('event')
  , empty = require('empty')
  , Swipe = require('swipe')

  , CONTAINER_CLASS = 'columns-container'
  , COLUMN_CLASS = 'columns-column'
  , SCROLLER_CLASS = 'columns-scroller'
  , LEFT_CLASS = 'columns-left-overlay'
  , RIGHT_CLASS = 'columns-right-overlay'
  , PAGE_INDICATOR_CLASS = 'columns-page-indicator'
  , PAGE_INDICATOR_BULLET_CLASS = 'columns-page-indicator-bullet'
  , PAGE_INDICATOR_BULLET_ACTIVE_CLASS = 'columns-page-indicator-active'

  , SPACER_WIDTH = 10
;

module.exports = Columns;

function Columns(el) {
    
    if (!(this instanceof Columns)) {
        return new Columns(el);
    }
    
    this.el = el;
    this.columns = [];
    this.page = 0;
    
    this.elClasses = classes(el);
    this.elClasses.add(CONTAINER_CLASS);
    
    this.scroller = document.createElement('div');
    this.scroller.className = SCROLLER_CLASS;
    
    this.extractColumns(this.el);
    
    this.el.appendChild(this.scroller);
    
    this.pageIndicatorContainer = document.createElement('div');
    this.pageIndicatorClasses = classes(this.pageIndicatorContainer);
    this.pageIndicatorClasses.add(PAGE_INDICATOR_CLASS);
    
    this.leftPageOverlay = document.createElement('div');
    this.leftPageClasses = classes(this.leftPageOverlay);
    this.leftPageClasses.add(LEFT_CLASS);
    
    this.rightPageOverlay = document.createElement('div');
    this.rightPageClasses = classes(this.rightPageOverlay);
    this.rightPageClasses.add(RIGHT_CLASS);
    
    var self = this;
    
    events.bind(this.leftPageOverlay, 'click', function () {
        self.showPage(self.page - 1);
    });
    
    events.bind(this.rightPageOverlay, 'click', function () {
        self.showPage(self.page + 1);
    });
    
    this.el.appendChild(this.pageIndicatorContainer);
    this.el.appendChild(this.leftPageOverlay);
    this.el.appendChild(this.rightPageOverlay);
    
    this.setupPercentages();
    this.setupPages();
    this.showPage(0);
    this.adjustWidths();
    
    this._swipe = new Swipe(this.el);
    this._swipe.on('swipeleft', this.incPage.bind(this, 1));
    this._swipe.on('swiperight', this.incPage.bind(this, -1));
    
    this.setSwipeThreshold();
    
    events.bind(window, 'resize', this.resize.bind(this));
    
}

Columns.prototype.incPage = function (inc) {
    this.showPage(this.page + inc);
};

Columns.prototype.setSwipeThreshold = function () {
    this._swipe.threshold(this.el.offsetWidth * .5); // Set threshold to 50% of container width
};

Columns.prototype.setupIndicator = function () {
    
    empty(this.pageIndicatorContainer);
    
    if (this.pages.length <= 1) return;
    
    loop(this.pages, function (page) {
        
        var bullet = document.createElement('div');
        bullet.className = PAGE_INDICATOR_BULLET_CLASS;
        
        this.pageIndicatorContainer.appendChild(bullet);
        
    }, this);
    
    this.setIndicator(this.page);
    
};

Columns.prototype.setIndicator = function (page) {
    
    var self = this
      , current = self.pageIndicatorContainer.querySelector('.' + PAGE_INDICATOR_BULLET_ACTIVE_CLASS)
      , next = self.pageIndicatorContainer.querySelectorAll('.' + PAGE_INDICATOR_BULLET_CLASS)[page]
    ;
    
    self.pageIndicatorClasses.remove('hidden');
    
    if (current) classes(current).remove(PAGE_INDICATOR_BULLET_ACTIVE_CLASS);
    
    if (next) classes(next).add(PAGE_INDICATOR_BULLET_ACTIVE_CLASS);
    
    clearTimeout(self._indicatorTimer);
    
    self._indicatorTimer = setTimeout(function () {
        self.pageIndicatorClasses.add('hidden');
    }, 3000);
    
};

Columns.prototype.showPage = function (page) {
    
    page = page || 0;
    
    if (page < 0) return this.showPage(0);
    if (!this.pages[page]) return this.showPage(page - 1);
    
    this.el.scrollLeft = this.columns[this.pages[page].start].el.offsetLeft - SPACER_WIDTH;
    
    this.leftPageClasses.remove('hidden');
    this.rightPageClasses.remove('hidden');
    
    if (page === 0) this.leftPageClasses.add('hidden');
    if (page >= this.pages.length - 1) this.rightPageClasses.add('hidden'); 
    
    this.page = page;
    
    this.setIndicator(page);
    
};

Columns.prototype.resize = function () {
    var self = this;
    
    clearTimeout(self._resizeTimer);
    
    self._resizeTimer = setTimeout(function () {
        self.setupPages();
        self.adjustWidths();
        self.showPage(self.page);
        self.setSwipeThreshold();
    }, 200);
};

Columns.prototype.setupPercentages = function () {
    
    var totalWidth = add(this.columns, 'width');
    
    loop(this.columns, function (col) {
        col.percent = col.width / totalWidth;
    });
    
};

Columns.prototype.setupPages = function () {
    
    this.pages = [];
    
    var containerWidth = this.el.offsetWidth
      , cols = this.columns
      , col = 0
      , l = cols.length
      , span
      , page
    ;
    
    if (l === 0) return;
    
    while (true) {
        page = {
            start: col
        };
        
        span = 0;
        
        while (true) {
            
            span += 1;
            
            if (add(cols.slice(col, col + span + 1), 'width') > containerWidth) break;
            if (col + span >= l) break;
            
        }
        
        page.span = span;
        this.pages.push(page);
        col += span;
        
        if (col >= l) break;
        
    }
    
    this.adjustPages();
    this.setupIndicator();
    
};

Columns.prototype.adjustPages = function () {
    
    var pages = this.pages
      , columns = this.columns
    ;
    
    loop(pages, function (page, i) {
        if ((page.span === 1) && pages[i - 1]) {
            if (columns[page.start + page.span - 1].width <= columns[pages[i - 1].start].width) {
                page.start = pages[i - 1].start + 1;
                page.span = pages[i - 1].span;
            }
        }
    });
    
};

Columns.prototype.adjustWidths = function () {
    
    var containerWidth = this.el.offsetWidth
      , pagesLength = this.pages.length
    ;
    
    if (pagesLength > 1) containerWidth -= SPACER_WIDTH;
    
    loop(this.pages, function (page, i) {
        
        var cols = this.columns.slice(page.start, page.start + page.span)
          , totalPercent = add(cols, 'percent')
          , widthWithSpacer = containerWidth
        ;
        
        if (i > 0 && i < (pagesLength - 1)) widthWithSpacer -= SPACER_WIDTH;
        
        loop(cols, function (col) {
            col.el.style.width = ((col.percent / totalPercent) * widthWithSpacer) + 'px';
        });
        
    }, this);
    
};

Columns.prototype.extractColumns = function (el) {
    var children = el.childNodes
      , cols = []
    ;
    
    loop(children, function (child) {
        if (child.nodeType === 1) cols.push(child);
    });
    
    loop(cols, function (col) {
        this.addColumn(col);
    }, this);
};

Columns.prototype.addColumn = function (el, width) {
    
    var col = new Column(el, width);
    
    this.scroller.appendChild(col.el);
    
    this.columns.push(col);
    
    return col;
    
};

function Column(el, width) {
    
    this.el = el;
    this.width = width || el.offsetWidth; // unstyled div will have a width of 100%;
    
    this.elClasses = classes(el);
    
    this.elClasses.add(COLUMN_CLASS);
    
}

function loop (arr, fn, ctx) {
    var i = 0
      , l = arr.length
    ;
    
    while (i < l) {
        fn.call(ctx, arr[i], i);
        i += 1;
    }
}

function add(arr, prop) {
    var t = 0;
    loop(arr, function (item) {
        t += item[prop];
    });
    return t;
}