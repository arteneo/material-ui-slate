const path = require("path");

exports.onCreateWebpackConfig = (args) => {
    args.actions.setWebpackConfig({
        resolve: {
            alias: {
                "@arteneo/material-ui-slate": path.resolve(__dirname, "../src/"),
            },
        },
    });
};
