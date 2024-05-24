import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import { tokenValidation } from "../middleware/tokenValidation.js";

const contactsRouter = express.Router();

contactsRouter.get("/", tokenValidation, getAllContacts);

contactsRouter.get("/:id", tokenValidation, getOneContact);

contactsRouter.delete("/:id", tokenValidation, deleteContact);

contactsRouter.post(
  "/",
  tokenValidation,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  tokenValidation,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  tokenValidation,
  validateBody(updateFavoriteSchema),
  updateStatusContact
);

export default contactsRouter;
