import React from 'react'
import { storiesOf } from '@storybook/react'
import * as messages from './index'

storiesOf('messages', module).add('Messages', () => (
  <div>
    <h2>Messsages</h2>
    <p>This is the messages currently used in the app</p>
    {Object.entries(messages).map(([label, labelMessages]) => (
      <div key={label}>
        <h3>{label}</h3>
        {Object.entries(labelMessages).map(([type, message]) => (
          <div key={type}>
            <h4>{type}:</h4>
            <p>{message}</p>
          </div>
        ))}
      </div>
    ))}
  </div>
))
