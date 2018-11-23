layui.define [
  'jquery'
  'table'
  'form'
  'layer'
], (exports) ->
  $ = layui.jquery
  {table, form, layer} = layui

  MOD_NAME = 'typeinput'
  CLS_NAME = 'n-typeinput'

  defaultSettings =
    trigger: 'focus'
    autoFocus: true
    searchKey: 'keyword'
    searchPlaceholder: '关键词搜索'

  Plugin = (options) ->
    @settings = $.extend {}, defaultSettings, options or {}
    @oelem = $ @settings.elem
    @tipIndex = null
    @tableInstance = null
    return

  Plugin::render = ->
    plugin = @
    opt = plugin.settings

    tableName = 'typeinput_tbl_' + new Date().getTime()
    tableID = 'TBL_' + tableName
    tableFilter = tableName
    tableDone = opt.table.done or ->
    opt.table.page or= true
    opt.table.height or= 315

    html = """
      <div class="#{CLS_NAME}">
        <div class="p-toolbar">
          <div class="layui-form">
            <input type="text" class="layui-input p-input"
              name="#{opt.searchKey}"
              placeholder="#{opt.searchPlaceholder}"
              autocomplete="off"><button class="layui-btn layui-btn-sm layui-btn-primary p-btn-search"
                lay-submit lay-filter="n-typeinput-btn-search"><i class="layui-icon layui-icon-search"></i></button>
          </div>
        </div>
        <table id="#{tableID}" lay-filter="#{tableFilter}"></table>
      </div>
    """

    hide = ->
      layer.close plugin.tipIndex
      plugin.tipIndex = null
      delete table.cache[tableID]
      return

    emitSelect = (checkStatus) ->
      rv = opt.done plugin.oelem, checkStatus
      if rv isnt false
        hide()
      return

    plugin.oelem.on opt.trigger, (e) ->
      layui.stope e

      return false if plugin.tipIndex?

      plugin.tipIndex = layer.tips html, opt.elem,
        tips: 3
        time: 0
        skin: 'layer-' + CLS_NAME
        tipsMore: true
        success: (layero, index) ->
          plugin.tipBodyElem = layero.find '.layui-layer-content'
          if opt.autoFocus
            (layero.find '.p-input').focus()

      opt.table.elem = '#' + tableID
      opt.table.done = (res, curr, count) ->
        tableDone res, curr, count

      plugin.tableInstance = table.render opt.table

      form.on 'submit(n-typeinput-btn-search)', (data) ->
        plugin.tableInstance.reload
          where: data.field
          page:
            curr: 1
        return false

      table.on "radio(#{tableFilter})", (obj) ->
        emitSelect table.checkStatus tableID
      table.on "rowDouble(#{tableFilter})", (obj) ->
        checkStatus =
          data: [obj.data]
        emitSelect checkStatus

      ($ document).on 'click', (e) ->
        target = e.target
        targetInTrigger = plugin.oelem[0].contains target
        targetInTipBody = plugin.tipBodyElem[0].contains target
        hide() if not targetInTrigger and not targetInTipBody
        return

    return plugin

  _M =
    v: '0.1.0'
    render: (options) ->
      instance = new Plugin options
      instance.render()
      return instance

  exports MOD_NAME, _M
