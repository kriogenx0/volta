import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, boolean, text } from '@storybook/addon-knobs/react'

import DateInput from './DateInput'
import DateRange from './DateRange'
import TimeRange from './TimeRange'
import TimeInput from './TimeInput'

storiesOf('DateTime', module)
  .addDecorator(withKnobs)
  .add('DateRange', () => (
    <DateRange
      dateEnd={new Date('April 21 2019')}
      dateStart={new Date('April 21 2019')}
      errorEnd={text('Error End Message', '')}
      errorStart={text('Error Start Message', '')}
      readonly={boolean('Read Only', false)}
      showDate={boolean('Show Date', true)}
      showTime={boolean('Show Time', true)}
      labelDateStart="hey"
      labelTimeStart=""
      labelDateEnd="guys"
      labelTimeEnd={null}
      onChange={({ dateStart, dateEnd, error }) => {}}
    />
  ))
  .add('DateRange: null dates', () => (
    <DateRange
      error={text('Error Message', '')}
      dateEnd={null}
      dateStart={null}
      readonly={boolean('Read Only', false)}
      showDate={boolean('Show Date', true)}
      showTime={boolean('Show Time', true)}
      onChange={({ dateStart, dateEnd, error }) => {}}
    />
  ))
  .add('DateInput', () => (
    <DateInput
      maxDate={new Date('April 27 2019')}
      minDate={new Date('April 21 2019')}
      position={text('Position', 'bottom left')}
      readonly={boolean('Read Only', false)}
      value={new Date()}
      onChange={() => {}}
    />
  ))
  .add('DateInput: null date', () => (
    <DateInput position={text('Position', 'bottom left')} readonly={boolean('Read Only', false)} onChange={() => {}} />
  ))
  .add('TimeRange', () => (
    <TimeRange
      labelStart="Start Label"
      labelEnd="End Label"
      readonly={boolean('Read Only', false)}
      requiredEnd={boolean('Required End', false)}
      requiredStart={boolean('Required Start', false)}
      timeEnd="10:00"
      timeStart="9:00"
      onChange={({ timeStart, timeEnd, error }) => {
        console.log('timeStart, timeEnd, error', timeStart, timeEnd, error)
      }}
    />
  ))
  .add('TimeInput', () => (
    <TimeInput
      error={text('Error Message', '')}
      onBlur={(value, error) => {}}
      onChange={(value) => {}}
      readonly={boolean('Read Only', false)}
      value={text('Time', '12:34')}
    />
  ))
  .add('TimeInput: null time', () => (
    <TimeInput
      error={text('Error Message', '')}
      onBlur={(value, error) => {}}
      onChange={(value) => {}}
      readonly={boolean('Read Only', false)}
    />
  ))
