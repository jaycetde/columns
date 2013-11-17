var classes = require('classes')
  , events = require('event')

  , CONTAINER_CLASS = 'columns-container'
  , COLUMN_CLASS = 'columns-column'
  , SCROLLER_CLASS = 'columns-scroller'
  , LEFT_CLASS = 'columns-left-overlay'
  , RIGHT_CLASS = 'columns-right-overlay'

  , SPACER_WIDTH = 10
;

module.exports = Columns;

function Columns(el) {
    
    this.el = el;
    this.columns = [];
    this.page = 0;
    
    this.elClasses = classes(el);
    this.elClasses.add(CONTAINER_CLASS);
    
    this.scroller = document.createElement('div');
    this.scroller.className = SCROLLER_CLASS;
    
    this.extractColumns(this.el);
    
    this.el.appendChild(this.scroller);
    
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
    
    this.el.appendChild(this.leftPageOverlay);
    this.el.appendChild(this.rightPageOverlay);
    
    this.setupPercentages();
    this.setupPages();
    this.adjustWidths();
    
    events.bind(window, 'resize', this.resize.bind(this));
    
}

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
    
};

Columns.prototype.resize = function () {
    var self = this;
    
    clearTimeout(self._resizeTimer);
    
    self._resizeTimer = setTimeout(function () {
        self.setupPages();
        self.adjustWidths();
        self.showPage(self.page);
    }, 200);
};

Columns.prototype.setupPercentages = function () {
    
    var cols = this.columns
      , i = 0
      , l = cols.length
      , totalWidth = add(cols, 'width')
    ;
    
    while (i < l) {
        cols[i].percent = cols[i].width / totalWidth;
        i += 1;
    }
    
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
    
};

Columns.prototype.adjustPages = function () {
    
    var i = 0
      , l = this.pages.length
    ;
    
    while (i < l) {
        
        if ((this.pages[i].span === 1) && this.pages[i - 1]) {
            if (this.columns[this.pages[i].start + this.pages[i].span - 1].width <= this.columns[this.pages[i - 1].start].width) {
                this.pages[i].start = this.pages[i - 1].start + 1;
                this.pages[i].span = this.pages[i - 1].span;
            }
        }
        
        i += 1;
    }
    
};

Columns.prototype.adjustWidths = function () {
    
    var containerWidth = this.el.offsetWidth
      , widthWithSpacer
      , pages = this.pages
      , cols = this.columns
      , i = 0
      , l = pages.length
      , j
      , m
      , totalPercent
    ;
    
    while (i < l) {
        
        j = pages[i].start;
        m = pages[i].start + pages[i].span;
        
        totalPercent = add(cols.slice(j, m), 'percent');
        
        widthWithSpacer = containerWidth;
        if (l > 1) widthWithSpacer -= SPACER_WIDTH;
        if (i > 0 && i < l - 1) widthWithSpacer -= SPACER_WIDTH;
        
        while (j < m) {
            
            cols[j].el.style.width = ((cols[j].percent / totalPercent) * widthWithSpacer) + 'px';
            
            j += 1;
            
        }
        
        i += 1;
    }
    
};

Columns.prototype.extractColumns = function (el) {
    var children = el.childNodes
      , cols = []
      , i = 0
      , l = children.length
    ;
    
    while (i < l) {
        if (children[i].nodeType === 1) {
            cols.push(children[i]);
        }
        i += 1;
    }
    
    i = 0;
    l = cols.length;
    
    while (i < l) {
        this.addColumn(cols[i]);
        i += 1;
    }
    
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

function add(arr, prop) {
    var i = 0
      , l = arr.length
      , t = 0
    ;
    while (i < l) {
        t += arr[i][prop]
        i += 1;
    }
    return t;
}