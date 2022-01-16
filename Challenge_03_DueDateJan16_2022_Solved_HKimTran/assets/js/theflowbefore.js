const PW_LENGTH_MIN = 8; // -- at least 8 characters
const PW_LENGTH_MAX = 128; // -- no more than 128 characters
const ONE4YES_TWO4NO = 'Please enter one 1 for YES, 2 for NO';
const TRYAGAIN = "Please try again!";
const INVALID_INPUT = 'You either hit Cancel button or you did not enter a valid input.';
const CANCEL_INCORRECT = 'You either hit Cancel button or you did not pick a valid option.';
const PW_LENGTH_QUESTION = 'How long would you like your password to be? (Pick a number of characters from 8 to 128)';
const DOUBLE_LINE_BREAK =  '\r\n\r\n'; // -- for console.log testing only
const LINE_BREAK =  '\r\n';
const PRINT_YES = "YES";
const PRINT_NO = "NO";
const EMPTY_STRING = '';

const OPEN_MSG = "The generated password "
const NO_PW_MSG = "No Password is Generated";

// Global - to be inspected but not altered:
const digitZeroToNine = '0123456789';
const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';

const symbolFineByItSelf = "~!@#$%^&*()_+`-={|}[]:;<>?,./";  
const symbolNeedsEscapeChar = "\"\'\\" ;   

var valPanel = document.getElementById("validation");
var pwResult = document.getElementById("password");
var generateBtn = document.getElementById("generate");

var allSymbols = symbolFineByItSelf + symbolNeedsEscapeChar;
var allIndividualSymbols = [];
allIndividualSymbols =  allSymbols.split(EMPTY_STRING);

var uppercaseLetters = lowercaseLetters.toString().toUpperCase();
var allIndividualUppercase = [];
allIndividualUppercase =  uppercaseLetters.split(EMPTY_STRING);

var getProperLength = function() {
   var pwlengthPromp = window.prompt(PW_LENGTH_QUESTION); // Prompt for integer input 

   // Dectect (1) no text entered when OK button gets clicked OR (2) -- cancel button gets clicked regardless what entered, results in null case
   // OR (3) -- length is too short as less than 8 characters OR (4) -- length is too long as it is more than 128 characters
   while ( (pwlengthPromp === EMPTY_STRING ) || (pwlengthPromp === null) || (parseInt(pwlengthPromp) < PW_LENGTH_MIN) || (parseInt(pwlengthPromp) > PW_LENGTH_MAX)) {
      // - not satisfied, keep asking until correct input is received        
      pwlengthPromp = prompt(INVALID_INPUT + LINE_BREAK + TRYAGAIN + LINE_BREAK + PW_LENGTH_QUESTION);
   }
   passwordSpecs.pwlength = pwlengthPromp; // record the length number
};

var confirmLowercase = function() {
   // -- Choose window.prompt over window.confirm because window.confirm presents 
   // -- the default "OK" and "Cancel" where Cancel would cause ambiguity
   var currentLengthMessage = "You chose password's length to be: " + passwordSpecs.pwlength;

   var lowercasePromp = window.prompt(currentLengthMessage + LINE_BREAK + LINE_BREAK
                        + "Would you like lowercase characters in your password? " + ONE4YES_TWO4NO);

   // -- convert answer from prompt to an actual number
   lowercasePromp = parseInt(lowercasePromp);

   // -- use switch case to carry out action
   switch (lowercasePromp) {
     case 1:
      passwordSpecs.lowercase = true;
      break;
     case 2:
      passwordSpecs.lowercase = false;
      break;
     default:
      window.alert(CANCEL_INCORRECT + LINE_BREAK + TRYAGAIN);
       confirmLowercase(); // recursive call
       break;
   } // END OF switch
}; // END OF FUNCTION confirmLowercase

var confirmUppercase = function() {
   var currentLengthMessage = "You chose password's length to be: " + (passwordSpecs.pwlength);
   var currentLowercase = (passwordSpecs.lowercase)? PRINT_YES : PRINT_NO; // Conditional ternary operator
   var currentLowercaseMessage = "Your response to include lowercase in your pasword is: " + currentLowercase;

   var uppercasePromp = window.prompt(currentLengthMessage + LINE_BREAK + currentLowercaseMessage + LINE_BREAK + LINE_BREAK
                        + "Would you like uppercase characters in your password? " + ONE4YES_TWO4NO);
   uppercasePromp = parseInt(uppercasePromp);
   switch (uppercasePromp) {
     case 1:
      passwordSpecs.uppercase = true;
      break;
     case 2:
      passwordSpecs.uppercase = false;
      break;
     default:
       window.alert(CANCEL_INCORRECT + LINE_BREAK + TRYAGAIN);
       confirmUppercase();
       break;
   }
};

var confirmNumeric = function() {
   var currentLengthMessage = "You chose password's length to be: " + passwordSpecs.pwlength;

   var currentLowercase = (passwordSpecs.lowercase)? PRINT_YES : PRINT_NO;
   var currentLowercaseMessage = "Your response to include lowercase in your pasword is: " + currentLowercase;

   var currentUppercase = passwordSpecs.uppercase? PRINT_YES : PRINT_NO;
   var currentUppercaseMessage = "Your response to include uppercase in your pasword is: " + currentUppercase;

   var numericPromp = window.prompt(currentLengthMessage + LINE_BREAK + currentLowercaseMessage  + LINE_BREAK + currentUppercaseMessage + LINE_BREAK
                      + LINE_BREAK + "Would you like numeric characters in your password? " + ONE4YES_TWO4NO);
   numericPromp = parseInt(numericPromp);
   switch (numericPromp) {
     case 1:
      passwordSpecs.numeric = true;
      break;
     case 2:
      passwordSpecs.numeric = false;
      break;
     default:
       window.alert(CANCEL_INCORRECT + LINE_BREAK + TRYAGAIN);
       confirmNumeric();
       break;
   }
};

var confirmSymbolIncluded = function() {
   var currentLengthMessage = "You chose password's length to be: " + passwordSpecs.pwlength;

   var currentLowercase = (passwordSpecs.lowercase)? PRINT_YES : PRINT_NO;
   var currentLowercaseMessage = "Your response to include lowercase in your pasword is: " + currentLowercase;

   var currentUppercase = passwordSpecs.uppercase? PRINT_YES : PRINT_NO;
   var currentUppercaseMessage = "Your response to include uppercase in your pasword is: " + currentUppercase;

   var currentNumeric = passwordSpecs.numeric? PRINT_YES : PRINT_NO;
   var currentNumericMessage = "Your response to include numeric characters in your pasword is: " + currentNumeric;

   var currentSummary = currentLengthMessage + LINE_BREAK + currentLowercaseMessage  + LINE_BREAK
                        + currentUppercaseMessage + LINE_BREAK + currentNumericMessage + LINE_BREAK

   var symbolicPromp = window.prompt(currentSummary + LINE_BREAK + "Would you like special characters in your password? " + ONE4YES_TWO4NO);
   
   symbolicPromp = parseInt(symbolicPromp);
   switch (symbolicPromp) {
     case 1:
      passwordSpecs.symbolincluded = true;
      var currentSymbolicMessage = "Your response to include special characters in your pasword is: " + PRINT_YES + LINE_BREAK;
      window.alert(currentSummary + currentSymbolicMessage);

      break;
     case 2:
      passwordSpecs.symbolincluded = false;
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

 // >6w;+`.+t8+:je$o,-=p3 
 //  ">6w;H.+t8-=p3";
var existedUppercase = function(pw){
   console.log(pw);
   console.log(pw.length);
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
   console.log(found);
   return found;
 }

 var existedLowercase = function(pw){
   console.log(pw);
   console.log(pw.length);
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

 // javascript method isNaN()  returns true if a value is Not-a-Number so want to return the opposite
 function isNumeric(letter){
   return !isNaN(letter)
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

// Gather client responses and feed them into object passwordSpecs that can be accessed later for implementation
var gatherSpecs = function(){
   getProperLength();
   confirmLowercase();
   confirmUppercase();
   confirmNumeric();
   confirmSymbolIncluded();

   // // PRINT TEST ONLY
   // pwResult.textContent = "You want: your pw lowercase to be: " + passwordSpecs.lowercase  + LINE_BREAK
   //                       + " and uppercase to be: " + passwordSpecs.uppercase + LINE_BREAK
   //                       + " and numeric to be: " + passwordSpecs.numeric + LINE_BREAK
   //                       + " and symbol-included to be: " + passwordSpecs.symbolic + LINE_BREAK + LINE_BREAK
   //                       + "Your password is: "

};

// Break-down given specs and iamplement the password creation accordingly
var implementSpecs = function(){

   let validChars = EMPTY_STRING;
   let generatedPassword = EMPTY_STRING;

   pwResult.textContent = EMPTY_STRING;
   valPanel.textContent = EMPTY_STRING;

   let wishlistHasLowercase = passwordSpecs.lowercase;
   let wishlistHasUppercase = passwordSpecs.uppercase;
   let wishlistHasNumber = passwordSpecs.numeric;
   let wishlistHasSpecialChar = passwordSpecs.symbolincluded;

   // // Hardcoded value for quick test only
   // let wishlistHasLowercase = true;
   // let wishlistHasUppercase = true;
   // let wishlistHasNumber = true;
   // let wishlistHasSpecialChar = true;
   // validChars = lowercaseLetters + uppercaseLetters + digitZeroToNine + allSymbols

   // Determine which character-type is included from which the password will be generated.
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
   
   console.log(validChars);

   // -- When the client says NO to all the criteria questions,
   // -- no password should be generated (per TA) and print this message as the result
   if((!wishlistHasLowercase) && (!wishlistHasUppercase) && (!wishlistHasNumber) && (!wishlistHasSpecialChar))
   {
      generatedPassword = NO_PW_MSG;
      valPanel.style.textAlign = "center";
      valPanel.style.display = "block";
      valPanel.textContent = NO_PW_MSG + " as You Answered NO to All The Character-type Criteria Questions"; 
   }
   
   // -- When the client says YES to at least 1 criteria question,
   // -- generate the passwordand & check whether generated pw length is proper  
   if(wishlistHasLowercase || wishlistHasUppercase || wishlistHasNumber || wishlistHasSpecialChar)
   {
      
      for (let i = 0; i < parseInt(passwordSpecs.pwlength); i++) 
      {
         const index = Math.floor(Math.random() * validChars.length); // pick randomly a number as index from 0 to upperbound - 1 
         generatedPassword += validChars[index]; // extract the letter per index position and append it to var generatedPassword in each iteration
      }

      // // Generate the pw of length 33 hardcoded - testing only
      // for (let i = 0; i < 128; i++) 
      // {
      //    const index = Math.floor(Math.random() * validChars.length); 
      //    generatedPassword += validChars[index];          
      // }

      if (didLengthMeetRange(generatedPassword))
      {
            valPanel.style.textAlign = "left";
            valPanel.style.display = "block";
            valPanel.textContent =  OPEN_MSG + generatedPassword + " has " + generatedPassword.length.toString() + " characters within range [8,128]." + LINE_BREAK; 
      }
        
   }
   
   // -- Validate the generated password against active specs (to which the client says YES)   
   // -- to make sure it indeed has at least one letter that satisfies the desired character type:

   if (wishlistHasLowercase) 
   {
      var found = existedLowercase(generatedPassword);
      console.log("found-lowercase value is: " + found);
      valPanel.style.textAlign = "left";
      valPanel.style.display = "block";
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
      console.log("found-uppercase value is: " + found);
      valPanel.style.textAlign = "left";
      valPanel.style.display = "block";
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
      valPanel.style.textAlign = "left";
      valPanel.style.display = "block";
      if (hasNumericCharacter(generatedPassword))
      {
         valPanel.textContent += OPEN_MSG + generatedPassword + " reflects numeric character(s)." + LINE_BREAK;
      } else {
         valPanel.textContent += OPEN_MSG + generatedPassword + " does not reflect numeric character(s)." + LINE_BREAK;
      }
   }

   if(wishlistHasSpecialChar)
   {
      // PRINT TEST ONLY
      valPanel.style.textAlign = "left";
      valPanel.style.display = "block";
      if(detecteCharSpecial(generatedPassword)){
         valPanel.textContent += OPEN_MSG + generatedPassword + " reflects special character(s)."+ LINE_BREAK;  
      } else {
         valPanel.textContent += OPEN_MSG + generatedPassword + " does not reflect special character(s)."+ LINE_BREAK;  
      }
   }

   pwResult.textContent = generatedPassword; // print final result
};

// Object passwordSpecs encapsulates all password requirement specifications 
var passwordSpecs = {
   // treat pw length as string for now
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
   // doSomthingAnything: function() {
   //   if (condition) {
   //     window.alert("something");
   //   } else {
   //     window.alert("something else");
   //   }
   // },

 };

generateBtn.addEventListener("click", function(){   
   gatherSpecs();
   implementSpecs();
});
