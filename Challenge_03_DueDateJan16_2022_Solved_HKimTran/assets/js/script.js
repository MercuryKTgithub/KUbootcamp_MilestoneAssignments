// Assignment code here
const PW_LENGTH_MIN = 8; // -- at least 8 characters
const PW_LENGTH_MAX = 128; // -- no more than 128 characters
const ONE4YES_TWO4NO = 'Please enter one 1 for YES, 2 for NO';
const TRYAGAIN = "Please try again!";
const INVALID_INPUT = 'You either hit Cancel button or you did not enter a valid input.';
const CANCEL_INCORRECT = 'You either hit Cancel button or you did not pick a valid option.';
const PW_LENGTH_QUESTION = 'How long would you like your password to be? (Pick a number of characters from 8 to 128)';
const LINE_BREAK =  '\r\n';
const PRINT_YES = "YES";
const PRINT_NO = "NO";
const EMPTY_STRING = '';

const OPEN_MSG = "The generated password "
const NO_PW_MSG = "No Password is Generated"; // when reply NO to all questions per TA suggestion

// Global - to be inspected but not altered:
const digitZeroToNine = '0123456789';
const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';

const symbolFineByItSelf = "~!@#$%^&*()_+`-={|}[]:;<>?,./";  
const symbolNeedsEscapeChar = "\"\'\\" ;   

var valPanel = document.getElementById("validation");
var passwordText = document.getElementById("password");
var generateBtn = document.getElementById("generate");

var allSymbols = symbolFineByItSelf + symbolNeedsEscapeChar;
var allIndividualSymbols = [];
// Transverse thru this array of special characters to assist with pw validation, to avoid additional checking if a char is numeric
allIndividualSymbols =  allSymbols.split(EMPTY_STRING); 

var uppercaseLetters = lowercaseLetters.toString().toUpperCase();
var allIndividualUppercase = [];
// Transverse thru this array of uppercase character to assist with pw validation, to avoid additional checking if a char is special character
allIndividualUppercase =  uppercaseLetters.split(EMPTY_STRING);

// Randomly generated whole number value in some range = Math.floor(Math.random() * (max - min + 1) + min);
// Evaluate (max - min + 1) + min) :
// min = 0 (index 0 to get the 1st letter in the array)
// max = how many letters are there in the available valid character set - 1 (because we're looking at indexes) that is:
// max = array.length - 1
// Now (max - min + 1) + min = ((array.length - 1) - 0 + 1) + 0  =  array.length
// Thus value = Math.floor(Math.random() * array.length;

// Function Declarations:
function generatePassword(length, charactersets){
  let wishlistPw = EMPTY_STRING;
  console.log(charactersets);
  for (let j = 0; j < length; j++) 
  {
     const index = Math.floor(Math.random() * charactersets.length); // pick randomly a number as index from 0 to upperbound - 1 
     wishlistPw += charactersets[index]; // extract the letter given the index position and append it to var generatedPassword in each iteration
  }
  return wishlistPw;
}

// Be informative to the end-user
function printSupplementaryInfoLeft(){
  valPanel.style.textAlign = "left";
  valPanel.style.display = "block";
}

function printSupplementaryInfoCentered(){
  valPanel.style.textAlign = "center";
  valPanel.style.display = "block";
}

 function isNumeric(letter){
   // -- javascript method isNaN() returns true if a value is  
   // -- Not-a-Number so we would want to return the opposite
   return !isNaN(letter) 
 }
// End of Function Declarations

// Function Expressions:
// Taking care of the promp interactions with end-user and sanitize input data
var getProperLength = function() {
   var pwlengthPromp = window.prompt(PW_LENGTH_QUESTION); // Prompt for integer input 

   // Dectect (1) no text entered when OK button gets clicked OR (2) -- cancel button gets clicked regardless what entered, results in null case
   // OR (3) -- length is too short as less than 8 characters OR (4) -- length is too long as it is more than 128 characters
   while ( (pwlengthPromp === EMPTY_STRING ) || (pwlengthPromp === null) || (parseInt(pwlengthPromp) < PW_LENGTH_MIN) || (parseInt(pwlengthPromp) > PW_LENGTH_MAX)) {
      // - not satisfied, keep asking until correct input is received        
      pwlengthPromp = prompt(INVALID_INPUT + LINE_BREAK + TRYAGAIN + LINE_BREAK + PW_LENGTH_QUESTION);
   }
   PasswordText.pwlength = pwlengthPromp; // record the length number
};

var confirmLowercase = function() {
   // -- Choose window.prompt over window.confirm because window.confirm presents 
   // -- the default "OK" and "Cancel" where Cancel would cause ambiguity
   var currentLengthMessage = "You chose password's length to be: " + PasswordText.pwlength;

   var lowercasePromp = window.prompt(currentLengthMessage + LINE_BREAK + LINE_BREAK
                        + "Would you like lowercase characters in your password? " + ONE4YES_TWO4NO);

   // -- convert answer from prompt to an actual number
   lowercasePromp = parseInt(lowercasePromp);

   // -- use switch case to carry out action
   switch (lowercasePromp) {
     case 1:
      PasswordText.lowercase = true;
      break;
     case 2:
      PasswordText.lowercase = false;
      break;
     default:
      window.alert(CANCEL_INCORRECT + LINE_BREAK + TRYAGAIN);
       confirmLowercase(); // recursive call - keep asking until proper input is received
       break;

   } // END OF switch
}; // END OF FUNCTION confirmLowercase

var confirmUppercase = function() {
   // Short summary
   var currentLengthMessage = "You chose password's length to be: " + (PasswordText.pwlength);
   var currentLowercase = (PasswordText.lowercase)? PRINT_YES : PRINT_NO; // conditional ternary operator
   var currentLowercaseMessage = "Your response to include lowercase in your pasword is: " + currentLowercase;
   // Prompt question
   var uppercasePromp = window.prompt(currentLengthMessage + LINE_BREAK + currentLowercaseMessage + LINE_BREAK + LINE_BREAK
                        + "Would you like uppercase characters in your password? " + ONE4YES_TWO4NO);
   uppercasePromp = parseInt(uppercasePromp);
   switch (uppercasePromp) {
     case 1:
      PasswordText.uppercase = true;
      break;
     case 2:
      PasswordText.uppercase = false;
      break;
     default:
       window.alert(CANCEL_INCORRECT + LINE_BREAK + TRYAGAIN);
       confirmUppercase();
       break;
   }
};

var confirmNumeric = function() {
  // Short summary
   var currentLengthMessage = "You chose password's length to be: " + PasswordText.pwlength;

   var currentLowercase = (PasswordText.lowercase)? PRINT_YES : PRINT_NO; // conditional ternary operator
   var currentLowercaseMessage = "Your response to include lowercase in your pasword is: " + currentLowercase;

   var currentUppercase = PasswordText.uppercase? PRINT_YES : PRINT_NO;
   var currentUppercaseMessage = "Your response to include uppercase in your pasword is: " + currentUppercase;

   // Prompt question
   var numericPromp = window.prompt(currentLengthMessage + LINE_BREAK + currentLowercaseMessage  + LINE_BREAK + currentUppercaseMessage + LINE_BREAK
                      + LINE_BREAK + "Would you like numeric characters in your password? " + ONE4YES_TWO4NO);
   numericPromp = parseInt(numericPromp);
   switch (numericPromp) {
      case 1:
         PasswordText.numeric = true;
         break;
      case 2:
         PasswordText.numeric = false;
         break;
      default:
         window.alert(CANCEL_INCORRECT + LINE_BREAK + TRYAGAIN);
         confirmNumeric();
         break;
   }
};

var confirmSymbolIncluded = function() {
   // Short summary
   var currentLengthMessage = "You chose password's length to be: " + PasswordText.pwlength;
   var currentLowercase = (PasswordText.lowercase)? PRINT_YES : PRINT_NO;

   var currentLowercaseMessage = "Your response to include lowercase in your pasword is: " + currentLowercase;
   var currentUppercase = PasswordText.uppercase? PRINT_YES : PRINT_NO;

   var currentUppercaseMessage = "Your response to include uppercase in your pasword is: " + currentUppercase;
   var currentNumeric = PasswordText.numeric? PRINT_YES : PRINT_NO;

   var currentNumericMessage = "Your response to include numeric characters in your pasword is: " + currentNumeric;
   var currentSummary = currentLengthMessage + LINE_BREAK + currentLowercaseMessage  + LINE_BREAK
                        + currentUppercaseMessage + LINE_BREAK + currentNumericMessage + LINE_BREAK
   // Prompt question
   var symbolicPromp = window.prompt(currentSummary + LINE_BREAK + "Would you like special characters in your password? " + ONE4YES_TWO4NO);
   
   symbolicPromp = parseInt(symbolicPromp);
   switch (symbolicPromp) {
      case 1:
         PasswordText.symbolincluded = true;
         var currentSymbolicMessage = "Your response to include special characters in your pasword is: " + PRINT_YES + LINE_BREAK;
         window.alert(currentSummary + currentSymbolicMessage);
         break;
      case 2:
         PasswordText.symbolincluded = false;
         var currentSymbolicMessage = "Your response to include special characters in your pasword is: " + PRINT_NO + LINE_BREAK;
         window.alert(currentSummary + currentSymbolicMessage);
         break;
      default:
         window.alert(CANCEL_INCORRECT + LINE_BREAK + TRYAGAIN);
         confirmSymbolIncluded();
         break;
   }
};

// BEGIN OF VALIDATING FUNCTIONS OF THE GENERATED PASSWORD WHICH IS NOT NULL AT THIS POINT

// Validate password's length is in acceptable range [8, 127] - square bracket indicates endpoint values included as well
var didLengthMeetRange = function(pw){
   met = false;
   if ((pw.length >= PW_LENGTH_MIN) && (pw.length <= PW_LENGTH_MAX)){
      console.log(pw.length.toString() + " is a proper length");
      met=  true;
   }
   console.log(met);
   return met;
 }

var existedUppercase = function(pw){
   var found = false;
   for(var j = 0; j < allIndividualUppercase.length; j++)
   { 
      for(var i = 0; i < pw.length; i++)
      {
         //console.log(i);
         //console.log(pw[i]);
         if(allIndividualUppercase[j] === pw[i]){
            console.log(pw[i] + " is an uppercase letter" );
            found = true;
         }
      }
   }
   //console.log(found);
   return found;
 }

 var existedLowercase = function(pw){
   var found = false;
   for(var j = 0; j < lowercaseLetters.length; j++)
   { 
      for(var i = 0; i < pw.length; i++)
      {
         //console.log(i);
         //console.log(pw[i]);
         if(lowercaseLetters[j] === pw[i]){
            console.log(pw[i] + " is an lowercase letter" );
            found = true;
         }
      }
   }
   console.log(found);
   return found;
 }

 var hasNumericCharacter =  function(pw) {
   for(var i = 0; i <= pw.length; i++)
   {
     if (isNumeric(pw[i].toString()))
     {
       console.log(pw[i].toString() + " is numeric");
       return true;
     }

   }
 }

 var detecteCharSpecial = function(pw){
   // console.log(allIndividualSymbols);
   existedSymbol = false;
   // -- Use the array of symbols as pivot for testing whether the incoming character is a special char
   for(var i = 0; i <= allIndividualSymbols.length; i++)
   {
      // -- if the index is not negative, the symbol at which the index pointed at, is found in the password. 
      target = pw.indexOf(allIndividualSymbols[i]);
      if(target > -1)
      {
         console.log(pw[target].toString() + " found at index " + target + " is a special letter" );
         existedSymbol = true;
      }
   }
   return existedSymbol;
} 
// END OF PASSWORD VALIDATING FUNCTIONS
// End of Function Expressions

// Gather client responses and feed them into object PasswordText that can be accessed later for implementation
var gatherSpecs = function(){
   getProperLength();
   confirmLowercase();
   confirmUppercase();
   confirmNumeric();
   confirmSymbolIncluded();

};

// Break-down given specs and iamplement the password creation accordingly
var implementSpecs = function(){

   let validChars = EMPTY_STRING;
   let generatedPassword = EMPTY_STRING;

   passwordText.textContent = EMPTY_STRING;
   valPanel.textContent = EMPTY_STRING;

   let wishlistHasLowercase = PasswordText.lowercase;
   let wishlistHasUppercase = PasswordText.uppercase;
   let wishlistHasNumber = PasswordText.numeric;
   let wishlistHasSpecialChar = PasswordText.symbolincluded;

   // // Hardcoded value for quick test only
   // let wishlistHasLowercase = true;
   // let wishlistHasUppercase = true;
   // let wishlistHasNumber = true;
   // let wishlistHasSpecialChar = true;
   // validChars = lowercaseLetters + uppercaseLetters + digitZeroToNine + allSymbols

   // -- Determine which character-type is included from which the password will be generated.
   if (wishlistHasLowercase) {
      validChars += lowercaseLetters;
   }

   if (wishlistHasUppercase) {
      validChars += lowercaseLetters.toUpperCase();
   }

   if (wishlistHasNumber) {
      validChars += digitZeroToNine;
   }

   if (wishlistHasSpecialChar) {
      validChars += allSymbols;
   }
   
   // console.log(validChars);

   // -- When the client says NO to all the criteria questions,
   // -- no password should be generated (per TA) and print this message as the result
   if((!wishlistHasLowercase) && (!wishlistHasUppercase) && (!wishlistHasNumber) && (!wishlistHasSpecialChar))
   {
      generatedPassword = NO_PW_MSG;
      printSupplementaryInfoCentered();
      valPanel.textContent = NO_PW_MSG + " as You Answered NO to All The Character-type Criteria Questions"; 
   }
   
   // -- When the client says YES to at least 1 criteria question,
   // -- generate the passwordand & check whether generated pw length is proper  
   if(wishlistHasLowercase || wishlistHasUppercase || wishlistHasNumber || wishlistHasSpecialChar)
   {
      // -- make a call the function that generates the random password
      generatedPassword = generatePassword(parseInt(PasswordText.pwlength), validChars);

      // // Generate the pw of length 33 hardcoded - testing onl
      // for (let i = 0; i < 128; i++) 
      // {
      //    const index = Math.floor(Math.random() * validChars.length); 
      //    generatedPassword += validChars[index];          
      // }

      if (didLengthMeetRange(generatedPassword))
      {
            printSupplementaryInfoLeft();
            valPanel.textContent =  OPEN_MSG + generatedPassword + " has " + generatedPassword.length.toString() + " characters in range of [8, 128]." + LINE_BREAK; 
      }
   }
   
   // -- Only validate the generated password against active specs (to which the client says YES)   
   // -- to make sure it indeed has at least one letter that satisfies the desired character type:

   if (wishlistHasLowercase) 
   {
      var found = existedLowercase(generatedPassword);
      //console.log("found-lowercase value is: " + found);
      printSupplementaryInfoLeft();
      if (found)
      {
         valPanel.textContent += OPEN_MSG + generatedPassword + " reflects lowercase letter(s)." + LINE_BREAK;
      } else {
         valPanel.textContent +=  OPEN_MSG + generatedPassword + " does not reflect lowercase letter(s)." + LINE_BREAK;
      }
   }

   if(wishlistHasUppercase)
   {
      var found = existedUppercase(generatedPassword);
      // console.log("found-uppercase value is: " + found);
      printSupplementaryInfoLeft();
      if (found)
      {
         valPanel.textContent += OPEN_MSG + generatedPassword + " reflects uppercase letter(s)." + LINE_BREAK;
      } 
      else 
      {
         valPanel.textContent += OPEN_MSG + generatedPassword + " does not reflect uppercase letter(s)." + LINE_BREAK;
      }
   }

   if (wishlistHasNumber) 
   {
      printSupplementaryInfoLeft();
      if (hasNumericCharacter(generatedPassword))
      {
         valPanel.textContent += OPEN_MSG + generatedPassword + " reflects numeric character(s)." + LINE_BREAK;
      } else {
         valPanel.textContent += OPEN_MSG + generatedPassword + " does not reflect numeric character(s)." + LINE_BREAK;
      }
   }

   if(wishlistHasSpecialChar)
   {
      printSupplementaryInfoLeft();
    
      if(detecteCharSpecial(generatedPassword)){
         valPanel.textContent += OPEN_MSG + generatedPassword + " reflects special character(s)."+ LINE_BREAK;  
      } else {
         valPanel.textContent += OPEN_MSG + generatedPassword + " does not reflect special character(s)."+ LINE_BREAK;  
      }
   }

   passwordText.textContent = generatedPassword; // print final result
};

// Object PasswordText encapsulates all password requirement specifications from client
var PasswordText = {
   // -- treat pw length as string for now
   pwlength: EMPTY_STRING,
   lowercase: false,
   uppercase: false,
   numeric: false,
   symbolincluded: false,
   reset: function() { // just in case
      this.pwlength = EMPTY_STRING;
      this.lowercase = false;
      this.uppercase = false;
      this.numeric = false;
      this.symbolincluded = false;
   },
   
 };

// Actions - Things happen when client clicks the Generate Password button
generateBtn.addEventListener("click", function(){   
   gatherSpecs();
   implementSpecs();
});

 
