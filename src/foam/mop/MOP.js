/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.INTERFACE({
  package: 'foam.mop',
  name: 'MOP',

  documentation: 'MOP Interface',

  methods: [
    {
      name: 'get',
      async: true,
      returns: 'foam.core.FObject',
      args: [
        { name: 'x', type: 'Context' }
      ]
    },
    {
      name: 'setProperty',
      async: true,
      returns: 'FObject',
      args: [ { name: 'x', type: 'Context' },
              { name: 'name', type: 'String' },
              { name: 'value', type: 'Any' } ]
    },
    {
      name: 'setProperties',
      async: true,
      returns: 'FObject',
      args: [ { name: 'x', type: 'Context' },
              { name: 'values', type: 'Map' } ]
    }
  ]
});
