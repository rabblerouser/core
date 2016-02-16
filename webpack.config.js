var webpack = require('webpack');

module.exports = {
    entry: {
        main:'./src/frontend/components/App.jsx',
        renew: './src/frontend/components/Renew.jsx',
        admin: './src/frontend/components/admin/AdminDashboard.jsx'
    },
    output: {
        path: './public/javascript',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'stage-0']
                }
            }
        ]
    },
    plugins: [
    ]
};
