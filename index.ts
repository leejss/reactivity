import { createEffect } from "./effect";
import { Signal } from "./signal";

const count = new Signal(0);

// set currentEffect fn
createEffect(() => {
  console.log("count::", count.value);
});

// and then change the value of signal
// this will trigger notify inside signal
count.value = 1;

// call effect
// call effectFn
// cleanup deps
// set currentEffect
// call fn

// call getter of signal
// call _trackEffect
// add currentEffect to subscribers
// add signal to currentEffectDeps

// call setter -> call notify
// call subscribers

// call registered effect
