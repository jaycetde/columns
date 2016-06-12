import './style.css!';

import classes from 'component-classes';
import events from 'component-event';
import empty from 'empty-element';

const CONTAINER_CLASS = 'columns-container',
      COLUMN_CLASS = 'columns-column',
      SCROLLER_CLASS = 'columns-scroller',
      LEFT_CLASS = 'columns-left-overlay',
      RIGHT_CLASS = 'columns-right-overlay',
      PAGE_INDICATOR_CLASS = 'columns-page-indicator',
      PAGE_INDICATOR_BULLET_CLASS = 'columns-page-indicator-bullet',
      PAGE_INDICATOR_BULLET_ACTIVE_CLASS = 'columns-page-indicator-active',
      
      SPACER_WIDTH = 10
;

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

export default class Columns {
  
  constructor(el) {
    
    this.el = el;
    this.columns = [];
    this.page = 0;
    
    this.elClasses = classes(el).add(CONTAINER_CLASS);
    
    this.scroller = document.createElement('div');
    this.scroller.className = SCROLLER_CLASS;
    
    this.pageIndicatorContainer = document.createElement('div');
    this.pageIndicatorClasses = classes(this.pageIndicatorContainer).add(PAGE_INDICATOR_CLASS);
    
    this.leftPageOverlay = document.createElement('div');
    this.leftPageClasses = classes(this.leftPageOverlay).add(LEFT_CLASS);
    
    this.rightPageOverlay = document.createElement('div');
    this.rightPageClasses = classes(this.rightPageOverlay).add(RIGHT_CLASS);
    
    const self = this;
    
    events.bind(this.leftPageOverlay, 'click', function () {
      self.showPage(self.page - 1);
    });
    
    events.bind(this.rightPageOverlay, 'click', function () {
      self.showPage(self.page + 1);
    });
    
    events.bind(window, 'resize', this.resize.bind(this));
  }
  
  reflow() {
    if (!this.isFullscreen) {
      this.setupPages();
      this.adjustWidths();
      this.showPage(this.page);
    } else {
      this.fullscreen(this._fullscreenIndex);
    }
  }
  
  setupIndicator() {
    
    empty(this.pageIndicatorContainer);
    
    if (this.pages.length <= 1) return;
    
    loop(this.pages, function (page) {
      
      var bullet = document.createElement('div');
      bullet.className = PAGE_INDICATOR_BULLET_CLASS;
      
      this.pageIndicatorContainer.appendChild(bullet);
      
    }, this);
    
    this.setIndicator(this.page);
  }
  
  setIndicator(page) {
    
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
    
  }
  
  fullscreen(columnIndex) {
    const column = this.columns[columnIndex];
    
    if (!column) return;
    
    column.el.style.width = this.el.offsetWidth + 'px';
    this.scroller.style.left = -column.el.offsetLeft + 'px';
    this.isFullscreen = true;
    this._fullscreenIndex = columnIndex;
  }
  
  exitFullscreen() {
    this.isFullscreen = false;
    this.reflow();
  }
  
  showPage(page) {
      
    page = page || 0;
    
    if (page < 0) return this.showPage(0);
    if (!this.pages[page]) return this.showPage(page - 1);
    
    this.scroller.style.left = -(this.columns[this.pages[page].start].el.offsetLeft - (page === 0 ? 0 : SPACER_WIDTH)) + 'px';
    
    this.leftPageClasses.remove('hidden');
    this.rightPageClasses.remove('hidden');
    
    if (page === 0) this.leftPageClasses.add('hidden');
    if (page >= this.pages.length - 1) this.rightPageClasses.add('hidden'); 
    
    this.page = page;
    
    this.setIndicator(page);
    this.initializeColumns(this.pages[page]);
  }
  
  resize() {
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(this.reflow.bind(this), 200);
  }
  
  setupPercentages() {
    
    var totalWidth = add(this.columns, 'width');
    
    loop(this.columns, function (col) {
        col.percent = col.width / totalWidth;
    });
    
  }
  
  setupPages() {
    
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
    
  }
  
  adjustPages() {
    
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
    
  }
  
  adjustWidths() {
    
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
            col.el.style.width = Math.round((col.percent / totalPercent) * widthWithSpacer) + 'px'; // fix - Math.round - decimal pixel values causing width problems
        });
        
    }, this);
    
  }
  
  extractColumns(el) {
    el = el || this.el;
    
    var children = el.childNodes
      , cols = []
    ;
    
    loop(children, function (child) {
        if (child.nodeType === 1) cols.push(child);
    });
    
    loop(cols, function (col) {
        this.addColumn(col);
    }, this);
    
    return this;
  }
  
  addColumn(el, width) {
    
    var col = new Column(el, width);
    
    this.columns.push(col);
    
    return col;
    
  }
  
  initializeColumns(page) {
    
    var i = page.start
      , l = i + page.span
    ;
    
    while (i < l) {
        this.columns[i].initialize();
        i += 1;
    }
    
  }
  
  initialize() {
    
    this.el.appendChild(this.pageIndicatorContainer);
    this.el.appendChild(this.leftPageOverlay);
    this.el.appendChild(this.rightPageOverlay);
    this.el.appendChild(this.scroller);
    
    var i = 0, l = this.columns.length;
    
    while (i < l) {
        this.scroller.appendChild(this.columns[i].el);
        i += 1;
    }
    
    this.setupPercentages();
    this.setupPages();
    this.showPage(0);
    this.adjustWidths();
    
    return this;
    
  }
  
}

export class Column {
  constructor(el, width) {
    
    this.el = el;
    this.width = width || el.offsetWidth; // unstyled div will have a width of 100%;
    this._initialized = false;
    
    this.elClasses = classes(el);
    
    this.elClasses.add(COLUMN_CLASS);
    
  }
  
  initialize() {
    if (!this._initialized) {
        //this.el.dispatchEvent(new CustomEvent('column-initialize', { bubbles: false }));
        this._initialized = true;
        if (this.onInitialize) this.onInitialize();
    }
  }
}