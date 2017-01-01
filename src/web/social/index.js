/**
 * Routes to the APIs for social web integration (ActivityPub, MicroPub, etc.)
 * These routes are separated since they have vastly different authentication
 * requirements from the main first-party API and are intended for different users.
 */

import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';

import index from './routes';

const router = express.Router({
  mergeParams: true,
});

const multipart = multer();

router.use(multipart.single());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(index);

export default router;
