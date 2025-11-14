const path = require('path');
const yaml = require('yamljs');
const json5 = require('json5');

module.exports = {
    entry: './src/index.ts',
    devtool:'inline-source-map',
    
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node-modules/
            }
        ]
    },
    resolve:{
        extensions: ['.tsx','.ts','.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};