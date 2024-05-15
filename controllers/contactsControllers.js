import contactsServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsServices.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsServices.getContactById(id);

    if (!contact) {
      throw HttpError(404);
    }
    res.json(contact).status(200);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {  
  try {
    const { id } = req.params;
    const contact = await contactsServices.removeContact(id);

    if (!contact) {
      throw HttpError(404);
    }
    res.json(contact).status(200);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const createdContact = await contactsServices.addContact(
      name,
      email,
      phone
    );
    res.json(createdContact).status(201);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const updatedContact = await contactsServices.updateContact(id, {
      name,
      email,
      phone,
    });

    if (updateContact != null) {
      res.json(updatedContact).status(200);
    }
  } catch (error) {
    next(error);
  }
};
