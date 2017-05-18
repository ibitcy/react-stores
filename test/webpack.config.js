module.exports = {
    entry: { bundle1: ['./test.tsx'] },
    output: {
        filename: 'test.js'
    },
    module: {
        rules: [
            {
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader'
			}
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
}