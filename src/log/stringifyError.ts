export default function stringifyError(error: unknown): string {
	if (error instanceof Error) {
		if (error.stack) {
			return error.stack;
		}
		if (error.message) {
			return error.message;
		}
	}
	return String(error);
}
