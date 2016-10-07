'use strict';

var _ = require('lodash'),
  config = require('../config'),
  mongoose = require('mongoose'),
  chalk = require('chalk'),
  crypto = require('crypto');

var seedOptions = {};

function removeUser(user) {
  return new Promise(function (resolve, reject) {
    var User = mongoose.model('User');
    User.find({ username: user.username }).remove(function (err) {
      if (err) {
        reject(new Error('Failed to remove local ' + user.username));
      }
      resolve();
    });
  });
}

function saveUser(user) {
  return function () {
    return new Promise(function (resolve, reject) {
      // Then save the user
      user.save(function (err, theuser) {
        if (err) {
          console.log(err)
          reject(new Error('Failed to add local ' + user.username));
        } else {
          resolve(theuser);
        }
      });
    });
  };
}

function checkUserNotExists(user) {
  return new Promise(function (resolve, reject) {
    var User = mongoose.model('User');
    User.find({ username: user.username }, function (err, users) {
      if (err) {
        reject(new Error('Failed to find local account ' + user.username));
      }

      if (users.length === 0) {
        resolve();
      } else {
        // reject(new Error('Failed due to local account already exists: ' + user.username));
        reject('Seeding halted because local account already exists: ' + user.username);
      }
    });
  });
}

function reportSuccess(password) {
  return function (user) {
    return new Promise(function (resolve, reject) {
      if (seedOptions.logResults) {
        console.log(chalk.bold.red('Database seeding:\t\t\tLocal ' + user.username + ' added with password set to ' + password));
      }
      resolve();
    });
  };
}

// save the specified user with the password provided from the resolved promise
function seedTheUser(user) {
  return function (password) {
    return new Promise(function (resolve, reject) {
      var User = mongoose.model('User');
      // set the new password
      user.password = password;

      if (user.username === seedOptions.seedAdmin.username && process.env.NODE_ENV === 'production') {
        checkUserNotExists(user)
          .then(saveUser(user))
          .then(reportSuccess(password))
          .then(function () {
            resolve();
          })
          .catch(function (err) {
            reject(err);
          });
      } else {
        // removeUser(user)
        checkUserNotExists(user)
          .then(saveUser(user))
          .then(reportSuccess(password))
          .then(function () {
            resolve();
          })
          .catch(function (err) {
            reject(err);
          });
      }
    });
  };
}

// report the error
function reportError(reject) {
  return function (err) {
    if (seedOptions.logResults) {
      console.log();
      console.log('Database seeding:\t\t\t' + err);
      console.log();
    }
    reject(err);
  };
}

// function seedRoles(roles) {
//   const Role = mongoose.model('Role');

//   let fn = function x(role) {
//     return new Promise(function (resolve, reject) {
//       Role.find({ name: role.name }, function (err, roles) {
//         if (err) { console.log(err); reject(err); }

//         if (roles.length === 0) {
//           // create role if not exist
//           role.save(function (err, theRole) {
//             if (err) { console.log(err); reject(err); }
//             else {              
//               resolve(theRole);
//             }
//           });
//         }
//       });
//     })
//   }

//   let actions = roles.map(fn)
//   return Promise.all(actions)
// }

module.exports.start = function start(options) {
  
  // Initialize the default seed options
  seedOptions = _.clone(config.seedDB.options, true);

  // Check for provided options

  if (_.has(options, 'logResults')) {
    seedOptions.logResults = options.logResults;
  }

  if (_.has(options, 'seedUser')) {
    seedOptions.seedUser = options.seedUser;
  }

  if (_.has(options, 'seedAdmin')) {
    seedOptions.seedAdmin = options.seedAdmin;
  }

  var User = mongoose.model('User');
  return new Promise(function (resolve, reject) {

    var userAccount = new User(seedOptions.seedUser);
    var adminAccount = new User(seedOptions.seedAdmin);

    // If production only seed admin if it does not exist
    if (process.env.NODE_ENV === 'production') {
      User.generateRandomPassphrase()
        .then(seedTheUser(adminAccount))
        .then(function () {
          resolve();
        })
        .catch(reportError(reject));
    } else {
      // Add both Admin and User account

      User.generateRandomPassphrase()
        .then(seedTheUser(userAccount))
        .then(User.generateRandomPassphrase)
        .then(seedTheUser(adminAccount))
        .then(function () {
          resolve();
        })
        .catch(reportError(reject));
    }
  });
};
