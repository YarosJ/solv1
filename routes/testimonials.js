import express from 'express';
import TestimonialsController from '../controllers/testimonialsController';
import authenticationMiddleware from '../helpers/authentication/AuthenticationMiddleware';

/**
 * Testimonials route
 * @param acl (Access control list for authentication middleware)
 * @returns {Router|router|*}
 * @private
 */

const _router = (acl) => {
  const router = express.Router();
  const controller = new TestimonialsController();

  /**
   * @api {get} /testimonials
   * Get all testimonials
   * @apiName List
   * @apiGroup Testimonials
   * @apiVersion 1.0.0
   *
   * @apiSuccess {Array} Testimonials List of all testimonials.
   * @apiSuccessExample SuccessResponse:
   *     HTTP/1.1 201 OK
   *     [
   *        {
   *           "_id": "5b387a7709f05514c72bc439",
   *           "title": "cbv2",
   *           "body": "bcbc",
   *           "autor": "bcbc",
   *           "createdAt": "2018-07-01T06:53:43.069Z",
   *           "gender": "male"
   *        },
   *        {
   *           "_id": "5b3b415260426d2468572bf8",
   *           "title": "xxx",
   *           "body": "xcvx",
   *           "autor": "xcvv",
   *           "createdAt": "2018-07-03T09:26:42.893Z",
   *           "gender": "male"
   *        },
   *     ]
   *
   * @apiUse ServerError
   */

  router.get('/', authenticationMiddleware(acl), (req, res) => controller.getTestimonials(req, res));

  /**
   * @api {post} /testimonials
   * Create new testimonial
   * @apiName Create
   * @apiGroup Testimonials
   * @apiVersion 1.0.0
   * @apiPermission depends on the permissions settings in the admin.
   *
   * @apiParamExample {String} Request-Example:
   *     {
   *      "title": "Test title",
   *      "body": "Test body",
   *      "autor": "Test autor",
   *      "gender": "male"
   *     }
   *
   * @apiSuccess {String} Testimonials New testimonial.
   * @apiSuccessExample SuccessResponse:
   *     HTTP/1.1 201 OK
   *     {
   *      "__v": 0,
   *      "title": "Test title",
   *      "body": "Test body",
   *      "autor": "Test autor",
   *      "createdAt": "2018-07-07T13:29:38.386Z",
   *      "_id": "5b40c0420d9d33574231ffc4",
   *      "gender": "male"
   *     }
   *
   * @apiUse UnauthorizedError
   *
   * @apiError ValidationError Invalid data.
   * @apiErrorExample ValidationError:
   *     HTTP/1.1 400 Bad Request
   *     {
   *      "message": "Testimonial validation failed: title: Path `title` is required."
   *     }
   *
   * @apiUse ServerError
   */

  router.post('/', authenticationMiddleware(acl), (req, res) => controller.createTestimonial(req, res));

  /**
   * @api {put} /testimonials/:id
   * Update testimonial
   * @apiName Update
   * @apiGroup Testimonials
   * @apiVersion 1.0.0
   * @apiPermission depends on the permissions settings in the admin.
   *
   * @apiParam {String} id id of testimonial.
   *
   * @apiParamExample {String} Request-Example:
   *     {
   *      "title": "Updated test title",
   *      "gender": "female"
   *     }
   *
   * @apiSuccess {String} Testimonial Updated testimonial.
   * @apiSuccessExample SuccessResponse:
   *     HTTP/1.1 200 OK
   *     {
   *      "_id": "5b40c0420d9d33574231ffc4",
   *      "title": "Updated test title",
   *      "body": "sdfsdf sfdgds",
   *      "autor": "ASDF",
   *      "createdAt": "2018-07-07T13:29:38.386Z",
   *      "__v": 0,
   *      "gender": "female"
   *     }
   *
   * @apiError NotFound Testimonial by this id doesn't exist.
   * @apiErrorExample NotFound:
   *     HTTP/1.1 404 Not Found
   *     {
   *      "message": "Testimonial by this id doesn't exist"
   *     }
   *
   * @apiUse UnauthorizedError
   * @apiUse ServerError
   */

  router.put('/:id', authenticationMiddleware(acl), (req, res) => controller.updateTestimonial(req, res));

  /**
   * @api {delete} /testimonials/:id
   * Delete testimonial
   * @apiName Delete
   * @apiGroup Testimonials
   * @apiVersion 1.0.0
   * @apiPermission depends on the permissions settings in the admin.
   *
   * @apiParam {String} id id of testimonial.
   *
   * @apiSuccess {String} SuccessResponse Success message.
   * @apiSuccessExample SuccessResponse:
   *     HTTP/1.1 200 OK
   *     {
   *      "message": "Success"
   *     }
   *
   * @apiError NotFound testimonial by this id doesn't exist.
   * @apiErrorExample NotFound:
   *     HTTP/1.1 404 Not Found
   *     {
   *      "message": "Testimonial by this id doesn't exist"
   *     }
   *
   * @apiUse UnauthorizedError
   * @apiUse ServerError
   */

  router.delete('/:id', authenticationMiddleware(acl), (req, res) => controller.deleteTestimonial(req, res));

  return router;
};

export default _router;
