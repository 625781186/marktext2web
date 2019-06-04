import Vue from 'vue'

class EventEmitter {
  constructor() {

  };
}

function on(Event_str, callback) {
  console.log("-->on_callback:", Event_str)
  e_bus.$on(Event_str, callback)
}

function send(Event_str, agrs) {
  console.log("==>send:", Event_str,agrs)
  e_bus.$emit(Event_str, ...[{sender: new EventEmitter()},
                             agrs,
  ])
}

const e_bus = new Vue();
Object.defineProperty(e_bus, 'on', {value: on, writable: true})
Object.defineProperty(e_bus, 'send', {value: send, writable: true})
// console.log(e_bus)
// e_bus.prototype.send = e_bus.$emit;
export default e_bus
