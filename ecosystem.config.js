module.exports = {
  apps: [
    {
      name: 'en-bot',
      script: 'src/bot/index.ts',
      interpreter: 'node',
      interpreter_args: '--import tsx --env-file=.env.local'
    }
  ]
};
