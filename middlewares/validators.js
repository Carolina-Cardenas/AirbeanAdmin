export function validateAuthBody(req, res, next) {
  const { username, password } = req.body;
  if (username && password) {
    next();
  } else {
    next({
      status: 400,
      message: "BOTH username AND password are required",
    });
  }
}

// Validador para crear un nuevo carrito
export function validateCartBody(req, res, next) {
  const { prodId, qty } = req.body;
  if (prodId && qty) {
    next();
  } else {
    next({
      status: 400,
      message: "BOTH prodId AND qty are required",
    });
  }
}

// Validador para crear una nueva orden
export function validateOrderBody(req, res, next) {
  const { cartId } = req.body;
  if (cartId) {
    next();
  } else {
    next({
      status: 400,
      message: "cartId is required",
    });
  }
}

// Validador para crear nuevo producto
export function validateProductBody(req, res, next) {
  const { title, desc, price } = req.body;

  if (!title || !desc || !price) {
    return next({
      status: 400,
      message: "All fields (title, desc, price) are required",
    });
  }

  if (typeof title !== "string" || title.trim().length === 0) {
    return next({
      status: 400,
      message: "Title must be a non-empty string",
    });
  }

  if (typeof desc !== "string" || desc.trim().length < 10) {
    return next({
      status: 400,
      message: "Description must be at least 10 characters long",
    });
  }

  if (typeof price !== "number" || price <= 0) {
    return next({
      status: 400,
      message: "Price must be a positive number",
    });
  }

  next();
}

export function validateUpdateProductBody(req, res, next) {
  const { title, desc, price } = req.body;

  // Al menos uno de los campos debe estar presente
  if (!title && !desc && !price) {
    return next({
      status: 400,
      message: "At least one field (title, desc, price) must be provided",
    });
  }

  // Validar campos si están presentes
  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim().length === 0)
  ) {
    return next({
      status: 400,
      message: "Title must be a non-empty string",
    });
  }

  if (
    desc !== undefined &&
    (typeof desc !== "string" || desc.trim().length < 10)
  ) {
    return next({
      status: 400,
      message: "Description must be at least 10 characters long",
    });
  }

  if (price !== undefined && (typeof price !== "number" || price <= 0)) {
    return next({
      status: 400,
      message: "Price must be a positive number",
    });
  }

  next();
}
