import Contact from "../models/contact.js";

function listContacts() {
  const contacts = Contact.find();
  return contacts;
}

function getContactById(id) {
  return Contact.findOne({ _id: id });
}

function removeContact(id) {
  return Contact.findByIdAndDelete({ _id: id });
}

function addContact({name, email, phone}) {
  return Contact.create({ name, email, phone });
}

function updateContact(id, fields) {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
