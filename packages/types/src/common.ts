// unsubscribe to a listener
// when you call subscribe, you get a Unsub which you call to stop listening
export type Unsub = () => void;

// function to call when something changes
// useSyncExternalStore sends 1 arg (function() {checkIfSnapshotChanged(inst) && forceStoreRerender(fiber)})
export type Listener = () => void;
