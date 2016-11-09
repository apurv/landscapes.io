'use strict';

var mongoose = require('mongoose');
var Landscape = mongoose.model('Landscape');
var Deployment = mongoose.model('Deployment');
var winston = require('winston');
var async = require('async');
var AWS = require('aws-sdk');
const https = require('https');
var path = require('path');
var fs = require('fs');
var OpenStack = require('./openstackdeploy.server.controller.js');


function _setCABundle(pathToCertDotPemFile, rejectUnauthorized) {
    let filePath = path.join(process.cwd(), pathToCertDotPemFile);
    winston.info('## rejectUnauthorizedSsl -->', data.rejectUnauthorizedSsl);
    winston.info('##          caBundlePath -->', data.caBundlePath);

    var certs = [fs.readFileSync(filePath)];
    winston.info('##        Read CA Bundle -->', filePath);

    AWS.config.update({
        httpOptions: {
            agent: new https.Agent({
                rejectUnauthorized: rejectUnauthorized,
                ca: certs
            })
        }
    });
}

function _setRejectUnauthorizedSsl(rejectUnauthorized) {
    winston.info('## rejectUnauthorizedSsl -->', rejectUnauthorized);
    AWS.config.update({
        httpOptions: {
            agent: new https.Agent({
                rejectUnauthorized: rejectUnauthorized
            })
        }
    });
}

// POST /api/deployments
exports.create = function (req, res) {
    winston.info('---> Creating Deployment');

    var user = req.user;
    var data = req.body;
    var newDeployment = {};
    var parentLandscape = {};
    var stackParams = {};
    var stackName = {};
    var params = {};
    var cloudFormation;

    if (data.location.substring(0, 'openstack'.length) === 'openstack') {
        winston.info('using OpenStack provider');
        cloudFormation = new OpenStack();
        cloudFormation.config(data.accessKeyId, data.secretAccessKey);
    } else {
        winston.info('---> Default to AWS provider');
        if (data.accessKeyId && data.secretAccessKey) {
            winston.info('---> setting AWS security credentials');

            AWS.config.update({
                accessKeyId: data.accessKeyId,
                secretAccessKey: data.secretAccessKey
            });

        } else {
            winston.info(' ---> No AWS security credentials set - assuming Server Role');
        }

        if (data.caBundlePath) {
            let rejectUnauthorized = data.rejectUnauthorizedSsl || true;
            _setCABundle(data.caBundlePath, rejectUnauthorized);

        } else if (data.rejectUnauthorizedSsl !== undefined) {
            // no caBundlePath
            _setRejectUnauthorizedSsl(data.rejectUnauthorizedSsl);
        }
           
        // if (data.signatureBlock) {
        //     winston.info('## signatureBlock', data.signatureBlock)
        //     _setSignatureBlock(data.signatureBlock)
        // }

        if (data.endpoint) {
            winston.info('##              endpoint -->', data.endpoint)
            AWS.config.endpoint = data.endpoint;
        }
        
        winston.info('##            AWS Region -->', data.location);
        AWS.config.region = data.location;

        cloudFormation = new AWS.CloudFormation({
            apiVersion: '2010-05-15'
        });

        console.log(AWS.config)
    }

    async.series({
        saveDeploymentData: function (callback) {
            winston.info('---> async.series >> saving deployment data...');
            try {
                newDeployment = new Deployment(data);
                newDeployment.createdBy = user.displayName; // TODO Should this by user._id  AH?

                var tags = Object.keys(data.tags);
                newDeployment.tags = [];
                for (var i = 0; i < tags.length; i++) {
                    var tag = {
                        Key: tags[i],
                        Value: data.tags[tags[i]]
                    };
                    newDeployment.tags.push(tag);
                }
                winston.info('## Tags:', JSON.stringify(newDeployment.tags));

                newDeployment.cloudFormationParameters = []; //
                var keys = Object.keys(data.cloudFormationParameters);
                for (var j = 0; j < keys.length; j++) {
                    var cloudFormationParameter = {
                        ParameterKey: keys[j],
                        ParameterValue: data.cloudFormationParameters[keys[j]]
                    };
                    newDeployment.cloudFormationParameters.push(cloudFormationParameter);
                }

                newDeployment.save(function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        winston.info('---> async.series >> deployment data saved!');
                        //What are the next three lines for - AH ? 
                        stackName = newDeployment.stackName;
                        params = {
                            StackName: stackName
                        };
                        callback(null);
                    }
                });
            } catch (err) {
                callback(err);
            }
        },
        setStackParameters: function (callback) {
            winston.info('---> async.series >> setting stack parameters...');
            Landscape.findOne({
                _id: newDeployment.landscapeId
            }, function (err, landscape) {
                if (err) {
                    callback(err);
                } else {
                    parentLandscape = landscape;

                    stackParams = {
                        // RoleARN: 'arn:aws:iam::414519249282:role/aws-elasticbeanstalk-ec2-role',
                        StackName: stackName,
                        TemplateBody: landscape.cloudFormationTemplate,
                        Parameters: newDeployment.cloudFormationParameters,
                        Capabilities: ['CAPABILITY_IAM']
                    };

                    stackParams.Parameters = newDeployment.cloudFormationParameters;

                    stackParams.Tags = newDeployment.tags;

                    if (newDeployment.description) {
                        stackParams.Tags.push({
                            Key: "Description",
                            Value: newDeployment.description
                        });
                    }
                    if (newDeployment.billingCode) {
                        stackParams.Tags.push({
                            Key: "Billing Code",
                            Value: newDeployment.billingCode
                        });
                    }

                    winston.info('---> async.series >> stack parameters set!');
                    callback(null);
                }
            });
        },
        verifyStackNameAvailability: function (callback) {
            winston.info('---> async.series >> verifying availability of stack name...');
            cloudFormation.describeStacks(params, function (err, data) {
                if (err) {
                    if (err.message.indexOf('does not exist') !== -1) {
                        winston.info('---> async.series >> stack name "' + stackName + '" available!');
                        callback(null);
                    } else {
                        // It's a real error...
                        callback(err);
                    }

                } else {
                    var e = {
                        message: 'Stack with name \'' + stackName + '\' already exists.'
                    };
                    winston.info('---> async.series >> stack name "' + stackName + '" already exists!');
                    callback(e);
                }
            });
        },
        createStack: function (callback) {
            winston.info('---> async.series >> creating stack...');

            // fix single quote issue...
            var cleanStackParams = JSON.parse(JSON.stringify(stackParams));

            var awsRequest = cloudFormation.createStack(cleanStackParams, function (err, data) {
                if (err) {
                    callback(err);

                } else {
                    winston.info('---> async.series >> stack created!');

                    newDeployment.stackId = data.StackId;
                    newDeployment.save(function (err) {
                        if (err) {
                            callback(err);
                        }
                        callback(null, data); // awsRequest?
                    });
                }
            });
        }
    },
        function (err, results) {
            if (err) {
                winston.info('---> async.series >> final callback: ERR');
                winston.error(err);

                newDeployment.awsErrors = err.message || err;
                newDeployment.save(function (err) {
                    if (err) {
                        winston.log('error', err);
                    }
                    return res.send(err);
                });
            } else {
                winston.info('---> async.series >> final callback: SUCCESS');
                return res.json({
                    success: true
                });
            }
        }
    ); // end - async.series
};


// GET /api/deployments
// Gets all deployments for a landscape ID
exports.retrieve = function (req, res) {
    var id = req.params.id;
    return Deployment.find(function (err, deployments) {
        if (!err) {
            return res.json(deployments);
        } else {
            return res.send(err);
        }
    });
};

// GET /api/deployments
// Gets all deployments for a landscape ID
exports.retrieveByLandscapes = function (req, res) {
    var id = req.params.landscapesId;
    return Deployment.find({
        landscapeId: id
    }, function (err, deployments) {
        if (!err) {
            return res.json(deployments);
        } else {
            return res.send(err);
        }
    });
};


// PUT /api/deployments/<api>
exports.update = function (req, res) {
    winston.info('---> updating Deployment');

    var user = req.user.userInfo;

    if (user === undefined) {
        return res.send(401);
    }

    var data = req.body;

    var query = {
        _id: req.params.id
    };

    Deployment.findOne(query, function (err, doc) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            var newNote = {
                createdBy: user,
                createdAt: new Date(),
                text: data.note.text
            };
            doc.notes.push(newNote);

            doc.save(function (err) {
                if (err) {
                    winston.log('error', err);
                    return res.send(500, err);
                } else {
                    winston.info('---> updated: ' + req.params.id);
                    return res.json(doc);
                }
            });
        }
    });
};

// GET /api/deployments/<id>
exports.retrieveOne = function (req, res) {
    var id = req.params.id;
    return Deployment.findOne({
        _id: id
    }, function (err, deployment) {
        if (!err) {
            return res.json(deployment);
        } else {
            return res.send(err);
        }
    });
};
