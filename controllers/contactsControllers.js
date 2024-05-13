import contactsServices from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

import HttpError from "../helpers/HttpError.js";
import validateBody from "../helpers/validateBody.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsServices.listContacts();
    res.status(200).send(contacts);
  } catch (error) {
    res.status(HttpError(404));
  }
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;
    const contact = await contactsServices.getContactById(id);

   if (contact !== null) {
     res.send(contact).status(200);
   } else {
     res.status(HttpError(404));
   }
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    const contact = await contactsServices.removeContact(id)

    if (contact !== null) {
      res.send(contact).status(200);
    } else {
      res.status(HttpError(404));
    }
};

export const createContact = async (req, res) => {
    const { name, email, phone } = req.body;

    validateBody(createContactSchema);

    const createdContact = await contactsServices.addContact(name, email, phone);
    res.json(createdContact).status(201);
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    validateBody(updateContactSchema);

    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    } 

    const updatedContact = await contactsServices.updateContact(id, {
      name,
      email,
      phone,
    });
    res.status(200).json(updatedContact);
};
