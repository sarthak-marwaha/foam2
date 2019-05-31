foam.CLASS({
  package: 'foam.u2',
  name: 'ViewSpecWithJava',
  extends: 'foam.u2.ViewSpec',
  properties: [
    ['view', { class: 'foam.u2.view.MapView' }],
    ['type', 'foam.lib.json.UnknownFObject'],
    ['javaInfoType', 'foam.core.AbstractFObjectPropertyInfo'],
    ['javaJSONParser', 'new foam.lib.json.UnknownFObjectParser()'],
    // TODO: remove next line when permanently fixed in ViewSpec
    ['fromJSON', function fromJSON(value, ctx, prop, json) {
      return value;
    }]
  ]
});

foam.CLASS({
  package: 'foam.comics.v2',
  name: 'NamedView',
  properties: [
    {
      class: 'String',
      name: 'name'
    },
    {
      class: 'foam.u2.ViewSpecWithJava',
      name: 'view'
    },
    {
      class: 'String',
      name: 'icon'
    }
  ]
}); 

foam.CLASS({
  package: 'foam.comics.v2',
  name: 'CannedQuery',
  properties: [
    {
      class: 'String',
      name: 'name'
    },
    {
      class: 'FObjectProperty',
      of: 'foam.mlang.predicate.Predicate',
      name: 'predicate'
    }
  ]
}); 

foam.CLASS({
  package: 'foam.comics.v2',
  name: 'DAOControllerConfig', // EasyDAOController?
  properties: [
    {
      class: 'String',
      name: 'daoKey'
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'dao',
      hidden: true,
      expression: function(daoKey) {
        return this.__context__[daoKey] || foam.dao.NullDAO.create({of: foam.core.FObject});
      }
    },
    {
      class: 'Class',
      name: 'of',
      expression: function(dao$of) { return dao$of; }
    },
    {
      class: 'String',
      name: 'browseTitle',
      expression: function(of) { return of.name; }
    },
    {
      class: 'foam.u2.ViewSpecWithJava',
      name: 'browseBorder',
      expression: function() {
        // Can't use a value here because java tries to generate a HasMap
        // for it which doesn't jive with the AbstractFObjectPropertyInfo.
        return { class: 'foam.u2.borders.NullBorder' };
      }
    },
    {
      // TODO: add an enabled and disabled icon
      // we should always have a table as the first index
      class: 'FObjectArray',
      of: 'foam.comics.v2.NamedView',
      name: 'browseViews',
      factory: function() {
        return [
          {
            name: 'Table',
            view: { class: 'foam.u2.view.ScrollTableView' },
            icon: 'images/list-view-enabled.svg',
          },
          {
            name: 'Tree',
            view: { class: 'foam.u2.view.ScrollTableView' },
            icon: 'images/account-structure-enabled.svg',
          }
        ];
      }
    },
    {
      class: 'FObjectArray',
      of: 'foam.comics.v2.CannedQuery',
      name: 'cannedQueries',
      // ! These are just for testing purposes until we wire up the cannedQueries with the models
      factory: function(){
        return [
          {
            name: 'All',
            predicate: foam.mlang.predicate.True.create()
          },
          {
            name: 'None',
            predicate: foam.mlang.predicate.False.create()
          }
        ]
      }
    },
    {
      class: 'foam.u2.ViewSpecWithJava',
      name: 'viewBorder',
      expression: function() {
        // Can't use a value here because java tries to generate a HasMap
        // for it which doesn't jive with the AbstractFObjectPropertyInfo.
        return { class: 'foam.u2.borders.NullBorder' };
      }
    },
    {
      class: 'FObjectArray',
      of: 'foam.comics.v2.NamedView',
      name: 'viewViews',
      factory: function() {
        return [
          {
            name: 'SDV',
            view: { class: 'foam.u2.detail.SectionedDetailView' },
            // TODO: Add a disabled icon later when we have more viewViews
            icon: 'images/sdv-icon.svg',
          }
        ];
      }
    }
  ]
});

foam.CLASS({
  package: 'foam.comics.v2',
  name: 'DAOBrowseControllerView',
  extends: 'foam.u2.View',
  imports: [
    'stack'
  ],
  requires: [
    'foam.comics.v2.DAOBrowserView',
    'foam.u2.layout.Cols',
    'foam.u2.layout.Rows',
    'foam.u2.borders.CardBorder'
  ],

  css: `
    ^container {
      padding: 32px;
    }

    ^inner-table {
      padding: 0px 24px;
    }

    ^inner-table .foam-u2-view-TableView th {
      background: #ffffff
    }

    ^ .foam-u2-view-ScrollTableView-table {
      width: 100%;
    }
  `,

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.comics.v2.DAOControllerConfig',
      name: 'data'
    }
  ],
  actions: [
    {
      name: 'create',
      code: function() {
        alert('TODO');
      }
    }
  ],
  methods: [
    function initE() {
    this.SUPER();

    var self = this;

      this.addClass(this.myClass())
      .add(this.slot(function(data, data$browseBorder) {
        return self.E()
          .start(self.Rows).addClass(this.myClass('container'))
            .start(self.Cols).style({'align-items': 'center'})
              .start('h1').add(data.browseTitle$).end()
              .startContext({data: self}).add(self.CREATE).endContext()
            .end()
            .start(this.CardBorder)
              .start(data$browseBorder).addClass(this.myClass('inner-table'))
                .tag(self.DAOBrowserView, { data: data })
              .end()
            .end()
          .end();
      }));
    }
  ]
});

foam.CLASS({
  package: 'foam.comics.v2',
  name: 'DAOBrowserView',
  extends: 'foam.u2.View',
  requires: [
    'foam.u2.ScrollTableView',
    'foam.u2.layout.Cols',
    'foam.u2.layout.Rows',
    'foam.u2.layout.Item',
    'foam.u2.search.Toolbar',
    'foam.u2.ActionView'
  ],

  css: `
    ^ .foam-u2-ActionView-export {
      margin-left: 16px;
    }

    ^ .foam-u2-ActionView img {
      margin-right: 0;
    }

    ^top-bar {
      border-bottom: solid 1px #e7eaec;
    }


    ^query-bar {
      margin-top: 32px;
      margin-bottom: 24px;
    }
  `,

  imports: [
    'stack?'
  ],
  exports: [
    'dblclick'
  ],
  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.comics.v2.DAOControllerConfig',
      name: 'data'
    },
    {
      class: 'FObjectProperty',
      of: 'foam.mlang.predicate.Predicate',
      name: 'predicate',
      factory: function() {
        // showing all by default if no cannedQueries are specified, see below in the initE
        return foam.mlang.predicate.True.create();
      }
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'predicatedDAO',
      expression: function(data, predicate) {
        return data.dao$proxy.where(predicate);
      }
    },
    {
      class: 'foam.u2.ViewSpecWithJava',
      name: 'browseView',
      expression: function(data$browseViews) {
        return data$browseViews[0].view;
      }
    }
  ],
  actions: [
    {
      name: 'export',
      label: '',
      icon: 'images/export-arrow-icon.svg',
      code: function() {
        alert('TODO');
      }
    },
    {
      name: 'toggleCannedQuery',
      code: function(cannedQueryPredicate) {
        this.predicate = cannedQueryPredicate;
      }
    }
  ],
  methods: [
    function dblclick(obj) {
      if ( ! this.stack ) return;
      this.stack.push({
        class: 'foam.comics.v2.DAOUpdateView',
        data$: this.data$,
        obj: obj
      });
    },
    function initE() {
      var self = this;
      this.addClass(this.myClass());
      this.SUPER();
      this
        .add(self.slot(function(data$cannedQueries, data$browseViews) {
          return self.E()
            .start(self.Rows)
              .callIf(data$cannedQueries.length > 1 || data$browseViews > 1, function() {
                this.start(self.Cols).addClass(self.myClass('top-bar')).style({ 'align-items': 'center' })
                  .start(self.Cols)
                    .callIf(data$cannedQueries.length > 1, function() {
                        this.tag( foam.u2.view.TabChoiceView, { 
                          choices: data$cannedQueries.map(o => [o.predicate, o.name]),
                          data$: self.predicate$,
                        }
                      )
                    })
                    .callIf(data$cannedQueries.length === 1, function() {
                        self.predicate = data$cannedQueries[0].predicate;
                      }
                    )
                    /**
                     * otherwise if no cannedQueries are specified then the default
                     * will show all entries so that we do not break history code
                     */
                  .end()
                  .start(self.Cols)
                    .callIf(data$browseViews.length > 1, function() {
                      this.tag( foam.u2.view.IconChoiceView, { 
                          choices: data$browseViews.map(o => [o.view, o.icon]),
                          data$: self.browseView$,
                        }
                      )
                    })
                    /**
                     * By default the browseView should always be a table view
                     */
                  .end()
                .end()
              })
              .start(self.Cols).addClass(this.myClass('query-bar')).style({ 'align-items': 'center'})
                .start(self.Item)
                  .style({'flex-grow': 1 })
                    .tag(self.Toolbar, { data$: self.predicate$ })
                  .end()
                .startContext({data: self}).tag(self.EXPORT, {
                  buttonStyle: foam.u2.ButtonStyle.SECONDARY
                })
                .endContext()
              .end()
              .start(self.Item)
                .style({ margin: 'auto' })
                .add(self.slot(function(browseView) {
                  return self.E().tag(browseView, {
                    data: self.predicatedDAO$proxy
                  });
                }))
              .end()
            .end();
        }));
    }
  ]
}); 

foam.CLASS({
  package: 'foam.comics.v2',
  name: 'DAOUpdateView',
  extends: 'foam.u2.View',
  requires: [
    'foam.u2.layout.Cols',
    'foam.u2.layout.Rows',
    'foam.u2.ControllerMode',
    'foam.u2.layout.Item'
  ],
  imports: [
    'stack'
  ],
  exports: [
    'controllerMode'
  ],
  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.comics.v2.DAOControllerConfig',
      name: 'data'
    },
    {
      name: 'controllerMode',
      factory: function() {
        return this.ControllerMode.VIEW;
      }
    },
    {
      class: 'FObjectProperty',
      name: 'obj'
    },
    {
      class: 'foam.u2.ViewSpecWithJava',
      name: 'viewView',
      expression: function(data$viewViews) {
        return data$viewViews[0].view;
      }
    }
  ],
  actions: [
    {
      name: 'primary',
      code: function() {
        alert('TODO');
      }
    },
    {
      name: 'edit',
      code: function() {
        this.controllerMode = this.ControllerMode.EDIT;
      }
    },
    {
      name: 'delete',
      code: function() {
        alert('TODO');
      }
    }
  ],
  methods: [
    function initE() {
      var self = this;
      this.SUPER();
      this
        .add(self.slot(function(obj, data$viewBorder, data$viewViews) {
          return self.E()
            .start(self.Rows)
              .start(self.Cols)
                .start(self.Rows)
                  // we will handle this in the StackView instead
                  .startContext({ data: self.stack }).add(self.stack.BACK).endContext()
                  .start('h1').add(obj.toSummary()).end()
                .end()
                .startContext({data: self}).add(self.PRIMARY).endContext()
              .end()

              .start(self.Cols)
                .startContext({data: self}).add(self.EDIT).endContext()
                .startContext({data: self}).add(self.DELETE).endContext()
              .end()

              .start(data$viewBorder)
                .start(self.Cols)
                  .forEach(data$viewViews, function(o) {
                    // TODO: make these do something.
                    // TODO: make these icons.
                    this.add(o.name);
                  })
                .end()
                .start(self.Item)
                  .style({ margin: 'auto' })
                  .add(self.slot(function(viewView) {
                    return self.E().tag(viewView, {
                      data: obj
                    });
                  }))
                .end()
              .end()
            .end();
        }));
    }
  ]
}); 