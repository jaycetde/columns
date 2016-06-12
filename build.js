System.registerDynamic("npm:core-js@1.2.6/library/modules/$.js", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var $Object = Object;
  module.exports = {
    create: $Object.create,
    getProto: $Object.getPrototypeOf,
    isEnum: {}.propertyIsEnumerable,
    getDesc: $Object.getOwnPropertyDescriptor,
    setDesc: $Object.defineProperty,
    setDescs: $Object.defineProperties,
    getKeys: $Object.keys,
    getNames: $Object.getOwnPropertyNames,
    getSymbols: $Object.getOwnPropertySymbols,
    each: [].forEach
  };
  return module.exports;
});

System.registerDynamic("npm:core-js@1.2.6/library/fn/object/define-property.js", ["npm:core-js@1.2.6/library/modules/$.js"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var $ = $__require('npm:core-js@1.2.6/library/modules/$.js');
  module.exports = function defineProperty(it, key, desc) {
    return $.setDesc(it, key, desc);
  };
  return module.exports;
});

System.registerDynamic("npm:babel-runtime@5.8.38/core-js/object/define-property.js", ["npm:core-js@1.2.6/library/fn/object/define-property.js"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = {
    "default": $__require('npm:core-js@1.2.6/library/fn/object/define-property.js'),
    __esModule: true
  };
  return module.exports;
});

System.registerDynamic("npm:babel-runtime@5.8.38/helpers/create-class.js", ["npm:babel-runtime@5.8.38/core-js/object/define-property.js"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var _Object$defineProperty = $__require('npm:babel-runtime@5.8.38/core-js/object/define-property.js')["default"];
  exports["default"] = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        _Object$defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  exports.__esModule = true;
  return module.exports;
});

System.registerDynamic("npm:babel-runtime@5.8.38/helpers/class-call-check.js", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  exports["default"] = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  exports.__esModule = true;
  return module.exports;
});

System.register("style.css!github:systemjs/plugin-css@0.1.22.js", [], function() { return { setters: [], execute: function() {} } });

System.registerDynamic("npm:component-indexof@0.0.3/index.js", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = function(arr, obj) {
    if (arr.indexOf)
      return arr.indexOf(obj);
    for (var i = 0; i < arr.length; ++i) {
      if (arr[i] === obj)
        return i;
    }
    return -1;
  };
  return module.exports;
});

System.registerDynamic("npm:component-indexof@0.0.3.js", ["npm:component-indexof@0.0.3/index.js"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = $__require('npm:component-indexof@0.0.3/index.js');
  return module.exports;
});

System.registerDynamic("npm:component-classes@1.2.6/index.js", ["npm:component-indexof@0.0.3.js"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  try {
    var index = $__require('npm:component-indexof@0.0.3.js');
  } catch (err) {
    var index = $__require('npm:component-indexof@0.0.3.js');
  }
  var re = /\s+/;
  var toString = Object.prototype.toString;
  module.exports = function(el) {
    return new ClassList(el);
  };
  function ClassList(el) {
    if (!el || !el.nodeType) {
      throw new Error('A DOM element reference is required');
    }
    this.el = el;
    this.list = el.classList;
  }
  ClassList.prototype.add = function(name) {
    if (this.list) {
      this.list.add(name);
      return this;
    }
    var arr = this.array();
    var i = index(arr, name);
    if (!~i)
      arr.push(name);
    this.el.className = arr.join(' ');
    return this;
  };
  ClassList.prototype.remove = function(name) {
    if ('[object RegExp]' == toString.call(name)) {
      return this.removeMatching(name);
    }
    if (this.list) {
      this.list.remove(name);
      return this;
    }
    var arr = this.array();
    var i = index(arr, name);
    if (~i)
      arr.splice(i, 1);
    this.el.className = arr.join(' ');
    return this;
  };
  ClassList.prototype.removeMatching = function(re) {
    var arr = this.array();
    for (var i = 0; i < arr.length; i++) {
      if (re.test(arr[i])) {
        this.remove(arr[i]);
      }
    }
    return this;
  };
  ClassList.prototype.toggle = function(name, force) {
    if (this.list) {
      if ("undefined" !== typeof force) {
        if (force !== this.list.toggle(name, force)) {
          this.list.toggle(name);
        }
      } else {
        this.list.toggle(name);
      }
      return this;
    }
    if ("undefined" !== typeof force) {
      if (!force) {
        this.remove(name);
      } else {
        this.add(name);
      }
    } else {
      if (this.has(name)) {
        this.remove(name);
      } else {
        this.add(name);
      }
    }
    return this;
  };
  ClassList.prototype.array = function() {
    var className = this.el.getAttribute('class') || '';
    var str = className.replace(/^\s+|\s+$/g, '');
    var arr = str.split(re);
    if ('' === arr[0])
      arr.shift();
    return arr;
  };
  ClassList.prototype.has = ClassList.prototype.contains = function(name) {
    return this.list ? this.list.contains(name) : !!~index(this.array(), name);
  };
  return module.exports;
});

System.registerDynamic("npm:component-classes@1.2.6.js", ["npm:component-classes@1.2.6/index.js"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = $__require('npm:component-classes@1.2.6/index.js');
  return module.exports;
});

System.registerDynamic("npm:component-event@0.1.4/index.js", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
      unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
      prefix = bind !== 'addEventListener' ? 'on' : '';
  exports.bind = function(el, type, fn, capture) {
    el[bind](prefix + type, fn, capture || false);
    return fn;
  };
  exports.unbind = function(el, type, fn, capture) {
    el[unbind](prefix + type, fn, capture || false);
    return fn;
  };
  return module.exports;
});

System.registerDynamic("npm:component-event@0.1.4.js", ["npm:component-event@0.1.4/index.js"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = $__require('npm:component-event@0.1.4/index.js');
  return module.exports;
});

System.registerDynamic("npm:empty-element@1.0.0/index.js", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = function emptyElement(element) {
    if (!(element instanceof HTMLElement)) {
      throw new TypeError('Expected an element');
    }
    var node;
    while ((node = element.lastChild))
      element.removeChild(node);
    return element;
  };
  return module.exports;
});

System.registerDynamic("npm:empty-element@1.0.0.js", ["npm:empty-element@1.0.0/index.js"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = $__require('npm:empty-element@1.0.0/index.js');
  return module.exports;
});

System.register('index.js', ['npm:babel-runtime@5.8.38/helpers/create-class.js', 'npm:babel-runtime@5.8.38/helpers/class-call-check.js', 'style.css!github:systemjs/plugin-css@0.1.22.js', 'npm:component-classes@1.2.6.js', 'npm:component-event@0.1.4.js', 'npm:empty-element@1.0.0.js'], function (_export) {
  var _createClass, _classCallCheck, classes, events, empty, CONTAINER_CLASS, COLUMN_CLASS, SCROLLER_CLASS, LEFT_CLASS, RIGHT_CLASS, PAGE_INDICATOR_CLASS, PAGE_INDICATOR_BULLET_CLASS, PAGE_INDICATOR_BULLET_ACTIVE_CLASS, SPACER_WIDTH, Columns, Column;

  function loop(arr, fn, ctx) {
    var i = 0,
        l = arr.length;

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

  return {
    setters: [function (_npmBabelRuntime5838HelpersCreateClassJs) {
      _createClass = _npmBabelRuntime5838HelpersCreateClassJs['default'];
    }, function (_npmBabelRuntime5838HelpersClassCallCheckJs) {
      _classCallCheck = _npmBabelRuntime5838HelpersClassCallCheckJs['default'];
    }, function (_styleCssGithubSystemjsPluginCss0122Js) {}, function (_npmComponentClasses126Js) {
      classes = _npmComponentClasses126Js['default'];
    }, function (_npmComponentEvent014Js) {
      events = _npmComponentEvent014Js['default'];
    }, function (_npmEmptyElement100Js) {
      empty = _npmEmptyElement100Js['default'];
    }],
    execute: function () {
      'use strict';

      CONTAINER_CLASS = 'columns-container';
      COLUMN_CLASS = 'columns-column';
      SCROLLER_CLASS = 'columns-scroller';
      LEFT_CLASS = 'columns-left-overlay';
      RIGHT_CLASS = 'columns-right-overlay';
      PAGE_INDICATOR_CLASS = 'columns-page-indicator';
      PAGE_INDICATOR_BULLET_CLASS = 'columns-page-indicator-bullet';
      PAGE_INDICATOR_BULLET_ACTIVE_CLASS = 'columns-page-indicator-active';
      SPACER_WIDTH = 10;

      Columns = (function () {
        function Columns(el) {
          _classCallCheck(this, Columns);

          if (!(this instanceof Columns)) {
            return new Columns(el);
          }

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

          var self = this;

          events.bind(this.leftPageOverlay, 'click', function () {
            self.showPage(self.page - 1);
          });

          events.bind(this.rightPageOverlay, 'click', function () {
            self.showPage(self.page + 1);
          });

          events.bind(window, 'resize', this.resize.bind(this));
        }

        _createClass(Columns, [{
          key: 'reflow',
          value: function reflow() {
            this.setupPages();
            this.adjustWidths();
            this.showPage(this.page);
          }
        }, {
          key: 'setupIndicator',
          value: function setupIndicator() {

            empty(this.pageIndicatorContainer);

            if (this.pages.length <= 1) return;

            loop(this.pages, function (page) {

              var bullet = document.createElement('div');
              bullet.className = PAGE_INDICATOR_BULLET_CLASS;

              this.pageIndicatorContainer.appendChild(bullet);
            }, this);

            this.setIndicator(this.page);
          }
        }, {
          key: 'setIndicator',
          value: function setIndicator(page) {

            var self = this,
                current = self.pageIndicatorContainer.querySelector('.' + PAGE_INDICATOR_BULLET_ACTIVE_CLASS),
                next = self.pageIndicatorContainer.querySelectorAll('.' + PAGE_INDICATOR_BULLET_CLASS)[page];

            self.pageIndicatorClasses.remove('hidden');

            if (current) classes(current).remove(PAGE_INDICATOR_BULLET_ACTIVE_CLASS);

            if (next) classes(next).add(PAGE_INDICATOR_BULLET_ACTIVE_CLASS);

            clearTimeout(self._indicatorTimer);

            self._indicatorTimer = setTimeout(function () {
              self.pageIndicatorClasses.add('hidden');
            }, 3000);
          }
        }, {
          key: 'showPage',
          value: function showPage(page) {

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
        }, {
          key: 'resize',
          value: function resize() {
            clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout(this.reflow.bind(this), 200);
          }
        }, {
          key: 'setupPercentages',
          value: function setupPercentages() {

            var totalWidth = add(this.columns, 'width');

            loop(this.columns, function (col) {
              col.percent = col.width / totalWidth;
            });
          }
        }, {
          key: 'setupPages',
          value: function setupPages() {

            this.pages = [];

            var containerWidth = this.el.offsetWidth,
                cols = this.columns,
                col = 0,
                l = cols.length,
                span,
                page;

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
        }, {
          key: 'adjustPages',
          value: function adjustPages() {

            var pages = this.pages,
                columns = this.columns;

            loop(pages, function (page, i) {
              if (page.span === 1 && pages[i - 1]) {
                if (columns[page.start + page.span - 1].width <= columns[pages[i - 1].start].width) {
                  page.start = pages[i - 1].start + 1;
                  page.span = pages[i - 1].span;
                }
              }
            });
          }
        }, {
          key: 'adjustWidths',
          value: function adjustWidths() {

            var containerWidth = this.el.offsetWidth,
                pagesLength = this.pages.length;

            if (pagesLength > 1) containerWidth -= SPACER_WIDTH;

            loop(this.pages, function (page, i) {

              var cols = this.columns.slice(page.start, page.start + page.span),
                  totalPercent = add(cols, 'percent'),
                  widthWithSpacer = containerWidth;

              if (i > 0 && i < pagesLength - 1) widthWithSpacer -= SPACER_WIDTH;

              loop(cols, function (col) {
                col.el.style.width = Math.round(col.percent / totalPercent * widthWithSpacer) + 'px'; // fix - Math.round - decimal pixel values causing width problems
              });
            }, this);
          }
        }, {
          key: 'extractColumns',
          value: function extractColumns(el) {
            el = el || this.el;

            var children = el.childNodes,
                cols = [];

            loop(children, function (child) {
              if (child.nodeType === 1) cols.push(child);
            });

            loop(cols, function (col) {
              this.addColumn(col);
            }, this);

            return this;
          }
        }, {
          key: 'addColumn',
          value: function addColumn(el, width) {

            var col = new Column(el, width);

            this.columns.push(col);

            return col;
          }
        }, {
          key: 'initializeColumns',
          value: function initializeColumns(page) {

            var i = page.start,
                l = i + page.span;

            while (i < l) {
              this.columns[i].initialize();
              i += 1;
            }
          }
        }, {
          key: 'initialize',
          value: function initialize() {

            this.el.appendChild(this.pageIndicatorContainer);
            this.el.appendChild(this.leftPageOverlay);
            this.el.appendChild(this.rightPageOverlay);
            this.el.appendChild(this.scroller);

            var i = 0,
                l = this.columns.length;

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
        }]);

        return Columns;
      })();

      _export('default', Columns);

      Column = (function () {
        function Column(el, width) {
          _classCallCheck(this, Column);

          this.el = el;
          this.width = width || el.offsetWidth; // unstyled div will have a width of 100%;
          this._initialized = false;

          this.elClasses = classes(el);

          this.elClasses.add(COLUMN_CLASS);
        }

        _createClass(Column, [{
          key: 'initialize',
          value: function initialize() {
            if (!this._initialized) {
              //this.el.dispatchEvent(new CustomEvent('column-initialize', { bubbles: false }));
              this._initialized = true;
              if (this.onInitialize) this.onInitialize();
            }
          }
        }]);

        return Column;
      })();

      _export('Column', Column);
    }
  };
});
System.register('style.css!github:systemjs/plugin-css@0.1.22.js', [], false, function() {});
(function(c){if (typeof document == 'undefined') return; var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
(".columns-column{display:inline-block;height:100%}.columns-container{position:relative;overflow:hidden}.columns-scroller{position:relative;height:100%;white-space:nowrap;transition:left .3s;-webkit-transition:left .3s;-moz-transition:left .3s;-o-transition:left .3s}.columns-page-indicator{position:absolute;top:10px;left:0;right:0;text-align:center;z-index:1000;pointer-events:none}.columns-page-indicator-bullet{display:inline-block;width:8px;height:8px;border-radius:8px;background:#999;border:1px solid #000;margin:0 5px}.columns-page-indicator-active{background:#FFF}.columns-left-overlay,.columns-right-overlay{position:absolute;top:0;height:100%;width:10px;z-index:1000;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;background:#FFF;opacity:0}.columns-left-overlay{left:0}.columns-right-overlay{right:0}.columns-left-overlay:hover,.columns-right-overlay:hover{opacity:.25}.hidden{display:none}");
//# sourceMappingURL=build.js.map