import { effect } from '@lit-labs/preact-signals';
import type { Part, TemplateResult } from 'lit';
import { AsyncDirective, directive, type DirectiveClass, type PartInfo } from 'lit/async-directive.js';


export type KeystoneProps<T extends Record<string, any>> = {
	children: TemplateResult<any>
} & T


export type SubProps<T extends (...args: any[]) => any> = Parameters<T>[0];


export interface KeystoneHooks {
	onConnected: (() => void)[];
}


export interface KeystoneComponent extends DirectiveClass {

}


export interface KeystoneDirective extends AsyncDirective {
	addHook<T extends keyof KeystoneHooks>(
		hook: T,
		callback: KeystoneHooks[T][number]
	): void;
}


export let activeFactory: (KeystoneDirective & Record<keyof any, any>) | undefined = undefined;


export function Keystone<Props extends Record<string, any>>(
	create: (props: KeystoneProps<Props>) =>
		(props: KeystoneProps<Props>) => TemplateResult,
) {
	const Dir = class extends AsyncDirective {

		protected __initialized = false;
		protected __dispose?: () => void;
		protected __renderFn: (props: KeystoneProps<Props>) => TemplateResult;
		protected __props: KeystoneProps<Props>;
		protected __hooks: KeystoneHooks = {
			onConnected: []
		};

		constructor(part: PartInfo) {
			super(part);
		}

		public addHook<T extends keyof typeof this.__hooks>(
			hook: T,
			callback: typeof this.__hooks[T][number]
		) {
			const hookArr = this.__hooks[hook];
			if (!hookArr)
				throw new Error('Unknown hook: ' + hook);

			hookArr.push(callback);
		}

		protected override reconnected(): void {
			this.render(false);
		}

		protected override disconnected(): void {
			this.__dispose?.();
		}

		public override update(_part: Part, [ props ]: [KeystoneProps<Props>]): unknown {
			this.__props = props;

			if (!this.__initialized) {
				this.__initialized = true;

				// this allows functions run inside create to access this instance.
				// eslint-disable-next-line @typescript-eslint/no-this-alias
				activeFactory = this;
				this.__renderFn = create(props);
				activeFactory = undefined;

				queueMicrotask(() => {
					this.__hooks.onConnected.forEach(cb => cb());
				})
			}

			return this.render();
		}

		public override render(updateFromLit = true): unknown {
			let result: unknown;

			this.__dispose?.();
			this.__dispose = effect(() => {
				if (updateFromLit) {
					updateFromLit = false;
					result = this.__renderFn(this.__props);
				}
				else {
					this.setValue(this.__renderFn(this.__props));
				}
			});

			return result;
		}

	};

	return directive(Dir) as unknown as (props: Props) => KeystoneComponent;
}
