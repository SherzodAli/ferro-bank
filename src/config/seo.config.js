const SITE_NAME = 'Ferro Bank — Vanilla JS'

export function getTitle(title) {
	return title ? `${title} | ${SITE_NAME}` : SITE_NAME
}
