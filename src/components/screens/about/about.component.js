import { BaseScreen } from '@/core/component/base-screen.component'

export class About extends BaseScreen {
	constructor() {
		super({ title: 'About us' })
	}

	render() {
		return '<p>About us</p>'
	}
}
