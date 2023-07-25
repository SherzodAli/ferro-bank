import { BaseScreen } from '@/core/component/base-screen.component'
import { $F } from '@/core/fquery/fquery.lib'
import renderService from '@/core/services/render.service'

import { Button } from '@/components/ui/button/button.component'
import { Field } from '@/components/ui/field/field.component'

import styles from './home.module.scss'
import template from './home.template.html'

export class Home extends BaseScreen {
	constructor() {
		super({ title: 'Home' })
	}

	render() {
		const button = new Button({
			children: 'Send',
			onClick: () => alert('Hey'),
			variant: 'green'
		})
		const input = new Field({
			name: 'Test',
			placeholder: 'Name',
			variant: 'green',
			type: 'text',
			value: ''
		})
		const element = renderService.htmlToElement(
			template,
			[button, input],
			styles
		)

		$F(element).find('h1').css('color', 'pink')
		return element
	}
}
