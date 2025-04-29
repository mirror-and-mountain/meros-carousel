export function addBorderSupportForReadMore(settings, name) {
  	if (settings?.supports && name === 'core/read-more') {
		return {
			...settings,
			supports: {
				...settings.supports,
				__experimentalBorder: {
					color: true,
					style: true,
					width: true,
					radius: true,
					__experimentalDefaultControls: {
						color: true,
						style: true,
						width: true,
						radius: true,
					}
				}
			}
		};
	}
	return settings;
}