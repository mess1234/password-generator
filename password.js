"use strict";

// Char sets
const DIGITS = "0123456789";
const UP_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LO_LETTERS = "abcdefghijklmnopqrstuvwxyz";
const SYMBOLS = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
let validChars = "";

/**
 * Copy password to clipboard.
 */
function copyPwd() {
  let word = document.getElementById("pwd-out").innerText;
  navigator.clipboard.writeText(word).then(
    () => copyAlert(true), // copy succeeded
    () => copyAlert(false) // copy failed
  );
}

/**
 * Show an alert indicating whether copying the password to clipboard suceeded
 * or failed.
 * @param {boolean} success true if suceeded, false otherwise
 */
function copyAlert(success) {
  const placeholder = document.getElementById("alertPlaceholder");
  placeholder.setAttribute("role", "alert");
  if (success) {
    placeholder.innerText = "Password copied";
    placeholder.setAttribute("class", "alert alert-success");
  } else {
    placeholder.innerText = "Failed to copy password";
    placeholder.setAttribute("class", "alert alert-danger");
  }
}

/**
 * Synchronize the length bar and length box and write password.
 * @param {Event} event an input event (user updated password length)
 */
function lenSync(event) {
  let thisElement = event.target;
  let otherId = thisElement.id == "len-box" ? "len-bar" : "len-box";
  let otherElement = document.getElementById(otherId);
  otherElement.value = thisElement.value;
  writePwd();
}

/**
 * Generate a new password and write it on the web page.
 */
function writePwd() {
  let output = document.getElementById("pwd-out");
  let pwdLen = document.getElementById("len-box").value;
  output.innerText = generator(pwdLen);
}

/**
 * Generate a new password.
 * @param {number} len password length
 * @returns {string} a password
 */
function generator(len) {
  setValidChars();
  if (validChars.length === 0) {
    return ""; // No valid char
  }
  // Create new password
  let pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += randChar(validChars);
  }
  return pwd;
}

/**
 * Set validChars depending on wich checkboxes are checked.
 */
function setValidChars() {
  validChars = "";
  if (document.getElementById("digits").checked) {
    validChars += DIGITS;
  }
  if (document.getElementById("uppercase").checked) {
    validChars += UP_LETTERS;
  }
  if (document.getElementById("lowercase").checked) {
    validChars += LO_LETTERS;
  }
  if (document.getElementById("symbols").checked) {
    validChars += SYMBOLS;
  }
}

/**
 * Return a random character from a nonempty string.
 * @param {string} s
 * @returns {string} a character from s
 */
function randChar(s) {
  return s[randRange(s.length)];
}

/**
 * Return a random integer.
 * @param {number} n  a positive integer
 * @returns {number} a number in {0, ..., n-1}
 */
function randRange(n) {
  return Math.floor(Math.random() * n);
}

/**
 * Setup event listeners.
 */
function setupListeners() {
  // Length
  document.getElementById("len-box").addEventListener("input", lenSync);
  document.getElementById("len-bar").addEventListener("input", lenSync);
  // Characters
  let boxes = document.querySelectorAll("input[type=checkbox]");
  for (let b of boxes) {
    b.addEventListener("change", writePwd);
  }
  // Buttons
  document.querySelector("form").addEventListener("submit", (event) => {
    writePwd();
    event.preventDefault(); // prevent page from reloading
  });
  document.getElementById("copy").addEventListener("click", copyPwd);
}

window.addEventListener("load", setupListeners);
window.addEventListener("load", writePwd);
