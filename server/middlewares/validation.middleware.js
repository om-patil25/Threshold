/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

export const validateData = (schema) => {
  return async (req, res, next) => {
    const validationResult = await schema.safeParseAsync(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.format() });
    }
    req.body = validationResult.data;

    next();
  };
};
