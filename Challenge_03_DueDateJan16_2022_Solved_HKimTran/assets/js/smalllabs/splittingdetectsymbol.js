const symbolFineByItSelf = "~!@#$%^&*()_+`-={|}[]:;<>?,./";  
const symbolNeedsEscapeChar = "\"\'\\" ; 
const LINE_BREAK = '\r\n';  
const EMPTY_STRING = '';

var allSymbols = symbolFineByItSelf + symbolNeedsEscapeChar;

var pwResult = document.getElementById("password");

var allIndividualSymbols = [];
//allIndividualSymbols =  allSymbols.split(EMPTY_STRING).reverse(); // TO TEST THE \ CHAR
allIndividualSymbols =  allSymbols.split(EMPTY_STRING);


pwResult.textContent = allIndividualSymbols.length.toString()  + LINE_BREAK 
                        + allIndividualSymbols + LINE_BREAK 
                        + allIndividualSymbols[2].toString();

// generatedPassword = "\\6w;+`+t8+:je$o-=p3";     
// generatedPassword = "\\p3"; // TO TEST THE \ CHARACTER AS LAST CHAR IN THE ARRAY WHEN allIndividualSymbols IS NOT REVERSED
var generatedPassword = "\\"; 

var detecteCharSpecial = function(pw){
   if (pw.length <= 1)
   {
      for(var i = 0; i <= allIndividualSymbols.length; i++)
      { 
         if(pw === allIndividualSymbols[i]){
            console.log(pw.toString() + " is a special letter" );
            return true;
         }
            
      }
   }
   else
   {
      console.log(allIndividualSymbols);
      for(var i = 0; i <= allIndividualSymbols.length; i++)
      {
         // -- if the index is not negative, the symbol at which the index pointed at, is found in the password. 
         target = pw.indexOf(allIndividualSymbols[i]);
         if(target > -1)
         {
            console.log(pw[target].toString() + " found at index " + target + " is a special letter" );
            return true;
         }
      }
   }
   
}    

detecteCharSpecial (generatedPassword);