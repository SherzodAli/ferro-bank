import { BaseScreen } from '../component/base-screen.component'
import ChildComponent from '../component/child.component'

class RenderService {
	#componentTagPattern = /^component-/

	/**
	 * Renders custom html tags, css classes to a normal html
	 * @param {string} html
	 * @param {Array} components
	 * @param {Object} [styles]
	 * @returns {HTMLElement}
	 */
	htmlToElement(html, components = [], styles) {
		const template = document.createElement('template')
		template.innerHTML = html.trim()
		const element = template.content.firstChild

		if (styles) {
			this.#applyModuleStyles(styles, element)
		}

		this.#replaceComponentTags(element, components)

		return element
	}

	/**
	 * Replaces custom html tags to its html content
	 * @param {HTMLElement} parentElement
	 * @param {Array} components
	 */
	#replaceComponentTags(parentElement, components) {
		const allElements = [...parentElement.getElementsByTagName('*')]

		allElements.map(element => {
			if (!this.#componentTagPattern.test(element.tagName.toLowerCase())) return

			const foundComponent = this.#findComponent(element, components)
			if (!foundComponent) return

			element.replaceWith(this.#getComponentContent(foundComponent))
		})
	}

	/**
	 * Finds specified component by name in provided components list
	 * @param {HTMLElement} element
	 * @param {Array} components
	 * @returns {ChildComponent|BaseScreen}
	 */
	#findComponent(element, components) {
		const componentName = element.tagName
			.toLowerCase()
			.replace(this.#componentTagPattern, '')
			.replace(/-/g, '')

		const foundComponent = components.find(Component => {
			const instance =
				Component instanceof ChildComponent ? Component : new Component()
			return instance.constructor.name.toLowerCase() === componentName
		})

		if (!foundComponent) {
			console.error(
				`Component "${componentName}" not found in the provided components array.`
			)
			return
		}

		return foundComponent
	}

	/**
	 * Gets html content of the component
	 * @param {ChildComponent|BaseScreen} component
	 * @returns {string}
	 */
	#getComponentContent(component) {
		if (component instanceof BaseScreen) {
			return new component.render()
		}

		if (component instanceof ChildComponent) {
			return component.render()
		}

		throw new Error('Component must be type of ChildComponent or BaseScreen')
	}

	/**
	 * @param {Object} moduleStyles
	 * @param {string} element
	 * @returns {void}
	 */
	#applyModuleStyles(moduleStyles, element) {
		if (!element) return

		if (element.getAttribute('class')) {
			this.#changeClassName(moduleStyles, element)
		}

		const elements = element.querySelectorAll('*')
		elements.forEach(element => this.#changeClassName(moduleStyles, element))
	}

	/**
	 * @param {Object} moduleStyles
	 * @param {HTMLElement} element
	 */
	#changeClassName(moduleStyles, element) {
		for (const [key, value] of Object.entries(moduleStyles)) {
			if (element.classList.contains(key)) {
				element.classList.remove(key)
				element.classList.add(value)
			}
		}
	}
}

export default new RenderService()
