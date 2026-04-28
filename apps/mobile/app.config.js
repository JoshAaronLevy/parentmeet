const fs = require("fs");
const path = require("path");

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .reduce((env, line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        return env;
      }

      const separatorIndex = trimmed.indexOf("=");

      if (separatorIndex === -1) {
        return env;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();

      env[key] = value.replace(/^['"]|['"]$/g, "");
      return env;
    }, {});
}

const rootEnv = readEnvFile(path.resolve(__dirname, "../../.env"));
const mobileEnv = readEnvFile(path.resolve(__dirname, ".env"));
const env = {
  ...rootEnv,
  ...mobileEnv,
  ...process.env
};

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    supabasePublishableKey: env.SUPABASE_PUBLISHABLE_KEY,
    supabaseUrl: env.SUPABASE_URL
  }
});
