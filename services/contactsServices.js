import * as fs from "node:fs/promises";
import path from "path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const contacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(contacts);
}

async function getContactById(id) {
  const contacts = await listContacts();

  const getContact = contacts.find((contact) => contact.id === id);

  return getContact ? getContact : null;
}

async function removeContact(id) {
  const contacts = await listContacts();

  const contactToRemove = contacts.find((contact) => contact.id === id);
  if (contactToRemove !== undefined) {
    const newContacts = contacts.filter((contact) => contact.id !== id);
    fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return contactToRemove;
  } else {
    return null;
  }
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();

  const newContact = { id: crypto.randomUUID(), name, email, phone };

  contacts.push(newContact);

  fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
}

async function updateContact(id, newContact) {
  const contacts = await listContacts();
  
  const contactIndex = contacts.findIndex((contact) => contact.id === id);

  contacts[contactIndex] = { ...contacts[contactIndex], ...newContact };
  fs.writeFile(contactsPath, JSON.stringify(contacts));
  return contacts[contactIndex];
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
