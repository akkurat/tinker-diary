import { useState } from 'react';
import * as React from 'react'

export const Hello = () => {

  const [value, valueSetter] =useState('')
  const post = content => {
    Meteor.call('pages.insert', value)
    valueSetter('')
  };

  return (
    <div>
      <input onChange={ev => valueSetter(ev.target.value)} value={value}/>
      <button onClick={post}>Click Me</button>
      <p>You've entered {value}</p>
    </div>
  );
};
