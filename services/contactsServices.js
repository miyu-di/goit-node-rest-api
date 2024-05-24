import Contact from "../models/contact.js";

function listContacts(ownerId) {
  const contacts = Contact.find({owner: ownerId});
  return contacts;
}

function getContactById(id, ownerId) {
  return Contact.findOne({ _id: id, owner: ownerId });
}

function removeContact(id, ownerId) {
  return Contact.findByIdAndDelete({ _id: id, owner: ownerId });
}

function addContact({name, email, phone, owner}) {
  return Contact.create({ name, email, phone, owner });
}

function updateContact(id, ownerId, fields) {
  return Contact.findByIdAndUpdate({ _id: id, owner: ownerId}, fields, { new: true });
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
