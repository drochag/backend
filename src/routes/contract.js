const router = require('express').Router()
const { get, index } = require('../controllers/contract')
const { getProfile } = require('../middleware/getProfile')

/**
* @api {get} /contracts/:id Retrieve a specific owned contract
* @apiName RetrieveContracts
* @apiGroup Contracts
* @apiPermission authenticated user
* @apiHeader {String} profile_id User profile_id.
* @apiSuccess {Object[]} contracts List of contracts belonging to the user.
* @apiError 401 Authenticated access only.
* @apiError 404 No contract found or not belonging to the user.
* @apiParam {Number} id Contract unique ID.
*/
router.get('/:id', getProfile, get)

/**
* @api {get} /contracts Retrieve all owned contracts
* @apiName RetrieveContract
* @apiGroup Contracts
* @apiPermission authenticated user
* @apiHeader {String} profile_id User profile_id.
* @apiSuccess {Object[]} contracts List of contracts belonging to the user.
* @apiError 401 Authenticated access only.
*/
router.get('/', getProfile, index)

module.exports = router
