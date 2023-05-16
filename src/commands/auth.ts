// import { Command } from 'commander';
import inquirer from 'inquirer';
import Auth from '../lib/Auth';
import CommandError from '../lib/CommandError';
// import Debug from '../lib/Debug';
import validator from 'validator';

const AuthenticationHandler = async (options, command) => {
  try {
    const { email, mobile, password } = options;
    // Email Input
    if (email && email.length) {
      if (!validator.isEmail(email)) {
        throw new CommandError('Enter a valid email');
      }
      if (!password) {
        const questions = [
          {
            type: 'password',
            name: 'password',
            message: 'Enter password',
            mask: '*'
          },
        ];
        await inquirer.prompt(questions).then(async answers => {
          await Auth.loginUserWithEmail(email, answers.password);
        });
      } else {
        await Auth.loginUserWithEmail(email, password);
      }
    }
    // Mobile input
    else if (mobile && mobile.length) {
      if (!validator.isMobilePhone(mobile, 'en-IN')) {
        throw new CommandError('Enter a valid mobile number');
      }
      await Auth.loginInWithMobile(mobile);
    }
    else command.help()
  } catch (error) {
    throw new CommandError(error.message, error?.code);
  }
};

export default function context(program: any) {
  // List available context
  program
    .command('auth')
    .alias('login')
    .option('-e, --email [email]', 'Email ID')
    .option('-p, --password [email]', 'password')
    .option('-m, --mobile [mobile]', 'Mobile number')
    .description('Login user with email or phone number')
    .asyncAction(AuthenticationHandler);

  // Show active context
  program.command('logout').description('Logout user').asyncAction(Auth.logout);
  program.command('user').description('Prints logged in user information').asyncAction(Auth.getUserInfo);
}
