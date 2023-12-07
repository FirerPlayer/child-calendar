import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'br.com.child.calendar',
	appName: 'Child Calendar',
	webDir: 'build',
	server: {
		androidScheme: 'https'
	}
};

export default config;
