import { formatCardNumberWithDashes } from '@/utils/format/format-card-number'

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

	/* FIND */

	/**
	 * Finds the first element with the specified selector
	 * within the element scope.
	 * @param {string} selector - CSS selector
	 * @returns {FQuery}
	 */
	find(selector) {
		const element = this.element.querySelector(selector)
		if (!element) throw new Error(`Element ${selector} not found!`)

		return new FQuery(element)
	}

	/* INSERT */

	/**
	 * Append a new element as a child of the selected element.
	 * @param {HTMLElement} childElement - the child element to append.
	 * @returns {FQuery}
	 */
	append(childElement) {
		this.element.appendChild(childElement)
		return this
	}

	/**
	 * Insert a new element before the selected element.
	 * @param {HTMLElement} newElement
	 * @returns {FQuery}
	 */
	before(newElement) {
		if (!(newElement instanceof HTMLElement))
			throw new Error('Element must be an HTMLElement')

		const parentElement = this.element.parentElement

		if (parentElement) {
			parentElement.insertBefore(newElement, this.element)
			return this
		}

		throw new Error('Element does not have a parent element')
	}

	/**
	 * Get or set inner HTML of the selected element.
	 * @param {string} htmlContent
	 * @returns {FQuery|string}
	 */
	html(htmlContent) {
		if (typeof htmlContent === 'undefined') return this.element.innerHTML
		if (typeof htmlContent === 'string') this.element.innerHTML = htmlContent
		return this
	}

	/* EVENTS */

	/**
	 * Attach a click event listener
	 * @param {function(Event): void} callback
	 * @returns {FQuery}
	 */
	click(callback) {
		this.element.addEventListener('click', callback)
		return this
	}

	/* FORM */

	/**
	 * Set attributes and event listener for an input
	 * @param {object} options
	 * @param {function(Event): void} options.onInput
	 * @param {object} options.rest - optional attributes
	 * @returns {FQuery}
	 */
	input({ onInput, ...rest }) {
		if (this.element.tagName.toLowerCase() !== 'input')
			throw new Error('Element must be an input')

		for (const [key, value] of Object.entries(rest))
			this.element.setAttribute(key, value)

		if (onInput) this.element.addEventListener('input', onInput)

		return this
	}

	/**
	 * Set attributes and event listener for a number input.
	 * @param {number} limit - the maximum length of input value.
	 * @returns {FQuery}
	 */
	numberInput(limit) {
		if (
			this.element.tagName.toLowerCase() !== 'input' ||
			this.element.type !== 'number'
		)
			throw new Error('Element must be an input type "number"')

		this.element.addEventListener('input', event => {
			let value = event.target.value.replace(/[^0-9]/g, '')
			if (limit) value = value.substring(0, limit)
			event.target.value = value
		})

		return this
	}

	/**
	 * Set attributes and event listener for a number input.
	 * @param {number} limit - the maximum length of input value.
	 * @returns {FQuery}
	 */
	creditCardInput() {
		const limit = 16

		if (
			this.element.tagName.toLowerCase() !== 'input' ||
			this.element.type !== 'text'
		)
			throw new Error('Element must be an input type "text"')

		this.element.addEventListener('input', event => {
			let value = event.target.value.replace(/[^0-9]/g, '')
			if (limit) value = value.substring(0, limit)
			event.target.value = formatCardNumberWithDashes(value)
		})

		return this
	}

	/* STYLES */

	/**
	 * Sets the CSS styles for the element.
	 * @param {string} property - CSS property
	 * @param {string} value - value for CSS property
	 * @returns {FQuery}
	 */
	css(property, value) {
		if (typeof property !== 'string' || typeof value !== 'string')
			throw new Error('Property and value must be strings')

		this.element.style[property] = value
		return this
	}

	/**
	 * Adds class or list of classes to the element.
	 * @param {string|string[]} classNames
	 * @returns {FQuery}
	 */
	addClass(classNames) {
		if (!Array.isArray(classNames)) classNames = [classNames]

		classNames.forEach(className => this.element.classList.add(className))
		return this
	}

	/**
	 * Removes class or list of classes from the element.
	 * @param {string|string[]} classNames
	 * @returns {FQuery}
	 */
	removeClass(classNames) {
		if (!Array.isArray(classNames)) classNames = [classNames]

		classNames.forEach(className => this.element.classList.remove(className))
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
