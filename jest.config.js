/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
export default {
	testEnvironment: 'node',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^\\.(.+)\\.js$': '.$1',
	},
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: 'test/tsconfig.json',
			},
		],
	},
};
