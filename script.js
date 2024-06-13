const phoneInputsContainer = document.getElementById('phoneInputs');
const addPhoneButton = document.getElementById('addPhoneButton');
const sendSMSLink = document.getElementById('sendSMS');
const messageInput = document.getElementById('message');

let phoneInputCount = 0;

addPhoneButton.addEventListener('click', () => {
  phoneInputCount++;

  const newPhoneInput = document.createElement('div');
  newPhoneInput.classList.add('phone-input');
  newPhoneInput.innerHTML = `
    <label for="phone${phoneInputCount}">Phone Number ${phoneInputCount}:</label>
    <input type="tel" id="phone${phoneInputCount}" name="phone${phoneInputCount}" required>
  `;

  phoneInputsContainer.appendChild(newPhoneInput);
});

addPhoneButton.click();

sendSMSLink.addEventListener('click', () => {
  let phoneNumbers = [];
  for (let i = 1; i <= phoneInputCount; i++) {
    const phoneInput = document.getElementById(`phone${i}`);
    if (phoneInput.value) {
      phoneNumbers.push(phoneInput.value);
    }
  }

  const message = messageInput.value;

  // Construct the SMS link
  const smsLink = `sms://open?addresses=${phoneNumbers.map(n => '+' + n).join(',')}&body=${encodeURIComponent(message)}`;

  console.log(smsLink);

  sendSMSLink.href = smsLink;
});