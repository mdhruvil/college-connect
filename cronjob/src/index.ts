export default {
	async fetch(req) {
		const url = new URL(req.url);
		url.pathname = '/__scheduled';
		url.searchParams.append('cron', '0 12 * * *');
		return new Response(`To test the scheduled handler, ensure you have used the "--test-scheduled" then try running "curl ${url.href}".`);
	},

	async scheduled(event, env, ctx): Promise<void> {
		const resp = await fetch('https://college-connect-eight.vercel.app/api/health');
		const wasSuccessful = resp.ok ? 'success' : 'fail';

		console.log(`trigger fired at ${event.cron}: ${wasSuccessful}, response status: ${resp.status}`);
	},
} satisfies ExportedHandler<Env>;
