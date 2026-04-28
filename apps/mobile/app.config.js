module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
    supabaseUrl: process.env.SUPABASE_URL
  }
});
