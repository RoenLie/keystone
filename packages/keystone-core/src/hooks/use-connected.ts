import { activeFactory } from '../keystone.js';

export function useConnected(callback: () => void) {
	const instance = activeFactory;
	instance?.addHook('onConnected', callback);
}