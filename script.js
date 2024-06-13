const phoneInputsContainer = document.getElementById('phoneInputs');
const addPhoneButton = document.getElementById('addPhoneButton');
const sendSMSLink = document.getElementById('sendSMS');
const messageInput = document.getElementById('message');
const statusArea = document.getElementById('status');

function logStatus(message) {
  statusArea.textContent = message;
}

let phoneInputCount = 0;

// Load phone numbers from local storage on page load
window.addEventListener('load', () => {
  const storedPhoneNumbers = JSON.parse(localStorage.getItem('phoneNumbers')) || [];
  phoneInputCount = storedPhoneNumbers.length;
  storedPhoneNumbers.forEach((phoneNumber, index) => {
    addPhoneInput(phoneNumber, index + 1);
  });
});

addPhoneButton.addEventListener('click', () => {
  phoneInputCount++;
  addPhoneInput('', phoneInputCount);
});

// addPhoneButton.click()

sendSMSLink.addEventListener('click', () => {
  let phoneNumbers = [];
  for (let i = 1; i <= phoneInputCount; i++) {
    const phoneInput = document.getElementById(`phone${i}`);
    if (phoneInput.value) {
      phoneNumbers.push(phoneInput.value);
    }
  }

  const message = messageInput.value;


  // example:
  //  <a href="sms://open?addresses=+12223334444,+12223334445?&body=Message%20Line%201%E2%80%A8Message%20Line%202">Send SMS to multi #s</a>
  // vs
  // sms:/open?addresses={phone number 1},{phone number 2},...

  // https://stackoverflow.com/a/71807194

  // Construct the SMS link
  const smsLink = `sms://open?addresses=${phoneNumbers.map(n => "+1" + n).join(',')}?&body=${encodeURIComponent(message)}`;

  logStatus(`SMS link: ${smsLink}`);

  sendSMSLink.href = smsLink;
});

// Function to add a phone input field
function addPhoneInput(phoneNumber, index) {
  const newPhoneInput = document.createElement('div');
  newPhoneInput.classList.add('phone-input');
  newPhoneInput.innerHTML = `
    <label for="phone${index}">
      Phone Number ${index}:
       <button class="delete-phone" data-index="${index}">X</button>
    </label>
    <input type="tel" id="phone${index}" name="phone${index}" required value="${phoneNumber}">

  `;

  phoneInputsContainer.appendChild(newPhoneInput);

  logStatus(`Phone number added. Total: ${phoneInputCount}`);

  // Add event listener for delete button
  const deleteButton = newPhoneInput.querySelector('.delete-phone');
  deleteButton.addEventListener('click', handleDeletePhone);
}

// Function to handle phone number deletion
function handleDeletePhone(event) {
  const indexToDelete = parseInt(event.target.dataset.index, 10);
  const phoneInput = document.getElementById(`phone${indexToDelete}`);
  phoneInput.parentElement.remove(); // Remove the entire phone input div
  // Update phoneInputCount
  phoneInputCount--;
  // Update local storage
  const phoneNumbers = [];
  for (let i = 1; i <= phoneInputCount; i++) {
    const phoneInput = document.getElementById(`phone${i}`);
    if (phoneInput.value) {
      phoneNumbers.push(phoneInput.value);
    }
  }
  localStorage.setItem('phoneNumbers', JSON.stringify(phoneNumbers));
  logStatus(`Phone number ${indexToDelete} deleted.`);
}

// Save phone numbers to local storage whenever an input changes
phoneInputsContainer.addEventListener('input', () => {
  const phoneNumbers = [];
  for (let i = 1; i <= phoneInputCount; i++) {
    const phoneInput = document.getElementById(`phone${i}`);
    if (phoneInput.value) {
      phoneNumbers.push(phoneInput.value);
    }
  }
  localStorage.setItem('phoneNumbers', JSON.stringify(phoneNumbers));
  logStatus(`Saved phone numbers to local storage: ${JSON.stringify(phoneNumbers)}`);
});