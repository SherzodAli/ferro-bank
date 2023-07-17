import { NotFound } from '@/components/screens'

import { ROUTES } from './routes.data'

export class Router {
	#routes
	#currentRoute

	constructor() {
		this.#routes = ROUTES
		this.#currentRoute = null
		this.#handleRouteChange()
	}

	getCurrentPath() {
		return window.location.pathname
	}

	#handleRouteChange() {
		const path = this.getCurrentPath() || '/'
		let route = this.#routes.find(route => route.path === path)

		this.#currentRoute = route ? route : { component: NotFound }
		this.render()
	}

	render() {
		const component = new this.#currentRoute.component()
		document.getElementById('app').innerHTML = component.render()
	}
}
