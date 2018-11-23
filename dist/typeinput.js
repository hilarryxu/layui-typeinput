// Generated by CoffeeScript 1.12.7
(function() {
  layui.define(['jquery', 'table', 'form', 'layer'], function(exports) {
    var $, CLS_NAME, MOD_NAME, Plugin, _M, defaultSettings, form, layer, table;
    $ = layui.jquery;
    table = layui.table, form = layui.form, layer = layui.layer;
    MOD_NAME = 'typeinput';
    CLS_NAME = 'n-typeinput';
    defaultSettings = {
      trigger: 'focus',
      autoFocus: true,
      searchKey: 'keyword',
      searchPlaceholder: '关键词搜索'
    };
    Plugin = function(options) {
      this.settings = $.extend({}, defaultSettings, options || {});
      this.oelem = $(this.settings.elem);
      this.tipIndex = null;
      this.tableInstance = null;
    };
    Plugin.prototype.render = function() {
      var base, base1, emitSelect, hide, html, opt, plugin, tableDone, tableFilter, tableID, tableName;
      plugin = this;
      opt = plugin.settings;
      tableName = 'typeinput_tbl_' + new Date().getTime();
      tableID = 'TBL_' + tableName;
      tableFilter = tableName;
      tableDone = opt.table.done || function() {};
      (base = opt.table).page || (base.page = true);
      (base1 = opt.table).height || (base1.height = 315);
      html = "<div class=\"" + CLS_NAME + "\">\n  <div class=\"p-toolbar\">\n    <div class=\"layui-form\">\n      <input type=\"text\" class=\"layui-input p-input\"\n        name=\"" + opt.searchKey + "\"\n        placeholder=\"" + opt.searchPlaceholder + "\"\n        autocomplete=\"off\"><button class=\"layui-btn layui-btn-sm layui-btn-primary p-btn-search\"\n          lay-submit lay-filter=\"n-typeinput-btn-search\"><i class=\"layui-icon layui-icon-search\"></i></button>\n    </div>\n  </div>\n  <table id=\"" + tableID + "\" lay-filter=\"" + tableFilter + "\"></table>\n</div>";
      hide = function() {
        layer.close(plugin.tipIndex);
        plugin.tipIndex = null;
        delete table.cache[tableID];
      };
      emitSelect = function(checkStatus) {
        var rv;
        rv = opt.done(plugin.oelem, checkStatus);
        if (rv !== false) {
          hide();
        }
      };
      plugin.oelem.on(opt.trigger, function(e) {
        layui.stope(e);
        if (plugin.tipIndex != null) {
          return false;
        }
        plugin.tipIndex = layer.tips(html, opt.elem, {
          tips: 3,
          time: 0,
          skin: 'layer-' + CLS_NAME,
          tipsMore: true,
          success: function(layero, index) {
            plugin.tipBodyElem = layero.find('.layui-layer-content');
            if (opt.autoFocus) {
              return (layero.find('.p-input')).focus();
            }
          }
        });
        opt.table.elem = '#' + tableID;
        opt.table.done = function(res, curr, count) {
          return tableDone(res, curr, count);
        };
        plugin.tableInstance = table.render(opt.table);
        form.on('submit(n-typeinput-btn-search)', function(data) {
          plugin.tableInstance.reload({
            where: data.field,
            page: {
              curr: 1
            }
          });
          return false;
        });
        table.on("radio(" + tableFilter + ")", function(obj) {
          return emitSelect(table.checkStatus(tableID));
        });
        table.on("rowDouble(" + tableFilter + ")", function(obj) {
          var checkStatus;
          checkStatus = {
            data: [obj.data]
          };
          return emitSelect(checkStatus);
        });
        return ($(document)).on('click', function(e) {
          var target, targetInTipBody, targetInTrigger;
          target = e.target;
          targetInTrigger = plugin.oelem[0].contains(target);
          targetInTipBody = plugin.tipBodyElem[0].contains(target);
          if (!targetInTrigger && !targetInTipBody) {
            hide();
          }
        });
      });
      return plugin;
    };
    _M = {
      v: '0.1.0',
      render: function(options) {
        var instance;
        instance = new Plugin(options);
        instance.render();
        return instance;
      }
    };
    return exports(MOD_NAME, _M);
  });

}).call(this);