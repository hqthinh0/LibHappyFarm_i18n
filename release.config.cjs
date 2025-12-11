// release.config.cjs
/** @type {import('semantic-release').Options} */
module.exports = {
  branches: ["main"],
  tagFormat: "i18n-v${version}",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
    [
      "@semantic-release/exec",
      {
        // Gọi script bash (không còn phụ thuộc /bin/sh)
        prepareCmd: "bash scripts/ci-prepare.sh",
      },
    ],
    ["@semantic-release/npm", { npmPublish: true }],
    [
      "@semantic-release/github",
      {
        successComment: false,
        failComment: false,
        labels: false,
        releasedLabels: false,
      },
    ],
  ],
};
