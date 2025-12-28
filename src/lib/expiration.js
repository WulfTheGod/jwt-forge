import inquirer from 'inquirer';
import chalk from 'chalk';

const EXPIRATION_OPTIONS = [
  { name: '5 minutes', value: 5 * 60 },
  { name: '15 minutes', value: 15 * 60 },
  { name: '30 minutes', value: 30 * 60 },
  { name: '1 hour', value: 60 * 60 },
  { name: '6 hours', value: 6 * 60 * 60 },
  { name: '12 hours', value: 12 * 60 * 60 },
  { name: '1 day', value: 24 * 60 * 60 },
  { name: '7 days', value: 7 * 24 * 60 * 60 },
  { name: 'Custom', value: 'custom' }
];

const TIME_UNITS = [
  { name: 'minutes', value: 60 },
  { name: 'hours', value: 60 * 60 },
  { name: 'days', value: 24 * 60 * 60 }
];

export async function selectExpiration(nonInteractive = false, defaultSeconds = 3600) {
  if (nonInteractive) {
    // Return default expiration (1 hour) for non-interactive mode
    return defaultSeconds;
  }
  
  console.log(chalk.cyan('\nSelect token expiration:'));
  
  const { expiration } = await inquirer.prompt([
    {
      type: 'list',
      name: 'expiration',
      message: 'Choose expiration time:',
      choices: EXPIRATION_OPTIONS,
      pageSize: 10
    }
  ]);

  if (expiration === 'custom') {
    return await selectCustomExpiration();
  }

  return expiration;
}

async function selectCustomExpiration() {
  console.log(chalk.cyan('\nCustom expiration:'));
  
  const { unit } = await inquirer.prompt([
    {
      type: 'list',
      name: 'unit',
      message: 'Select time unit:',
      choices: TIME_UNITS
    }
  ]);

  const { amount } = await inquirer.prompt([
    {
      type: 'number',
      name: 'amount',
      message: `Enter number of ${TIME_UNITS.find(u => u.value === unit).name}:`,
      default: 1,
      validate: (input) => {
        if (input <= 0) return 'Please enter a positive number';
        if (input > 365 * 24 * 60) return 'Maximum expiration is 1 year';
        return true;
      }
    }
  ]);

  return amount * unit;
}

export function formatDuration(seconds) {
  const units = [
    { name: 'day', value: 24 * 60 * 60 },
    { name: 'hour', value: 60 * 60 },
    { name: 'minute', value: 60 }
  ];

  for (const unit of units) {
    if (seconds >= unit.value) {
      const count = Math.floor(seconds / unit.value);
      const remainder = seconds % unit.value;
      
      let result = `${count} ${unit.name}${count !== 1 ? 's' : ''}`;
      
      if (remainder > 0) {
        const nextUnit = units[units.indexOf(unit) + 1];
        if (nextUnit && remainder >= nextUnit.value) {
          const nextCount = Math.floor(remainder / nextUnit.value);
          result += ` ${nextCount} ${nextUnit.name}${nextCount !== 1 ? 's' : ''}`;
        }
      }
      
      return result;
    }
  }

  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}

export function formatExpirationTime(exp) {
  const expirationDate = new Date(exp * 1000);
  const now = new Date();
  const diffSeconds = Math.floor((expirationDate - now) / 1000);
  
  return {
    expiresAt: expirationDate.toISOString(),
    expiresIn: formatDuration(diffSeconds),
    timestamp: exp
  };
}