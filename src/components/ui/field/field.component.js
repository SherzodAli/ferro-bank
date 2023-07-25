import ChildComponent from '@/core/component/child.component'
import { $F } from '@/core/fquery/fquery.lib'
import renderService from '@/core/services/render.service'

import styles from './field.module.scss'
import template from './field.template.html'

export class Field extends ChildComponent {
	constructor({ placeholder, type = 'text', value = '', name, variant }) {
		super()

		if (!name) throw new Error('Please fill field "name"')

		this.placeholder = placeholder
		this.type = type
		this.value = value
		this.name = name
		this.variant = variant
	}

	render() {
		this.element = renderService.htmlToElement(template, [], styles)

		const isInputNumber = this.type === 'number'
		const isInputCreditCard = this.variant === 'credit-card'

		const inputElement = $F(this.element).find('input').input({
			placeholder: this.placeholder,
			type: this.type,
			value: this.value,
			name: this.name
		})

		if (isInputNumber) inputElement.numberInput()
		if (isInputCreditCard) inputElement.creditCardInput()

		return this.element
	}
}