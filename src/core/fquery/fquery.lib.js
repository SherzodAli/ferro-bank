/**
 * Better approach to work with DOM elements.
 * Modern version of JQuery.
 */
class FQuery {
	/**
	 * @param {string|HTMLElement} selector - CSS selector or HTMLElement.
	 */
	constructor(selector) {
		if (selector instanceof HTMLElement) {
			this.element = selector
			return
		}

		if (typeof selector === 'string') {
			this.element = document.querySelector(selector)
			if (!this.element) throw new Error(`Element ${selector} not found!`)
			return
		}

		throw new Error('Invalid selector type')
	}

	/**
	 * Finds the first element with the specified selector
	 * within the element scope.
	 * @param {string} selector - CSS selector
	 * @returns {FQuery}
	 */
	find(selector) {
		const element = new FQuery(this.element.querySelector(selector))
		if (!element) throw new Error(`Element ${selector} not found!`)

		return element
	}

	/**
	 * Sets the CSS styles for the element.
	 * @param {string} property - CSS property
	 * @param {string} value - value for CSS property
	 * @returns {FQuery}
	 */
	css(property, value) {
		if (typeof property !== 'string' || typeof value !== 'string') {
			throw new Error('Property and value must be strings')
		}

		this.element.style[property] = value
		return this
	}
}

/**
 * Shorter way to use FQuery functionality.
 * @param {string|HTMLElement} selector - CSS selector or HTMLElement.
 * @returns {FQuery}
 */
export function $F(selector) {
	return new FQuery(selector)
}
