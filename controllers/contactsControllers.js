import contactsServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsServices.listContacts(req.user.id);
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsServices.getContactById(id, req.user.id);

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
    const contact = await contactsServices.removeContact(id, req.user.id);

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
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      owner: req.user.id,
    };

    const createdContact = await contactsServices.addContact(contact);
    res.json(createdContact).status(201);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const updatedContact = await contactsServices.updateContact(
      id,
      req.user.id, contact
    );

    if (!updateContact) {
      throw HttpError(404);
    }
    res.json(updatedContact).status(200);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    
    const updatedStatusContact = await contactsServices.updateContact(
      id, req.user.id, {favorite}
    );

    if (!updatedStatusContact) {
      throw HttpError(404);
    }
      res.json(updatedStatusContact).status(200);
  } catch (error) {
    next(error)
  }
}
