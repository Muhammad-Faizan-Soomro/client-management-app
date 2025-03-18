const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

module.exports = {
  packagerConfig: {
    asar: true,
    prune: true,
    icon: "renderer/icon.ico",
    asarUnpack: "**/*.node", // Exclude native modules
    ignore: [
      "node_modules/\\.cache",
      "node_modules/electron-devtools-installer",
      "tests",
      "scripts",
      "docs",
      "README.md",
      ".gitignore",
      ".gitattributes",
      ".vscode",
      "package-lock.json",
      "\\.pdb$",
      "\\.dSYM",
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        setupIcon: "renderer/icon.ico", // Local path to .ico
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
