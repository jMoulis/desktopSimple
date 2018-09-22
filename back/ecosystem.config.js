module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    {
      name: 'student',
      script: 'app.js',
      env: {
        COMMON_VARIABLE: 'true',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'root',
      host: '93.90.204.229',
      ref: 'origin/master',
      repo: 'git@github.com:jMoulis/student.git',
      path: '/var/www/html/student/back',
      'post-deploy': 'npm install',
    },
    dev: {
      user: 'node',
      host: '93.90.204.229',
      ref: 'origin/master',
      repo: 'git@github.com:jMoulis/student.git',
      path: '/var/www/development',
      'post-deploy': 'npm install',
      env: {
        NODE_ENV: 'dev',
      },
    },
  },
};
