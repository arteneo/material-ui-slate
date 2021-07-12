export default {
    dest: "./public",
    src: "./src",
    files: ["../docs/**/*.{md,markdown,mdx}"],
    typescript: true,
    gatsbyRemarkPlugins: [
        {
            resolve: "gatsby-remark-vscode",
        },
    ],
    themeConfig: {
        colors: {
            primary: "#1e3799",
        },
    },
};
